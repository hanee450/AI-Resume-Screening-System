import React from 'react';
import { CandidateResume, ScreeningResult } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  Check, 
  Clock, 
  ShieldAlert,
  GitCompare
} from 'lucide-react';

interface CandidateCardProps {
  candidate: CandidateResume;
  screeningResult?: ScreeningResult;
  onViewDetails: (candidate: CandidateResume) => void;
  onStatusChange: (candidateId: string, status: 'Pending' | 'Shortlisted' | 'Reviewed' | 'Rejected') => void;
  isCompareSelected: boolean;
  onToggleCompare: (candidateId: string) => void;
  isLoadingScreening?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  screeningResult,
  onViewDetails,
  onStatusChange,
  isCompareSelected,
  onToggleCompare,
  isLoadingScreening,
}) => {
  const fitCategory = screeningResult?.fitCategory || 'Potential Fit';
  const score = screeningResult?.overallScore ?? 0;

  // Category styling
  const getBadgeStyle = () => {
    if (fitCategory === 'Strong Fit') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        scoreBg: 'bg-emerald-500 text-white',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      };
    }
    if (fitCategory === 'Potential Fit') {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        scoreBg: 'bg-amber-500 text-white',
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      scoreBg: 'bg-rose-500 text-white',
      icon: <XCircle className="w-4 h-4 text-rose-600" />
    };
  };

  const style = getBadgeStyle();

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-md relative overflow-hidden flex flex-col justify-between ${
      isCompareSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80 hover:border-slate-300'
    }`}>
      
      {/* Top Banner / Header */}
      <div>
        <div className="p-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Compare Checkbox */}
            <div className="pt-1">
              <input
                type="checkbox"
                checked={isCompareSelected}
                onChange={() => onToggleCompare(candidate.id)}
                title="Select to compare side-by-side"
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 
                  onClick={() => onViewDetails(candidate)}
                  className="font-bold text-base text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  {candidate.name}
                </h3>
                {candidate.status && candidate.status !== 'Pending' && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    candidate.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                    candidate.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {candidate.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{candidate.currentRole}</p>
            </div>
          </div>

          {/* AI Match Score Badge */}
          {screeningResult ? (
            <div className="flex flex-col items-end">
              <div className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-2xs ${style.bg}`}>
                {style.icon}
                <span>{score}% Match</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-semibold">{fitCategory}</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium animate-pulse">
              Analyzing...
            </div>
          )}
        </div>

        {/* Candidate Quick Stats */}
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.yearsExperience} Years Exp</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.location}</span>
            </span>
          </div>

          {/* AI Summary snippet */}
          {screeningResult?.summary && (
            <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              "{screeningResult.summary}"
            </p>
          )}

          {/* Matched vs Missing Skills Preview */}
          {screeningResult && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Matched Skills ({screeningResult.matchedSkills.length})</span>
                {screeningResult.missingSkills.length > 0 && (
                  <span className="font-medium text-amber-600">{screeningResult.missingSkills.length} Missing</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {screeningResult.matchedSkills.slice(0, 4).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[10px] font-medium flex items-center gap-0.5"
                  >
                    <Check className="w-2.5 h-2.5" />
                    {skill}
                  </span>
                ))}
                {screeningResult.matchedSkills.length > 4 && (
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px]">
                    +{screeningResult.matchedSkills.length - 4} more
                  </span>
                )}

                {screeningResult.missingSkills.slice(0, 2).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100/80 rounded-md text-[10px] font-medium"
                  >
                    Missing: {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onStatusChange(candidate.id, 'Shortlisted')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
              candidate.status === 'Shortlisted'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border-slate-200'
            }`}
          >
            Shortlist
          </button>
          <button
            onClick={() => onStatusChange(candidate.id, 'Rejected')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
              candidate.status === 'Rejected'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 border-slate-200'
            }`}
          >
            Reject
          </button>
        </div>

        <button
          onClick={() => onViewDetails(candidate)}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>Full Report</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
