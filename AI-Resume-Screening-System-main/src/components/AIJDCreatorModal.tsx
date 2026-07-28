import React, { useState } from 'react';
import { JobDescription } from '../types';
import { Sparkles, X, Loader2, Plus, Briefcase } from 'lucide-react';

interface AIJDCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJDCreated: (newJd: JobDescription) => void;
}

export const AIJDCreatorModal: React.FC<AIJDCreatorModalProps> = ({
  isOpen,
  onClose,
  onJDCreated,
}) => {
  const [promptText, setPromptText] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, department })
      });
      const data = await res.json();
      if (data.jobDescription) {
        onJDCreated(data.jobDescription);
        setIsLoading(false);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">AI Job Description Generator</h3>
              <p className="text-xs text-slate-400">Generate structured requirements using Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Department</label>
            <input
              type="text"
              placeholder="e.g. Core Infrastructure, Growth, AI Labs"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title & Requirements Prompt</label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Lead Cloud Architect with 6+ years exp in Google Cloud Platform, Terraform, Kubernetes, microservices security, and cost optimization."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
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
              disabled={isLoading || !promptText.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Job Spec...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Job Description</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
