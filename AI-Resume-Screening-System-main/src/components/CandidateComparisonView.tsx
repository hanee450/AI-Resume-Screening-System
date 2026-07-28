import React, { useState } from 'react';
import { CandidateResume, JobDescription, ScreeningResult, CandidateComparison } from '../types';
import { GitCompare, Sparkles, Trophy, CheckCircle2, AlertTriangle, Loader2, UserCheck } from 'lucide-react';

interface CandidateComparisonViewProps {
  jobDescription: JobDescription;
  candidates: CandidateResume[];
  screeningResults: Record<string, ScreeningResult>;
  onStatusChange: (candidateId: string, status: 'Pending' | 'Shortlisted' | 'Reviewed' | 'Rejected') => void;
}

export const CandidateComparisonView: React.FC<CandidateComparisonViewProps> = ({
  jobDescription,
  candidates,
  screeningResults,
  onStatusChange,
}) => {
  const [comparison, setComparison] = useState<CandidateComparison | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleGenerateComparison = async () => {
    if (candidates.length < 2) return;
    setIsComparing(true);

    try {
      const resultsArray = candidates.map(c => screeningResults[c.id]).filter(Boolean);
      const res = await fetch('/api/compare-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          candidates,
          screeningResults: resultsArray
        })
      });
      const data = await res.json();
      setComparison(data.comparison);
      setIsComparing(false);
    } catch (err) {
      console.error(err);
      setIsComparing(false);
    }
  };

  if (candidates.length < 2) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <GitCompare className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Side-by-Side Candidate Comparison</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Please select at least <strong>2 candidates</strong> using the checkboxes on candidate cards in the Candidates view to generate a comprehensive AI comparative matrix and hiring recommendation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Comparing {candidates.length} Candidates</h2>
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-full">
              {jobDescription.title}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing technical skills, experience alignment, and risk factors side-by-side.
          </p>
        </div>

        <button
          onClick={handleGenerateComparison}
          disabled={isComparing}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
        >
          {isComparing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Decision Matrix...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{comparison ? 'Re-Run AI Comparison' : 'Generate AI Comparison Matrix'}</span>
            </>
          )}
        </button>
      </div>

      {/* AI Top Pick Banner */}
      {comparison && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-indigo-50 border border-emerald-200/80 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Top Recommended Applicant</span>
              <h3 className="text-lg font-bold text-slate-900">
                {candidates.find(c => c.id === comparison.recommendedCandidateId)?.name || 'Top Candidate'}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-emerald-100 font-medium">
            "{comparison.recommendationReason}"
          </p>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="p-4 font-bold min-w-[180px]">Evaluation Metric</th>
                {candidates.map((c) => {
                  const res = screeningResults[c.id];
                  const isTopPick = comparison?.recommendedCandidateId === c.id;
                  return (
                    <th key={c.id} className={`p-4 font-bold min-w-[220px] ${isTopPick ? 'bg-indigo-950/80 text-indigo-300' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-white">{c.name}</div>
                          <div className="text-[11px] font-normal text-slate-400">{c.currentRole}</div>
                        </div>
                        {res && (
                          <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                            res.fitCategory === 'Strong Fit' ? 'bg-emerald-500 text-white' :
                            res.fitCategory === 'Potential Fit' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                          }`}>
                            {res.overallScore}%
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              
              {/* Row 1: Overall Match */}
              <tr className="bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">Overall AI Category</td>
                {candidates.map(c => (
                  <td key={c.id} className="p-4 font-semibold text-slate-800">
                    {screeningResults[c.id]?.fitCategory || 'Pending'}
                  </td>
                ))}
              </tr>

              {/* Row 2: Years Experience */}
              <tr>
                <td className="p-4 font-bold text-slate-900">Years Experience</td>
                {candidates.map(c => (
                  <td key={c.id} className="p-4">
                    {c.yearsExperience} Years (Req: {jobDescription.minYearsExperience} Yrs)
                  </td>
                ))}
              </tr>

              {/* Row 3: Matched Skills */}
              <tr className="bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">Matched Skills</td>
                {candidates.map(c => {
                  const matched = screeningResults[c.id]?.matchedSkills || [];
                  return (
                    <td key={c.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {matched.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Missing Skills */}
              <tr>
                <td className="p-4 font-bold text-slate-900">Missing Required Skills</td>
                {candidates.map(c => {
                  const missing = screeningResults[c.id]?.missingSkills || [];
                  return (
                    <td key={c.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {missing.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-md text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                        {missing.length === 0 && <span className="text-emerald-600 font-semibold text-[11px]">None (100% Skill Coverage)</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Dynamic Criteria Comparison Rows if AI generated */}
              {comparison?.criteriaComparison.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
                  <td className="p-4 font-bold text-slate-900">{row.criteria}</td>
                  {candidates.map(c => (
                    <td key={c.id} className="p-4 text-xs">
                      {row.candidateRatings[c.id] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Row: Quick Action */}
              <tr className="bg-slate-900/5">
                <td className="p-4 font-bold text-slate-900">Decision Action</td>
                {candidates.map(c => (
                  <td key={c.id} className="p-4">
                    <button
                      onClick={() => onStatusChange(c.id, 'Shortlisted')}
                      className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Shortlist {c.name.split(' ')[0]}</span>
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
