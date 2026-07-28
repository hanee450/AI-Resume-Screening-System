import React from 'react';
import { 
  FileText, 
  Users, 
  GitCompare, 
  BarChart3, 
  Plus, 
  Sparkles, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'candidates' | 'jds' | 'compare' | 'analytics';
  setActiveTab: (tab: 'candidates' | 'jds' | 'compare' | 'analytics') => void;
  onOpenUpload: () => void;
  onOpenJDCreator: () => void;
  onResetData: () => void;
  selectedCompareCount: number;
  totalCandidatesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenJDCreator,
  onResetData,
  selectedCompareCount,
  totalCandidatesCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-100">AI Resume Screening</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-slate-400">Automated Applicant Matching & Skill Gap Evaluator</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'candidates'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Candidates</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-900/60 rounded-md font-semibold text-slate-300">
                {totalCandidatesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('jds')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'jds'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Job Profiles</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Side-by-Side Compare</span>
              {selectedCompareCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-indigo-500 text-white rounded-full font-bold">
                  {selectedCompareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              title="Reset sample candidates & jobs"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenJDCreator}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Job Generator</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Screen Resume</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs Bar */}
        <div className="flex md:hidden border-t border-slate-800 py-2 justify-around">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`flex flex-col items-center gap-1 text-[11px] ${
              activeTab === 'candidates' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidates ({totalCandidatesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('jds')}
            className={`flex flex-col items-center gap-1 text-[11px] ${
              activeTab === 'jds' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Job Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex flex-col items-center gap-1 text-[11px] ${
              activeTab === 'compare' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare ({selectedCompareCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 text-[11px] ${
              activeTab === 'analytics' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>

      </div>
    </header>
  );
};
