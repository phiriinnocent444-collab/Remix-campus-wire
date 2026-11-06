import React from 'react';
import { StudentProfile } from '../types';
import { STUDENT_PROFILES } from '../data/mockData';
import { UniversityLogo } from './UniversityLogo';
import { AtSign } from 'lucide-react';

interface MentionAutocompleteProps {
  query: string;
  onSelect: (alias: string) => void;
  className?: string;
}

export const MentionAutocomplete: React.FC<MentionAutocompleteProps> = ({
  query,
  onSelect,
  className = '',
}) => {
  const clean = query.toLowerCase().replace(/^@/, '');

  // Complete list of student peers for mentions autocomplete
  const allPeers: Array<{
    id: string;
    alias: string;
    name: string;
    university: StudentProfile['university'];
    program: string;
  }> = [
    ...STUDENT_PROFILES.map((p) => ({
      id: p.id,
      alias: p.alias,
      name: p.name,
      university: p.university,
      program: p.program,
    })),
    {
      id: 'peer-coppergeek',
      alias: 'CopperGeek',
      name: 'Kondwani Zulu',
      university: 'cbu',
      program: 'BSc Computer Engineering (CBU)',
    },
    {
      id: 'peer-librarymonk',
      alias: 'LibraryMonk',
      name: 'Bwalya Chanda',
      university: 'unza',
      program: 'BA Library & Information Science (UNZA)',
    },
    {
      id: 'peer-ridgewaydoc',
      alias: 'RidgewayDoc',
      name: 'Natasha Phiri',
      university: 'unza',
      program: 'MBChB Medicine & Surgery (Ridgeway)',
    },
    {
      id: 'peer-zedscholar',
      alias: 'ZedScholar_ZM',
      name: 'Innocent Phiri',
      university: 'unza',
      program: 'BSc Computer Science (UNZA)',
    },
  ];

  // Remove duplicate aliases
  const uniquePeers = Array.from(new Map(allPeers.map((p) => [p.alias.toLowerCase(), p])).values());

  const filtered = uniquePeers
    .filter(
      (p) =>
        !clean ||
        p.alias.toLowerCase().includes(clean) ||
        p.name.toLowerCase().includes(clean) ||
        p.program.toLowerCase().includes(clean) ||
        p.university.toLowerCase().includes(clean)
    )
    .slice(0, 5);

  if (filtered.length === 0) return null;

  return (
    <div
      className={`absolute z-50 bg-[#0f172a] border border-[#1e294b] rounded-xl shadow-2xl p-1.5 w-64 max-h-56 overflow-y-auto ${className}`}
    >
      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 border-b border-[#1e294b]/60 mb-1">
        <AtSign className="w-3 h-3 text-emerald-400" />
        <span>Mention Student Peer</span>
      </div>
      <div className="space-y-0.5">
        {filtered.map((profile) => (
          <button
            key={profile.id}
            type="button"
            onClick={() => onSelect(profile.alias)}
            className="w-full text-left p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer group"
          >
            <UniversityLogo university={profile.university} size="xs" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white group-hover:text-emerald-400 truncate leading-tight">
                @{profile.alias}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {profile.name} · {profile.university.toUpperCase()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Component to render text with highlighted interactive @mentions
export const FormattedMentionText: React.FC<{
  text: string;
  onMentionClick?: (alias: string) => void;
  className?: string;
}> = ({ text, onMentionClick, className = '' }) => {
  if (!text) return null;

  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          const alias = part.substring(1);
          return (
            <span
              key={index}
              onClick={(e) => {
                if (onMentionClick) {
                  e.stopPropagation();
                  onMentionClick(alias);
                }
              }}
              className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer inline-flex items-center gap-0.5"
              title={`View @${alias}'s campus profile`}
            >
              <span>{part}</span>
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
