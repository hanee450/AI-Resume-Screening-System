import React, { useState } from 'react';
import { JobDescription } from '../types';
import { Briefcase, MapPin, Sparkles, Check, ChevronDown, Plus, BookOpen, Layers } from 'lucide-react';

interface JobDescriptionSelectorProps {
  jobDescriptions: JobDescription[];
  selectedJD: JobDescription;
  onSelectJD: (jd: JobDescription) => void;
  onOpenJDCreator: () => void;
}

export const JobDescriptionSelector: React.FC<JobDescriptionSelectorProps> = ({
  jobDescriptions,
  selectedJD,
  onSelectJD,
  onOpenJDCreator,
}) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-600">Active Job Role</span>
              <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-md font-medium">
                {selectedJD.department}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{selectedJD.title}</h2>
          </div>
        </div>

        {/* Dropdown for selecting job descriptions */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
            className="flex items-center justify-between gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Switch Job Position</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpenDropdown ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={onOpenJDCreator}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ AI Generate JD</span>
          </button>

          {/* Dropdown Menu */}
          {isOpenDropdown && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Role to Screen Against
              </div>
              {jobDescriptions.map((jd) => (
                <button
                  key={jd.id}
                  onClick={() => {
                    onSelectJD(jd);
                    setIsOpenDropdown(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between ${
                    selectedJD.id === jd.id
                      ? 'bg-indigo-50/80 border border-indigo-200/60 text-indigo-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{jd.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{jd.department}</span>
                      <span>•</span>
                      <span>{jd.minYearsExperience}+ yrs exp</span>
                    </div>
                  </div>
                  {selectedJD.id === jd.id && (
                    <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
        <div>
          <span className="font-semibold text-slate-800 block mb-1">Required Skills:</span>
          <div className="flex flex-wrap gap-1.5">
            {selectedJD.requiredSkills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md font-medium text-[11px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="font-semibold text-slate-800 block mb-1">Preferred Skills & Exp:</span>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
              Min Exp: {selectedJD.minYearsExperience} Years
            </span>
            {selectedJD.preferredSkills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="font-semibold text-slate-800 block mb-1">Location & Qualification:</span>
          <p className="text-slate-600 line-clamp-2">
            <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
            {selectedJD.location} | {selectedJD.educationLevel}
          </p>
        </div>
      </div>
    </div>
  );
};
