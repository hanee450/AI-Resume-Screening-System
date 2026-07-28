import React, { useState } from 'react';
import { CandidateResume, JobDescription, ScreeningResult } from '../types';
import { Upload, FileText, Sparkles, X, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { SAMPLE_CANDIDATES } from '../data/sampleData';

interface ResumeUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJD: JobDescription;
  onCandidateAdded: (newCandidate: CandidateResume, screeningResult?: ScreeningResult) => void;
  onLoadAllSamples: () => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  isOpen,
  onClose,
  selectedJD,
  onCandidateAdded,
  onLoadAllSamples,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'sample'>('sample');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleTextUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsLoading(true);
    setStatusMessage('Parsing resume text with AI...');

    try {
      // 1. Parse text into candidate structure
      const parseRes = await fetch('/api/parse-resume-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });
      const parseData = await parseRes.json();
      const parsedCandidate: CandidateResume = parseData.candidate;

      if (candidateName) parsedCandidate.name = candidateName;
      if (candidateEmail) parsedCandidate.email = candidateEmail;

      // 2. Screen resume against active JD
      setStatusMessage(`Screening ${parsedCandidate.name} against ${selectedJD.title}...`);
      const screenRes = await fetch('/api/screen-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: selectedJD, candidate: parsedCandidate })
      });
      const screeningResult: ScreeningResult = await screenRes.json();

      onCandidateAdded(parsedCandidate, screeningResult);
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setStatusMessage('Error parsing/screening resume. Please try again.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawText(text);
        if (!candidateName) {
          setCandidateName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Add Resume for AI Screening</h3>
              <p className="text-xs text-slate-400">Target Role: <span className="text-indigo-300 font-medium">{selectedJD.title}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('sample')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'sample'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pre-Loaded Sample Candidates</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'text'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste / Upload Resume Text</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">

          {activeTab === 'sample' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950">
                  <p className="font-semibold text-indigo-900 mb-1">Instant Screening Demo</p>
                  <p>
                    Load realistic candidate profiles (Anita Sharma, Priya Iyer, Rahul Verma, Sneha Reddy, Karan Mehta) with complete skill sets, work history, and education to test AI screening immediately.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Individual Candidate or Load All</p>
                
                <button
                  onClick={() => {
                    onLoadAllSamples();
                    onClose();
                  }}
                  className="w-full p-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Load All 5 Sample Candidates & Auto-Screen Against "{selectedJD.title}"</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {SAMPLE_CANDIDATES.map((sample) => (
                    <div
                      key={sample.id}
                      className="p-3 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{sample.name}</div>
                        <div className="text-[11px] text-slate-500">{sample.currentRole} • {sample.yearsExperience} yrs exp</div>
                      </div>
                      <button
                        onClick={async () => {
                          setIsLoading(true);
                          setStatusMessage(`Screening ${sample.name}...`);
                          const screenRes = await fetch('/api/screen-resume', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ jobDescription: selectedJD, candidate: sample })
                          });
                          const result = await screenRes.json();
                          onCandidateAdded(sample, result);
                          setIsLoading(false);
                          onClose();
                        }}
                        disabled={isLoading}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                      >
                        Add & Screen
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTextUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Full Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Verma"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Resume Plain Text / Content</label>
                  <label className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Text File</span>
                    <input
                      type="file"
                      accept=".txt,.md,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={8}
                  required
                  placeholder="Paste candidate resume text, skills, education, and work experience history here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !rawText.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{statusMessage || 'Screening...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>AI Parse & Screen Resume</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
