import React from 'react';
import { UniversityId } from '../types';

interface UniversityLogoProps {
  university: UniversityId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

const SIZE_MAP = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
};

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  university,
  size = 'md',
  className = '',
  showBorder = false,
}) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const borderClass = showBorder ? 'ring-1 ring-black/10 dark:ring-white/10 shadow-xs' : '';

  switch (university) {
    case 'unza':
      // University of Zambia: Crest shield, royal blue & gold, soaring eagle, open book of service & excellence
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="University of Zambia Crest"
        >
          <defs>
            <linearGradient id="unzaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#unzaGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" />
          {/* Inner Shield */}
          <path
            d="M32 26 H68 V54 C68 68 50 78 50 78 C50 78 32 68 32 54 Z"
            fill="#0f172a"
            stroke="url(#goldGrad)"
            strokeWidth="2"
          />
          {/* Soaring Fish Eagle */}
          <path
            d="M50 32 L42 40 L48 42 L40 48 L50 45 L60 48 L52 42 L58 40 Z"
            fill="url(#goldGrad)"
          />
          {/* Open Book */}
          <path
            d="M38 56 Q50 53 50 59 Q50 53 62 56 V67 Q50 64 50 70 Q50 64 38 67 Z"
            fill="#ffffff"
            stroke="#eab308"
            strokeWidth="1"
          />
          <text
            x="50"
            y="21"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            UNZA
          </text>
        </svg>
      );

    case 'cbu':
      // Copperbelt University: Copper amber & kitwe engineering cog, mining pick & torch of knowledge
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Copperbelt University Crest"
        >
          <defs>
            <linearGradient id="cbuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#cbuGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fef3c7" strokeWidth="2.5" />
          {/* Cogwheel */}
          <g transform="translate(50,52) scale(0.65) translate(-50,-50)">
            <circle cx="50" cy="50" r="28" fill="#1e293b" stroke="url(#copperGrad)" strokeWidth="3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={angle}
                x="46"
                y="16"
                width="8"
                height="8"
                rx="2"
                fill="url(#copperGrad)"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
            {/* Mining Hammers and Flame */}
            <path d="M40 58 L60 42 M40 42 L60 58" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="50" r="8" fill="#f59e0b" />
          </g>
          <text
            x="50"
            y="21"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8.5"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1.5"
          >
            CBU
          </text>
        </svg>
      );

    case 'nipa':
      // NIPA: National Institute of Public Administration, deep navy & diplomatic gold seal
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="NIPA Crest"
        >
          <defs>
            <linearGradient id="nipaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c1e4a" />
              <stop offset="60%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#nipaGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          {/* Pillar of Governance / Scales */}
          <path
            d="M34 32 H66 V36 H34 Z M50 36 V68 M38 68 H62 V72 H38 Z"
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Scale balance pans */}
          <path d="M40 44 L32 54 H48 Z" fill="#fbbf24" opacity="0.9" />
          <path d="M60 44 L52 54 H68 Z" fill="#fbbf24" opacity="0.9" />
          <text
            x="50"
            y="23"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            NIPA
          </text>
        </svg>
      );

    case 'mulungushi':
      // Mulungushi University: Rock of Authority & Acacia tree of knowledge, deep emerald green
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Mulungushi University Crest"
        >
          <defs>
            <linearGradient id="muluGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#muluGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fde047" strokeWidth="2.5" />
          {/* Rock of Authority */}
          <path
            d="M28 68 L36 50 L48 46 L62 50 L72 68 Z"
            fill="#78350f"
            stroke="#fde047"
            strokeWidth="1.5"
          />
          {/* Tree of Wisdom / Sunrise */}
          <circle cx="50" cy="40" r="8" fill="#fde047" />
          <path
            d="M50 48 V65 M42 56 L50 62 M58 56 L50 62"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x="50"
            y="22"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="7"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="0.5"
          >
            MULUNGUSHI
          </text>
        </svg>
      );

    case 'lmmu':
      // Levy Mwanawasa Medical University: Caduceus Rod of Asclepius & medical cross, hospital sky-blue
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Levy Mwanawasa Medical University Crest"
        >
          <defs>
            <linearGradient id="lmmuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#lmmuGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#e0f2fe" strokeWidth="2.5" />
          {/* Medical Cross */}
          <path
            d="M44 32 H56 V44 H68 V56 H56 V68 H44 V56 H32 V44 H44 Z"
            fill="#ffffff"
            opacity="0.95"
          />
          {/* Caduceus snake / staff */}
          <line x1="50" y1="34" x2="50" y2="66" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M45 42 Q55 46 45 52 Q55 58 50 64"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x="50"
            y="22"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            LMMU
          </text>
        </svg>
      );

    case 'evelyn_hone':
      // Evelyn Hone College: Arts, Commerce, Media, royal purple with golden quill & compass
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Evelyn Hone College Crest"
        >
          <defs>
            <linearGradient id="honeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="50%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#honeGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fef08a" strokeWidth="2.5" />
          {/* Artists palette & Quill */}
          <path
            d="M36 40 C36 34 64 34 64 42 C64 48 58 54 52 54 C48 54 46 64 38 64 C32 64 32 50 36 40 Z"
            fill="#faf5ff"
            stroke="#fde047"
            strokeWidth="1.5"
          />
          <circle cx="44" cy="42" r="2.5" fill="#e11d48" />
          <circle cx="54" cy="42" r="2.5" fill="#3b82f6" />
          <circle cx="48" cy="48" r="2.5" fill="#eab308" />
          {/* Quill pen */}
          <path d="M62 30 L46 68" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
          <text
            x="50"
            y="22"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="7"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="0.8"
          >
            E. HONE
          </text>
        </svg>
      );

    case 'cavendish':
      // Cavendish University Zambia: Red heraldic shield with lion rampant & torch of success
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Cavendish University Zambia Crest"
        >
          <defs>
            <linearGradient id="cuzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#881337" />
              <stop offset="50%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#cuzGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fde047" strokeWidth="2.5" />
          {/* Noble Shield */}
          <path
            d="M34 30 H66 V54 C66 68 50 78 50 78 C50 78 34 68 34 54 Z"
            fill="#ffffff"
            stroke="#fde047"
            strokeWidth="2"
          />
          {/* Heraldic Crown / Torch */}
          <path d="M42 42 L50 36 L58 42 L54 50 H46 Z" fill="#be123c" />
          <circle cx="50" cy="58" r="4" fill="#f59e0b" />
          <text
            x="50"
            y="23"
            textAnchor="middle"
            fill="#fde047"
            fontSize="7.5"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            CAVENDISH
          </text>
        </svg>
      );

    case 'zcas':
      // ZCAS University: Deep teal & gold, accountancy key & financial pillar
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="ZCAS University Crest"
        >
          <defs>
            <linearGradient id="zcasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#115e59" />
              <stop offset="50%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#134e4a" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#zcasGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fef08a" strokeWidth="2.5" />
          {/* Diamond of Excellence */}
          <polygon points="50,32 68,50 50,68 32,50" fill="#042f2e" stroke="#fef08a" strokeWidth="2" />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="extrabold"
            fontFamily="monospace"
          >
            $
          </text>
          <text
            x="50"
            y="22"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            ZCAS
          </text>
        </svg>
      );

    case 'apex':
      // Lusaka Apex Medical University: Crimson triangle apex & stethoscope heartbeat
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Apex Medical University Crest"
        >
          <defs>
            <linearGradient id="apexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="50%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#apexGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fecaca" strokeWidth="2.5" />
          {/* Apex Triangle */}
          <polygon points="50,28 72,68 28,68" fill="#18181b" stroke="#ffffff" strokeWidth="2" />
          {/* Pulse Line */}
          <path
            d="M34 54 L44 54 L48 44 L52 62 L56 50 L60 54 L66 54"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="50"
            y="21"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            APEX
          </text>
        </svg>
      );

    case 'mukuba':
      // Mukuba University: Copper-yellow crystal & flame
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Mukuba University Crest"
        >
          <defs>
            <linearGradient id="mukubaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#854d0e" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#mukubaGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fef9c3" strokeWidth="2.5" />
          {/* Crystal gem */}
          <polygon points="50,32 66,42 60,66 40,66 34,42" fill="#422006" stroke="#fef08a" strokeWidth="2" />
          <circle cx="50" cy="50" r="5" fill="#facc15" />
          <text
            x="50"
            y="22"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="7.5"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="0.8"
          >
            MUKUBA
          </text>
        </svg>
      );

    case 'nkrumah':
      // Kwame Nkrumah University: Fiery orange, torch of pan-african education & black star
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Kwame Nkrumah University Crest"
        >
          <defs>
            <linearGradient id="nkrumahGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#nkrumahGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fed7aa" strokeWidth="2.5" />
          {/* Torch and Star */}
          <path d="M46 50 L54 50 L52 68 L48 68 Z" fill="#78350f" />
          {/* Flame */}
          <path
            d="M50 32 C54 38 60 42 56 48 C52 50 48 50 44 48 C40 42 46 38 50 32 Z"
            fill="#facc15"
          />
          {/* Star */}
          <polygon
            points="50,56 52,61 57,61 53,64 55,69 50,66 45,69 47,64 43,61 48,61"
            fill="#000000"
          />
          <text
            x="50"
            y="22"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="7"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="0.6"
          >
            NKRUMAH
          </text>
        </svg>
      );

    case 'eden':
      // Eden University: Lush green garden, olive branch & tree of life
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="Eden University Crest"
        >
          <defs>
            <linearGradient id="edenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#edenGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#bbf7d0" strokeWidth="2.5" />
          {/* Tree of Life canopy */}
          <circle cx="50" cy="45" r="14" fill="#dcfce7" />
          <circle cx="42" cy="48" r="8" fill="#86efac" />
          <circle cx="58" cy="48" r="8" fill="#86efac" />
          <rect x="48" y="52" width="4" height="16" fill="#78350f" rx="1" />
          <text
            x="50"
            y="22"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            EDEN
          </text>
        </svg>
      );

    case 'all':
    default:
      // All Zambian Universities: National Emerald Crest with Zambia Eagle & Torch
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${borderClass} ${className}`}
          aria-label="All Zambian Universities Crest"
        >
          <defs>
            <linearGradient id="allGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="flagAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="33%" stopColor="#000000" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#allGrad)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fef08a" strokeWidth="2.5" />
          {/* Zambian Flag Stripe bar */}
          <rect x="30" y="66" width="40" height="4" fill="url(#flagAccent)" rx="1.5" />
          {/* Eagle Silhouette */}
          <path
            d="M50 32 C46 38 34 38 32 44 C40 44 46 42 50 48 C54 42 60 44 68 44 C66 38 54 38 50 32 Z"
            fill="#f59e0b"
          />
          {/* Open Book */}
          <path
            d="M36 50 Q50 48 50 54 Q50 48 64 50 V60 Q50 58 50 64 Q50 58 36 60 Z"
            fill="#ffffff"
          />
          <text
            x="50"
            y="22"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="7"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            ZAMBIA
          </text>
        </svg>
      );
  }
};
