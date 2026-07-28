import React, { useState } from 'react';
import { CandidateResume, ScreeningResult } from '../types';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  Mail, 
  Copy, 
  Check, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: CandidateResume | null;
  screeningResult: ScreeningResult | null;
  onClose: () => void;
  onStatusChange: (candidateId: string, status: 'Pending' | 'Shortlisted' | 'Reviewed' | 'Rejected') => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  screeningResult,
  onClose,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'questions' | 'emails'>('overview');
  const [copiedType, setCopiedType] = useState<'outreach' | 'rejection' | null>(null);

  if (!candidate) return null;

  const copyToClipboard = (text: string, type: 'outreach' | 'rejection') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const fitCategory = screeningResult?.fitCategory || 'Potential Fit';
  const score = screeningResult?.overallScore ?? 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              <span className={`px-3 py-0.5 text-xs font-bold rounded-full ${
                fitCategory === 'Strong Fit' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                fitCategory === 'Potential Fit' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {fitCategory} ({score}% Match)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {candidate.currentRole} • {candidate.yearsExperience} Yrs Exp • {candidate.location} • {candidate.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Change Selector */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              {(['Shortlisted', 'Reviewed', 'Rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onStatusChange(candidate.id, st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    candidate.status === st
                      ? st === 'Shortlisted' ? 'bg-emerald-600 text-white' : st === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Match Evaluation</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'skills' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Skill & Experience Gap</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'questions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>AI Interview Questions</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'emails' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Outreach & Email Drafts</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Score Breakdown Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                  <div className="text-xs text-indigo-900 font-semibold mb-1">Technical Skill Match</div>
                  <div className="text-2xl font-black text-indigo-600">{screeningResult?.skillMatchScore ?? 0}%</div>
                  <div className="w-full bg-indigo-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${screeningResult?.skillMatchScore ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div className="text-xs text-emerald-900 font-semibold mb-1">Experience Relevance</div>
                  <div className="text-2xl font-black text-emerald-600">{screeningResult?.experienceMatchScore ?? 0}%</div>
                  <div className="w-full bg-emerald-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${screeningResult?.experienceMatchScore ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
                  <div className="text-xs text-amber-900 font-semibold mb-1">Academic & Qualification</div>
                  <div className="text-2xl font-black text-amber-600">{screeningResult?.educationMatchScore ?? 0}%</div>
                  <div className="w-full bg-amber-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-amber-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${screeningResult?.educationMatchScore ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Executive Recruiter Verdict
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {screeningResult?.summary || 'No evaluation summary generated.'}
                </p>
              </div>

              {/* Strengths & Concerns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key Candidate Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {screeningResult?.keyStrengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Gaps & Verification Areas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {screeningResult?.concernsOrGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Raw Work Experience Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Work Experience Details</h4>
                <div className="space-y-3">
                  {candidate.workHistory.map((history, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{history.title} @ {history.company}</span>
                        <span className="text-slate-500 font-normal">{history.duration}</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-slate-600 list-disc list-inside">
                        {history.highlights.map((hl, j) => (
                          <li key={j}>{hl}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SKILL MATRIX */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Matched Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {screeningResult?.matchedSkills.map((skill, i) => (
                    <div key={i} className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{skill}</span>
                    </div>
                  ))}
                  {(!screeningResult?.matchedSkills || screeningResult.matchedSkills.length === 0) && (
                    <p className="text-xs text-slate-500 italic">No direct required skills matched.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Missing Critical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {screeningResult?.missingSkills.map((skill, i) => (
                    <div key={i} className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>{skill}</span>
                    </div>
                  ))}
                  {(!screeningResult?.missingSkills || screeningResult.missingSkills.length === 0) && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Candidate possesses all required skills specified in Job Description!
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Complete Listed Skills on Resume</h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERVIEW QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>AI-generated interview questions designed specifically to probe {candidate.name}'s weak spots and verify core experience.</span>
              </div>

              <div className="space-y-3">
                {screeningResult?.generatedInterviewQuestions.map((q, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-md">
                        {q.category || 'Technical Question'}
                      </span>
                      <span className="text-slate-500 font-medium">Target: <strong className="text-slate-800">{q.targetSkillOrGap}</strong></span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">"{q.question}"</p>
                    <p className="text-[11px] text-slate-500 italic">Why ask this: {q.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OUTREACH & EMAIL DRAFTS */}
          {activeTab === 'emails' && (
            <div className="space-y-6">
              {/* Interview Outreach Draft */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>Interview Invitation Email Draft</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(
                      `Subject: ${screeningResult?.outreachEmailDraft?.subject}\n\n${screeningResult?.outreachEmailDraft?.body}`,
                      'outreach'
                    )}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {copiedType === 'outreach' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'outreach' ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-50 space-y-2 text-xs">
                  <div className="font-semibold text-slate-800">
                    Subject: <span className="font-normal text-slate-700">{screeningResult?.outreachEmailDraft?.subject}</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-sans">
                    {screeningResult?.outreachEmailDraft?.body}
                  </div>
                </div>
              </div>

              {/* Rejection Draft */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Mail className="w-4 h-4 text-rose-400" />
                    <span>Respectful Rejection Email Draft</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(
                      `Subject: ${screeningResult?.rejectionEmailDraft?.subject}\n\n${screeningResult?.rejectionEmailDraft?.body}`,
                      'rejection'
                    )}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {copiedType === 'rejection' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'rejection' ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-50 space-y-2 text-xs">
                  <div className="font-semibold text-slate-800">
                    Subject: <span className="font-normal text-slate-700">{screeningResult?.rejectionEmailDraft?.subject}</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-sans">
                    {screeningResult?.rejectionEmailDraft?.body}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
