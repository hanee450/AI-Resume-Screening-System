import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client to prevent crashes if key is initially missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY is missing. AI endpoints will return fallback/mock data if unavailable.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// System prompt for HR screening evaluator
const SCREENING_SYSTEM_INSTRUCTION = `You are an expert HR Talent Acquisition Specialist and Senior Engineering Manager. 
Your job is to objectively analyze candidate resumes against job descriptions.
Provide realistic, fair, evidence-based evaluations based purely on skills, experience, and domain alignment.
Be strict about required skills and years of experience while recognizing transferable technical background.`;

// Helper endpoint: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint 1: Screen Single Resume
app.post('/api/screen-resume', async (req, res) => {
  try {
    const { jobDescription, candidate } = req.body;
    if (!jobDescription || !candidate) {
      return res.status(400).json({ error: 'Missing jobDescription or candidate' });
    }

    const ai = getAI();
    if (!process.env.GEMINI_API_KEY) {
      // Fallback heuristic scoring if no key provided
      const matchedSkills = candidate.skills.filter((s: string) => 
        jobDescription.requiredSkills.some((reqSkill: string) => reqSkill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(reqSkill.toLowerCase()))
      );
      const missingSkills = jobDescription.requiredSkills.filter((reqSkill: string) =>
        !candidate.skills.some((s: string) => reqSkill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(reqSkill.toLowerCase()))
      );
      const ratio = matchedSkills.length / Math.max(1, jobDescription.requiredSkills.length);
      const score = Math.round(ratio * 100);
      
      const category = score >= 75 ? 'Strong Fit' : score >= 50 ? 'Potential Fit' : 'Unsuitable';

      return res.json({
        candidateId: candidate.id,
        jobDescriptionId: jobDescription.id,
        overallScore: score,
        fitCategory: category,
        summary: `Candidate ${candidate.name} matches ${matchedSkills.length} out of ${jobDescription.requiredSkills.length} required skills for ${jobDescription.title}.`,
        skillMatchScore: Math.round(ratio * 90 + 10),
        experienceMatchScore: candidate.yearsExperience >= jobDescription.minYearsExperience ? 90 : 50,
        educationMatchScore: 85,
        matchedSkills,
        missingSkills,
        keyStrengths: matchedSkills.length > 0 ? matchedSkills.slice(0, 3) : ['General domain background'],
        concernsOrGaps: missingSkills.length > 0 ? missingSkills.slice(0, 3) : ['Needs deeper verification on niche tooling'],
        generatedInterviewQuestions: [
          {
            question: `Can you walk us through your practical experience with ${matchedSkills[0] || jobDescription.requiredSkills[0]}?`,
            targetSkillOrGap: matchedSkills[0] || 'Core Technical Stack',
            reason: 'Verify depth of experience in key required technology',
            category: 'Technical'
          }
        ],
        outreachEmailDraft: {
          subject: `Interview Invitation for ${jobDescription.title} - ${candidate.name}`,
          body: `Hi ${candidate.name.split(' ')[0]},\n\nWe were impressed by your background and would love to schedule an initial discussion for the ${jobDescription.title} role.\n\nBest regards,\nTalent Acquisition Team`
        },
        rejectionEmailDraft: {
          subject: `Update on your application for ${jobDescription.title}`,
          body: `Hi ${candidate.name.split(' ')[0]},\n\nThank you for applying to the ${jobDescription.title} role. While your background is impressive, we have decided to move forward with candidates whose skill sets align more closely with our immediate requirements.\n\nBest regards,\nTalent Acquisition Team`
        },
        processedAt: new Date().toISOString()
      });
    }

    const prompt = `Evaluate the candidate resume against the job description below.

JOB DESCRIPTION:
Title: ${jobDescription.title}
Min Years Exp Required: ${jobDescription.minYearsExperience}
Required Skills: ${jobDescription.requiredSkills.join(', ')}
Preferred Skills: ${jobDescription.preferredSkills.join(', ')}
Responsibilities & Summary: ${jobDescription.summaryText}

CANDIDATE RESUME:
Name: ${candidate.name}
Years Experience: ${candidate.yearsExperience}
Skills: ${candidate.skills.join(', ')}
Education: ${candidate.education}
Work History Summary: ${JSON.stringify(candidate.workHistory)}
Raw Resume Text:
${candidate.rawText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SCREENING_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: 'Score from 0 to 100 based on overall match' },
            fitCategory: { type: Type.STRING, description: 'Must be "Strong Fit", "Potential Fit", or "Unsuitable"' },
            summary: { type: Type.STRING, description: '2-3 sentence executive evaluation summary' },
            skillMatchScore: { type: Type.INTEGER, description: '0-100 score for technical and soft skill match' },
            experienceMatchScore: { type: Type.INTEGER, description: '0-100 score for years and relevance of work experience' },
            educationMatchScore: { type: Type.INTEGER, description: '0-100 score for degree and academic background match' },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of candidate skills that explicitly match job requirement' },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Required skills missing or insufficient in candidate resume' },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 3 distinct candidate strengths for this role' },
            concernsOrGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 3 gaps, red flags, or areas requiring technical interview verification' },
            generatedInterviewQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  targetSkillOrGap: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  category: { type: Type.STRING, description: '"Technical", "Behavioral", or "Problem Solving"' }
                },
                required: ['question', 'targetSkillOrGap', 'reason', 'category']
              }
            },
            outreachEmailDraft: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING }
              },
              required: ['subject', 'body']
            },
            rejectionEmailDraft: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING }
              },
              required: ['subject', 'body']
            }
          },
          required: [
            'overallScore',
            'fitCategory',
            'summary',
            'skillMatchScore',
            'experienceMatchScore',
            'educationMatchScore',
            'matchedSkills',
            'missingSkills',
            'keyStrengths',
            'concernsOrGaps',
            'generatedInterviewQuestions',
            'outreachEmailDraft',
            'rejectionEmailDraft'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    
    // Ensure valid category enum
    let fitCategory: 'Strong Fit' | 'Potential Fit' | 'Unsuitable' = 'Potential Fit';
    if (parsed.fitCategory === 'Strong Fit' || parsed.fitCategory === 'Unsuitable') {
      fitCategory = parsed.fitCategory;
    } else if (parsed.overallScore >= 75) {
      fitCategory = 'Strong Fit';
    } else if (parsed.overallScore < 50) {
      fitCategory = 'Unsuitable';
    }

    res.json({
      candidateId: candidate.id,
      jobDescriptionId: jobDescription.id,
      overallScore: parsed.overallScore ?? 70,
      fitCategory,
      summary: parsed.summary || 'Candidate evaluated successfully.',
      skillMatchScore: parsed.skillMatchScore ?? 70,
      experienceMatchScore: parsed.experienceMatchScore ?? 70,
      educationMatchScore: parsed.educationMatchScore ?? 70,
      matchedSkills: parsed.matchedSkills || [],
      missingSkills: parsed.missingSkills || [],
      keyStrengths: parsed.keyStrengths || [],
      concernsOrGaps: parsed.concernsOrGaps || [],
      generatedInterviewQuestions: parsed.generatedInterviewQuestions || [],
      outreachEmailDraft: parsed.outreachEmailDraft || { subject: '', body: '' },
      rejectionEmailDraft: parsed.rejectionEmailDraft || { subject: '', body: '' },
      processedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error in /api/screen-resume:', err);
    res.status(500).json({ error: err.message || 'Failed to screen resume' });
  }
});

// Endpoint 2: Batch Screen Resumes
app.post('/api/batch-screen', async (req, res) => {
  try {
    const { jobDescription, candidates } = req.body;
    if (!jobDescription || !Array.isArray(candidates)) {
      return res.status(400).json({ error: 'Invalid batch screening request payload' });
    }

    const results = [];
    for (const candidate of candidates) {
      try {
        // Reuse internal screening logic
        const fetchRes = await fetch(`http://127.0.0.1:${PORT}/api/screen-resume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription, candidate })
        });
        const data = await fetchRes.json();
        results.push(data);
      } catch (err) {
        console.error(`Error screening candidate ${candidate.id}:`, err);
      }
    }

    res.json({ results });
  } catch (err: any) {
    console.error('Error in /api/batch-screen:', err);
    res.status(500).json({ error: err.message || 'Failed to process batch screening' });
  }
});

// Endpoint 3: AI Job Description Generator
app.post('/api/generate-jd', async (req, res) => {
  try {
    const { promptText, department } = req.body;
    if (!promptText) {
      return res.status(400).json({ error: 'Prompt text is required' });
    }

    const ai = getAI();
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        jobDescription: {
          id: 'jd-' + Date.now(),
          title: promptText,
          department: department || 'Engineering',
          location: 'Hybrid / Remote',
          minYearsExperience: 3,
          educationLevel: 'Bachelor degree in relevant field',
          requiredSkills: ['Problem Solving', 'Team Collaboration', 'Communication'],
          preferredSkills: ['Agile Methodologies', 'Cloud Platforms'],
          responsibilities: [
            'Lead key technical initiatives and drive solution architecture.',
            'Collaborate with cross-functional product and engineering teams.',
            'Maintain high code quality standards and mentor junior team members.'
          ],
          summaryText: `Generated Job Description for ${promptText} role.`
        }
      });
    }

    const prompt = `Create a standard, professional, detailed Job Description based on this user prompt:
"${promptText}"
Department: ${department || 'General'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an enterprise talent acquisition lead crafting clean, highly focused Job Descriptions with realistic technical skill requirements.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            department: { type: Type.STRING },
            location: { type: Type.STRING },
            minYearsExperience: { type: Type.INTEGER },
            educationLevel: { type: Type.STRING },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            preferredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            summaryText: { type: Type.STRING }
          },
          required: ['title', 'department', 'location', 'minYearsExperience', 'educationLevel', 'requiredSkills', 'preferredSkills', 'responsibilities', 'summaryText']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = 'jd-gen-' + Date.now();
    res.json({ jobDescription: parsed });
  } catch (err: any) {
    console.error('Error in /api/generate-jd:', err);
    res.status(500).json({ error: err.message || 'Failed to generate job description' });
  }
});

// Endpoint 4: Parse Raw Text Resume into Structured Data
app.post('/api/parse-resume-text', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'rawText string is required' });
    }

    const ai = getAI();
    if (!process.env.GEMINI_API_KEY) {
      // Basic heuristic parser
      const lines = rawText.split('\n').filter(l => l.trim().length > 0);
      const name = lines[0] || 'Unknown Candidate';
      return res.json({
        candidate: {
          id: 'cand-' + Date.now(),
          name: name.toUpperCase(),
          email: 'candidate@example.com',
          phone: '+91-98765-00000',
          location: 'India',
          currentRole: 'Software Professional',
          yearsExperience: 3,
          skills: ['Communication', 'Problem Solving', 'Data Analysis', 'Python'],
          education: 'Bachelor Degree',
          workHistory: [
            {
              title: 'Software Role',
              company: 'Tech Enterprise',
              duration: '2021 - Present',
              highlights: ['Worked on core software modules and projects.']
            }
          ],
          rawText: rawText,
          status: 'Pending'
        }
      });
    }

    const prompt = `Parse the following raw candidate resume text into structured JSON fields.

RAW RESUME TEXT:
${rawText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Extract candidate resume details accurately from unstructured text.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            currentRole: { type: Type.STRING },
            yearsExperience: { type: Type.INTEGER },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            education: { type: Type.STRING },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            workHistory: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['title', 'company', 'highlights']
              }
            }
          },
          required: ['name', 'skills', 'education', 'yearsExperience']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const candidate = {
      id: 'cand-parsed-' + Date.now(),
      name: parsed.name || 'Candidate',
      email: parsed.email || 'not-provided@email.com',
      phone: parsed.phone || 'N/A',
      location: parsed.location || 'Remote',
      currentRole: parsed.currentRole || 'Applicant',
      yearsExperience: parsed.yearsExperience ?? 2,
      skills: parsed.skills || [],
      education: parsed.education || 'Degree completed',
      certifications: parsed.certifications || [],
      workHistory: parsed.workHistory || [],
      rawText: rawText,
      status: 'Pending'
    };

    res.json({ candidate });
  } catch (err: any) {
    console.error('Error in /api/parse-resume-text:', err);
    res.status(500).json({ error: err.message || 'Failed to parse resume text' });
  }
});

// Endpoint 5: Compare Candidates Side-by-Side
app.post('/api/compare-candidates', async (req, res) => {
  try {
    const { jobDescription, candidates, screeningResults } = req.body;
    if (!jobDescription || !Array.isArray(candidates) || !Array.isArray(screeningResults)) {
      return res.status(400).json({ error: 'Missing candidates or screening results for comparison' });
    }

    const ai = getAI();
    if (!process.env.GEMINI_API_KEY) {
      const topCand = candidates[0];
      return res.json({
        comparison: {
          summary: `Compared ${candidates.length} candidates. Candidate ${topCand?.name} displays the highest technical skill coverage.`,
          recommendedCandidateId: topCand?.id || '',
          recommendationReason: `Strongest match across key core competencies required for ${jobDescription.title}.`,
          criteriaComparison: [
            {
              criteria: 'Core Technical Match',
              candidateRatings: candidates.reduce((acc, c) => ({ ...acc, [c.id]: 'High Alignment' }), {})
            },
            {
              criteria: 'Experience Depth',
              candidateRatings: candidates.reduce((acc, c) => ({ ...acc, [c.id]: `${c.yearsExperience} Years` }), {})
            },
            {
              criteria: 'Risk Factor / Gaps',
              candidateRatings: candidates.reduce((acc, c) => ({ ...acc, [c.id]: 'Low Risk' }), {})
            }
          ]
        }
      });
    }

    const prompt = `Compare the following candidates side-by-side for the position of "${jobDescription.title}".
Job Requirements: ${jobDescription.requiredSkills.join(', ')}

Candidate Profiles & Screening Summaries:
${candidates.map((c: any) => {
  const result = screeningResults.find((r: any) => r.candidateId === c.id);
  return `ID: ${c.id} | Name: ${c.name} | Overall Score: ${result?.overallScore || 'N/A'}/100
Category: ${result?.fitCategory || 'N/A'}
Matched Skills: ${result?.matchedSkills?.join(', ') || 'N/A'}
Missing Skills: ${result?.missingSkills?.join(', ') || 'N/A'}
Summary: ${result?.summary || 'N/A'}`;
}).join('\n\n')}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an executive hiring panel lead comparing shortlisted candidates for a decision matrix.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendedCandidateId: { type: Type.STRING },
            recommendationReason: { type: Type.STRING },
            criteriaComparison: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criteria: { type: Type.STRING },
                  candidateRatings: {
                    type: Type.OBJECT,
                    description: 'Map of candidate ID to rating string (e.g. {"cand-01": "Strong alignment with 90% skill match"})'
                  }
                },
                required: ['criteria', 'candidateRatings']
              }
            }
          },
          required: ['summary', 'recommendedCandidateId', 'recommendationReason', 'criteriaComparison']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ comparison: parsed });
  } catch (err: any) {
    console.error('Error in /api/compare-candidates:', err);
    res.status(500).json({ error: err.message || 'Failed to compare candidates' });
  }
});

// Setup Vite Development or Production Static Fallback
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
