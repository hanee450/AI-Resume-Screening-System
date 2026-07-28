export interface JobDescription {
  id: string;
  title: string;
  department: string;
  location: string;
  minYearsExperience: number;
  educationLevel: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  summaryText: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  highlights: string[];
}

export interface CandidateResume {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  yearsExperience: number;
  skills: string[];
  education: string;
  certifications?: string[];
  workHistory: WorkExperience[];
  rawText: string;
  status?: 'Pending' | 'Shortlisted' | 'Reviewed' | 'Rejected';
}

export interface InterviewQuestion {
  question: string;
  targetSkillOrGap: string;
  reason: string;
  category: 'Technical' | 'Behavioral' | 'Problem Solving';
}

export interface ScreeningResult {
  candidateId: string;
  jobDescriptionId: string;
  overallScore: number; // 0-100
  fitCategory: 'Strong Fit' | 'Potential Fit' | 'Unsuitable';
  summary: string;
  skillMatchScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  keyStrengths: string[];
  concernsOrGaps: string[];
  generatedInterviewQuestions: InterviewQuestion[];
  outreachEmailDraft: {
    subject: string;
    body: string;
  };
  rejectionEmailDraft: {
    subject: string;
    body: string;
  };
  processedAt: string;
}

export interface CandidateComparison {
  summary: string;
  recommendedCandidateId: string;
  recommendationReason: string;
  criteriaComparison: {
    criteria: string;
    candidateRatings: Record<string, string>; // candidateId -> rating/notes
  }[];
}
