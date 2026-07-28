import React, { useState, useEffect } from 'react';
import { JobDescription, CandidateResume, ScreeningResult } from './types';
import { SAMPLE_JOB_DESCRIPTIONS, SAMPLE_CANDIDATES } from './data/sampleData';
import { Navbar } from './components/Navbar';
import { JobDescriptionSelector } from './components/JobDescriptionSelector';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { CandidateComparisonView } from './components/CandidateComparisonView';
import { AnalyticsView } from './components/AnalyticsView';
import { ResumeUploader } from './components/ResumeUploader';
import { AIJDCreatorModal } from './components/AIJDCreatorModal';

import { 
  Search, 
  Filter, 
  Users, 
  Sparkles, 
  Loader2, 
  Plus, 
  CheckCircle2, 
  GitCompare, 
  RotateCcw,
  Layers,
  FileText
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'candidates' | 'jds' | 'compare' | 'analytics'>('candidates');
  
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>(SAMPLE_JOB_DESCRIPTIONS);
  const [selectedJD, setSelectedJD] = useState<JobDescription>(SAMPLE_JOB_DESCRIPTIONS[0]);
  
  const [candidates, setCandidates] = useState<CandidateResume[]>(SAMPLE_CANDIDATES);
  const [screeningResults, setScreeningResults] = useState<Record<string, ScreeningResult>>({});
  const [isScreeningLoading, setIsScreeningLoading] = useState<boolean>(false);
  const [screeningProgress, setScreeningProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [fitCategoryFilter, setFitCategoryFilter] = useState<'All' | 'Strong Fit' | 'Potential Fit' | 'Unsuitable'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Shortlisted' | 'Pending' | 'Rejected'>('All');

  // Selected for comparison
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isJDCreatorOpen, setIsJDCreatorOpen] = useState(false);
  const [selectedDetailCandidate, setSelectedDetailCandidate] = useState<CandidateResume | null>(null);

  // Auto-screen candidates against selected JD on initial mount or when JD changes
  useEffect(() => {
    screenAllCandidatesAgainstJD(selectedJD, candidates);
  }, [selectedJD.id]);

  const screenAllCandidatesAgainstJD = async (jd: JobDescription, candidateList: CandidateResume[]) => {
    setIsScreeningLoading(true);
    setScreeningProgress({ current: 0, total: candidateList.length });

    const newResults: Record<string, ScreeningResult> = {};

    for (let i = 0; i < candidateList.length; i++) {
      const candidate = candidateList[i];
      try {
        const res = await fetch('/api/screen-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription: jd, candidate })
        });
        const result: ScreeningResult = await res.json();
        newResults[candidate.id] = result;
      } catch (err) {
        console.error(`Error screening candidate ${candidate.id}:`, err);
      }
      setScreeningProgress({ current: i + 1, total: candidateList.length });
    }

    setScreeningResults(newResults);
    setIsScreeningLoading(false);
  };

  const handleCandidateAdded = (newCandidate: CandidateResume, result?: ScreeningResult) => {
    setCandidates((prev) => [newCandidate, ...prev]);
    if (result) {
      setScreeningResults((prev) => ({
        ...prev,
        [newCandidate.id]: result
      }));
    }
  };

  const handleLoadAllSamples = () => {
    setCandidates(SAMPLE_CANDIDATES);
    screenAllCandidatesAgainstJD(selectedJD, SAMPLE_CANDIDATES);
  };

  const handleStatusChange = (candidateId: string, status: 'Pending' | 'Shortlisted' | 'Reviewed' | 'Rejected') => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status } : c))
    );
    if (selectedDetailCandidate?.id === candidateId) {
      setSelectedDetailCandidate((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleToggleCompare = (candidateId: string) => {
    setSelectedCompareIds((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleResetData = () => {
    setJobDescriptions(SAMPLE_JOB_DESCRIPTIONS);
    setSelectedJD(SAMPLE_JOB_DESCRIPTIONS[0]);
    setCandidates(SAMPLE_CANDIDATES);
    setSelectedCompareIds([]);
    screenAllCandidatesAgainstJD(SAMPLE_JOB_DESCRIPTIONS[0], SAMPLE_CANDIDATES);
  };

  // Filtered Candidates
  const filteredCandidates = candidates.filter((c) => {
    const res = screeningResults[c.id];
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFit = fitCategoryFilter === 'All' || res?.fitCategory === fitCategoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesFit && matchesStatus;
  });

  const selectedCompareCandidates = candidates.filter((c) => selectedCompareIds.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex flex-col">
      
      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenJDCreator={() => setIsJDCreatorOpen(true)}
        onResetData={handleResetData}
        selectedCompareCount={selectedCompareIds.length}
        totalCandidatesCount={candidates.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Active Job Selector Banner */}
        <JobDescriptionSelector
          jobDescriptions={jobDescriptions}
          selectedJD={selectedJD}
          onSelectJD={(jd) => setSelectedJD(jd)}
          onOpenJDCreator={() => setIsJDCreatorOpen(true)}
        />

        {/* Screening Progress Bar */}
        {isScreeningLoading && (
          <div className="bg-indigo-900 text-white p-4 rounded-2xl mb-6 flex items-center justify-between border border-indigo-800 shadow-md animate-pulse">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              <div className="text-xs">
                <p className="font-bold">AI Screening in Progress...</p>
                <p className="text-indigo-300">
                  Screening {screeningProgress.current} of {screeningProgress.total} candidates against {selectedJD.title}
                </p>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-indigo-200">
              {Math.round((screeningProgress.current / Math.max(1, screeningProgress.total)) * 100)}%
            </div>
          </div>
        )}

        {/* TAB 1: CANDIDATES LIST */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            
            {/* Search & Filter Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search candidate name or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Fit Category Dropdown */}
                <select
                  value={fitCategoryFilter}
                  onChange={(e) => setFitCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="All">All Match Levels</option>
                  <option value="Strong Fit">Strong Fit (≥ 75%)</option>
                  <option value="Potential Fit">Potential Fit (50-74%)</option>
                  <option value="Unsuitable">Unsuitable (&lt; 50%)</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* Compare Bar Button if candidates selected */}
                {selectedCompareIds.length > 0 && (
                  <button
                    onClick={() => setActiveTab('compare')}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Compare ({selectedCompareIds.length})</span>
                  </button>
                )}
              </div>

            </div>

            {/* Candidates Grid */}
            {filteredCandidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    screeningResult={screeningResults[candidate.id]}
                    onViewDetails={(c) => setSelectedDetailCandidate(c)}
                    onStatusChange={handleStatusChange}
                    isCompareSelected={selectedCompareIds.includes(candidate.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Candidates Found</h3>
                <p className="text-xs text-slate-500">Try adjusting your search filters or click "+ Screen Resume" to upload candidate profiles.</p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>Screen New Resume</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: JOB DESCRIPTIONS */}
        {activeTab === 'jds' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Configured Job Descriptions</h2>
                <p className="text-xs text-slate-500">Select or create target job specifications for screening candidate resumes.</p>
              </div>
              <button
                onClick={() => setIsJDCreatorOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>+ Create AI Job Spec</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {jobDescriptions.map((jd) => (
                <div
                  key={jd.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    selectedJD.id === jd.id
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                      {jd.department}
                    </span>
                    {selectedJD.id === jd.id && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        Active Role
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{jd.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{jd.summaryText}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">{jd.minYearsExperience}+ Yrs Exp</span>
                    <button
                      onClick={() => {
                        setSelectedJD(jd);
                        setActiveTab('candidates');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
                    >
                      Screen Against Role
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SIDE-BY-SIDE COMPARE */}
        {activeTab === 'compare' && (
          <CandidateComparisonView
            jobDescription={selectedJD}
            candidates={selectedCompareCandidates}
            screeningResults={screeningResults}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            jobDescription={selectedJD}
            candidates={candidates}
            screeningResults={screeningResults}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Resume Screening System • Powered by Google Gemini AI</span>
          <span className="text-slate-500">Automated Match Evaluation, Skill Gap Analysis & Outreach</span>
        </div>
      </footer>

      {/* Resume Upload Modal */}
      <ResumeUploader
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        selectedJD={selectedJD}
        onCandidateAdded={handleCandidateAdded}
        onLoadAllSamples={handleLoadAllSamples}
      />

      {/* AI Job Creator Modal */}
      <AIJDCreatorModal
        isOpen={isJDCreatorOpen}
        onClose={() => setIsJDCreatorOpen(false)}
        onJDCreated={(newJd) => {
          setJobDescriptions((prev) => [newJd, ...prev]);
          setSelectedJD(newJd);
        }}
      />

      {/* Candidate Detail Report Modal */}
      <CandidateDetailModal
        candidate={selectedDetailCandidate}
        screeningResult={selectedDetailCandidate ? screeningResults[selectedDetailCandidate.id] : null}
        onClose={() => setSelectedDetailCandidate(null)}
        onStatusChange={handleStatusChange}
      />

    </div>
  );
}
