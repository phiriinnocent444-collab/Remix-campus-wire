import React from 'react';
import { UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { UniversityLogo } from './UniversityLogo';
import { GraduationCap, MapPin, Sparkles } from 'lucide-react';

interface UniversityFilterBarProps {
  selectedUniversity: UniversityId;
  onSelectUniversity: (id: UniversityId) => void;
  onOpenDirectory?: () => void;
}

export const UniversityFilterBar: React.FC<UniversityFilterBarProps> = ({
  selectedUniversity,
  onSelectUniversity,
  onOpenDirectory,
}) => {
  const activeUni = UNIVERSITIES.find((u) => u.id === selectedUniversity) || UNIVERSITIES[0];

  return (
    <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 py-3 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2.5">
            <UniversityLogo university={selectedUniversity} size="sm" showBorder />
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {activeUni.name}
              </span>
              <span className="hidden md:inline text-[11px] text-slate-400">
                {activeUni.motto}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{activeUni.city}</span>
            <span>·</span>
            <span className="italic">{activeUni.studentSlang}</span>
          </div>
        </div>

        {/* Horizontal scrollable university selector buttons with SVG logos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {UNIVERSITIES.map((uni) => {
            const isSelected = selectedUniversity === uni.id;
            return (
              <button
                key={uni.id}
                onClick={() => onSelectUniversity(uni.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm font-semibold ring-2 ring-emerald-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                aria-label={`Filter by ${uni.name}`}
              >
                <UniversityLogo university={uni.id} size="xs" />
                <span>{uni.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
