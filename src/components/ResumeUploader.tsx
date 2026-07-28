import React, { useState } from 'react';
import { CandidateResume, JobDescription, ScreeningResult } from '../types';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  X, 
  Loader2, 
  UserPlus, 
  CheckCircle2, 
  FileType, 
  File, 
  Check, 
  Trash2,
  AlertCircle
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'pdf' | 'text' | 'sample'>('pdf');
  
  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Common candidate info overrides
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  
  // Plain text state
  const [rawText, setRawText] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file) return;

    setPdfFile(file);
    if (!candidateName) {
      setCandidateName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // Handle text files or binary files (convert to base64)
        if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          setRawText(result);
        }
        
        // Extract base64 part from data URL
        const base64Parts = result.split(',');
        const base64Data = base64Parts.length > 1 ? base64Parts[1] : base64Parts[0];
        setPdfBase64(base64Data);
      }
    };

    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile && !pdfBase64 && !rawText) return;

    setIsLoading(true);
    setStatusMessage('Analyzing PDF resume with Gemini AI...');

    try {
      let parsedCandidate: CandidateResume;

      // If text file or plain text available
      if (rawText && (!pdfFile || pdfFile.name.endsWith('.txt') || pdfFile.name.endsWith('.md'))) {
        const parseRes = await fetch('/api/parse-resume-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawText })
        });
        const parseData = await parseRes.json();
        parsedCandidate = parseData.candidate;
      } else {
        // Send base64 file to /api/parse-resume-file
        const parseRes = await fetch('/api/parse-resume-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: pdfBase64,
            mimeType: pdfFile?.type || 'application/pdf',
            fileName: pdfFile?.name || 'resume.pdf',
            candidateName,
            candidateEmail
          })
        });
        const parseData = await parseRes.json();
        parsedCandidate = parseData.candidate;
      }

      if (candidateName) parsedCandidate.name = candidateName;
      if (candidateEmail) parsedCandidate.email = candidateEmail;

      // 2. Screen candidate against active JD
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
      setStatusMessage('Error processing resume file. Please try again.');
    }
  };

  const handleTextUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsLoading(true);
    setStatusMessage('Parsing resume text with AI...');

    try {
      const parseRes = await fetch('/api/parse-resume-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });
      const parseData = await parseRes.json();
      const parsedCandidate: CandidateResume = parseData.candidate;

      if (candidateName) parsedCandidate.name = candidateName;
      if (candidateEmail) parsedCandidate.email = candidateEmail;

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
      setStatusMessage('Error parsing/screening resume text.');
    }
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
              <h3 className="font-bold text-base">Add Candidate Resume</h3>
              <p className="text-xs text-slate-400">Target Position: <span className="text-indigo-300 font-semibold">{selectedJD.title}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'pdf'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileType className="w-4 h-4" />
            <span>Upload PDF / Resume File</span>
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
            <span>Paste Raw Text</span>
          </button>

          <button
            onClick={() => setActiveTab('sample')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'sample'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Sample Profiles</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">

          {/* TAB 1: PDF / FILE UPLOAD */}
          {activeTab === 'pdf' && (
            <form onSubmit={handlePdfSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Aditi Sharma"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. aditi@example.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Drag & Drop Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resume Document (.PDF, .DOCX, .TXT)</label>
                
                {!pdfFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative ${
                      isDragging 
                        ? 'border-indigo-500 bg-indigo-50/60 scale-[0.99]' 
                        : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt,.md"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-100">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag & Drop Resume PDF here, or <span className="text-indigo-600 underline">browse files</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Supports PDF, DOCX, TXT files up to 10MB</p>
                  </div>
                ) : (
                  <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <FileType className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{pdfFile.name}</p>
                        <p className="text-[11px] text-indigo-700 font-medium">
                          {(pdfFile.size / 1024).toFixed(1)} KB • Ready for AI Extraction
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        setPdfBase64('');
                        setRawText('');
                      }}
                      className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                      title="Remove File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Notice */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-600">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Gemini AI will read the PDF document directly, parse candidate experience, skills, education, and automatically score it against <strong>{selectedJD.title}</strong>.</span>
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
                  disabled={isLoading || (!pdfFile && !rawText)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{statusMessage || 'Screening PDF...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract PDF & Screen Candidate</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: PLAIN TEXT */}
          {activeTab === 'text' && (
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Paste Resume Content</label>
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

          {/* TAB 3: SAMPLE PROFILES */}
          {activeTab === 'sample' && (
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
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Add & Screen'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
