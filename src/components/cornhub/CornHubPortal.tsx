import React, { useState } from 'react';
import { CornVideo } from '../../types/cornhub';
import { CORN_TAGS } from '../../data/cornhubData';
import { CornVideoCard } from './CornVideoCard';
import {
  Menu,
  Search,
  Video,
  Camera,
  User,
  Info,
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CornHubPortalProps {
  videos: CornVideo[];
  onSelectVideo: (video: CornVideo) => void;
  onOpenWatchPage: (video: CornVideo) => void;
  isStandalone?: boolean;
  onToggleStandalone?: () => void;
  onExitToZedWhisper?: () => void;
}

export const CornHubPortal: React.FC<CornHubPortalProps> = ({
  videos,
  onSelectVideo,
  onOpenWatchPage,
  isStandalone = false,
  onToggleStandalone,
  onExitToZedWhisper,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All Corn');
  const [selectedTab, setSelectedTab] = useState('HOME');
  const [isAdBlockerDismissed, setIsAdBlockerDismissed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const topCategories = [
    'SEXUAL WELLNESS',
    'INSIGHTS',
    'SITES',
    'SHOP',
    'TRUST & SAFETY',
    'EN',
  ];

  const primaryTabs = [
    'HOME',
    'CORN VIDEOS',
    'CATEGORIES',
    'LIVE CAMS',
    'CORNSTART',
    'COMMUNITY',
    'PHOTOS & GIFTS',
  ];

  // Filter videos based on search & tag
  const filteredVideos = videos.filter((v) => {
    if (selectedTag !== 'All Corn') {
      const matchTag = v.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
      if (!matchTag) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchPornstar = v.pornstar.toLowerCase().includes(q);
      const matchTags = v.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchPornstar && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className={`w-full bg-[#000000] text-white select-none ${isStandalone ? 'min-h-screen' : 'rounded-2xl border border-[#242424] overflow-hidden shadow-2xl'}`}>
      {/* Standalone Return Bar (when in standalone mode) */}
      {isStandalone && (
        <div className="bg-[#111111] border-b border-[#ff9000]/40 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff9000] animate-pulse" />
            <span className="font-bold text-[#ff9000]">CornHub Fullscreen Standalone Experience</span>
            <span className="text-[#888888] hidden sm:inline">· Faithful Python / Flet GUI Recreation</span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleStandalone && (
              <button
                onClick={onToggleStandalone}
                className="px-2.5 py-1 rounded bg-[#222222] hover:bg-[#333333] text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </button>
            )}
            {onExitToZedWhisper && (
              <button
                onClick={onExitToZedWhisper}
                className="px-3 py-1 rounded bg-[#ff9000] hover:bg-[#ff9000]/90 text-black font-bold transition-colors cursor-pointer"
              >
                Return to ZedWhisper
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. TOP ROW (From app_bar.py top_row) */}
      <div className="hidden md:flex items-center justify-center gap-6 py-2 px-4 bg-[#0a0a0a] text-[11px] font-semibold text-[#888888] border-b border-[#1a1a1a]">
        <div className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#888888]" />
        </div>
        {topCategories.map((item) => (
          <button
            key={item}
            onClick={() => {}}
            className="hover:text-[#c6c6c6] transition-colors cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {/* 2. MIDDLE ROW (From app_bar.py middle_row) */}
      <div className="bg-[#0e0e0e] border-b border-[#242424] px-3 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Menu & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-[#ff9000] hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer"
            title="Menu"
            aria-label="Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* CornHub Brand Wordmark matching logo_cb43f843.png */}
          <div
            onClick={() => {
              setSelectedTag('All Corn');
              setSearchQuery('');
            }}
            className="flex items-center cursor-pointer group"
          >
            <span className="font-sans font-black text-xl sm:text-2xl text-white tracking-tighter">
              Corn
            </span>
            <span className="bg-[#ff9000] text-black font-black text-base sm:text-xl px-2 py-0.5 rounded-lg ml-1 group-hover:bg-[#ff9000]/90 transition-colors">
              hub
            </span>
          </div>
        </div>

        {/* Center: Search Bar (SearchBar width 500 in Flet) */}
        <div className="flex-1 max-w-lg mx-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c6c6c6] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Cornhub..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-lg bg-[#242424] text-white placeholder-[#888888] border border-transparent focus:border-[#ff9000] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Media & Account Icons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            className="p-2 text-[#c6c6c6] hover:text-white hover:bg-[#1f1f1f] rounded-lg transition-colors hidden sm:flex cursor-pointer"
            title="Corn Videos"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            className="p-2 text-[#c6c6c6] hover:text-white hover:bg-[#1f1f1f] rounded-lg transition-colors hidden sm:flex cursor-pointer"
            title="Corn Photos"
          >
            <Camera className="w-5 h-5" />
          </button>

          {onToggleStandalone && (
            <button
              onClick={onToggleStandalone}
              className="p-2 text-[#ff9000] hover:bg-[#1f1f1f] rounded-lg transition-colors cursor-pointer"
              title={isStandalone ? 'Exit Standalone View' : 'Fullscreen Standalone Portal'}
            >
              {isStandalone ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}

          <button
            className="p-2 text-[#c6c6c6] hover:text-white hover:bg-[#1f1f1f] rounded-lg transition-colors cursor-pointer"
            title="User Account"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. BOTTOM TAB BAR (From app_bar.py bottom_tab) */}
      <div className="bg-[#0e0e0e] border-b border-[#242424] px-2 sm:px-6 overflow-x-auto scrollbar-none flex items-center justify-between sm:justify-start gap-4 text-xs font-bold text-[#c6c6c6]">
        {primaryTabs.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-3 px-2 border-b-3 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#ff9000] text-white'
                  : 'border-transparent text-[#888888] hover:text-white'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 4. ADBLOCKER WARNING BANNER (From main.py adblocker_banner) */}
      {!isAdBlockerDismissed && (
        <div className="bg-[#1b1b1b] border-b border-[#2b2b2b] px-4 py-2 flex items-center justify-between gap-3 text-xs text-[#c6c6c6]">
          <div className="flex items-center gap-2 max-w-3xl mx-auto flex-1 justify-center text-center">
            <Info className="w-4 h-4 text-[#c6c6c6] shrink-0" />
            <p className="text-[11px] sm:text-xs">
              If you are having issues with video playback, please try disabling Adblock,{' '}
              <span className="text-[#ff9000] underline font-semibold cursor-pointer">
                contact Adblock support to fix the issue
              </span>
            </p>
          </div>

          <button
            onClick={() => setIsAdBlockerDismissed(true)}
            className="text-[#888888] hover:text-white p-1 rounded transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. MAIN CONTENT AREA */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Hot Corn Videos in your region
          </h2>

          <span className="text-xs text-[#888888]">
            Showing <span className="text-[#ff9000] font-bold">{filteredVideos.length}</span> spicy corn titles
          </span>
        </div>

        {/* TAGS FILTER ROW (From main.py Tags row) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CORN_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff9000] text-black font-bold shadow-md shadow-[#ff9000]/20'
                    : 'bg-[#151515] hover:bg-[#202020] text-[#c6c6c6] hover:text-white border border-[#242424]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* 6. RESPONSIVE VIDEO GRID (From main.py 4 sequences loop) */}
        {filteredVideos.length === 0 ? (
          <div className="py-16 text-center text-[#888888] space-y-3">
            <p className="text-sm">No corns match "{searchQuery || selectedTag}"</p>
            <button
              onClick={() => {
                setSelectedTag('All Corn');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-[#242424] hover:bg-[#ff9000] text-white hover:text-black text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredVideos.map((video) => (
              <CornVideoCard
                key={video.id}
                video={video}
                onSelectVideo={onSelectVideo}
                onOpenWatchPage={onOpenWatchPage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
