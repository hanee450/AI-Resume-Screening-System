import React from 'react';
import { CandidateResume, JobDescription, ScreeningResult } from '../types';
import { Users, CheckCircle2, AlertTriangle, BarChart3, TrendingUp, ShieldAlert, Award } from 'lucide-react';

interface AnalyticsViewProps {
  jobDescription: JobDescription;
  candidates: CandidateResume[];
  screeningResults: Record<string, ScreeningResult>;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  jobDescription,
  candidates,
  screeningResults,
}) => {
  const total = candidates.length;
  const results: ScreeningResult[] = Object.values(screeningResults);

  const strongFits = results.filter(r => r.fitCategory === 'Strong Fit').length;
  const potentialFits = results.filter(r => r.fitCategory === 'Potential Fit').length;
  const unsuitableFits = results.filter(r => r.fitCategory === 'Unsuitable').length;

  const avgScore = results.length > 0 
    ? Math.round(results.reduce((acc, r) => acc + r.overallScore, 0) / results.length) 
    : 0;

  // Calculate missing skill frequencies
  const missingSkillCounts: Record<string, number> = {};
  results.forEach(r => {
    r.missingSkills.forEach(skill => {
      missingSkillCounts[skill] = (missingSkillCounts[skill] || 0) + 1;
    });
  });

  const missingSkillsSorted = Object.entries(missingSkillCounts)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Talent Pool Screening Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Aggregate evaluation metrics and skill gap breakdown for <strong className="text-slate-800">{jobDescription.title}</strong>
        </p>
      </div>

      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Applicants</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{total}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Evaluated against active JD</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Average Match Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{avgScore}%</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Mean AI fit score</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Top Tier Candidates</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-indigo-600">{strongFits}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            {total > 0 ? Math.round((strongFits / total) * 100) : 0}% of candidate pool
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Unsuitable / Gaps</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-500">{unsuitableFits}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Missing critical stack prerequisites</div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Match Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Candidate Category Distribution
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700">Strong Fit (≥ 75% Match)</span>
                <span className="text-slate-800">{strongFits} ({total > 0 ? Math.round((strongFits / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${total > 0 ? (strongFits / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700">Potential Fit (50% - 74% Match)</span>
                <span className="text-slate-800">{potentialFits} ({total > 0 ? Math.round((potentialFits / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${total > 0 ? (potentialFits / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-700">Unsuitable (&lt; 50% Match)</span>
                <span className="text-slate-800">{unsuitableFits} ({total > 0 ? Math.round((unsuitableFits / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${total > 0 ? (unsuitableFits / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Missing Skill Frequencies */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Most Common Missing Skills in Talent Pool
          </h3>

          <div className="space-y-2.5">
            {missingSkillsSorted.length > 0 ? (
              missingSkillsSorted.slice(0, 5).map(([skill, count], i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium">
                  <span className="text-slate-800 font-bold">{skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md font-semibold">
                      Missing in {count} applicant{count > 1 ? 's' : ''} ({Math.round((count / total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic p-4 text-center">No missing skills recorded across candidate pool.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
