import React, { useState } from 'react';
import { StudentVideo } from '../../types/studentVideo';
import { ZED_VIDEO_TAGS } from '../../data/studentVideoData';
import { StudentVideoCard } from './StudentVideoCard';
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
  Trophy,
} from 'lucide-react';

interface ZedWhisperVideoPortalProps {
  videos: StudentVideo[];
  onSelectVideo: (video: StudentVideo) => void;
  onOpenWatchPage: (video: StudentVideo) => void;
  isStandalone?: boolean;
  onToggleStandalone?: () => void;
  onExitToZedWhisper?: () => void;
}

export const ZedWhisperVideoPortal: React.FC<ZedWhisperVideoPortalProps> = ({
  videos,
  onSelectVideo,
  onOpenWatchPage,
  isStandalone = false,
  onToggleStandalone,
  onExitToZedWhisper,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All Campus');
  const [selectedTab, setSelectedTab] = useState('HOME');
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const topCategories = [
    'CAMPUS LIFE',
    'ACADEMICS',
    'VARSITY SPORTS',
    'STUDENT CLUBS',
    'TRUST & SAFETY',
    'ZM',
  ];

  const mainTabs = [
    'HOME',
    'VARSITY SPORTS',
    'HOSTEL LIFE',
    'ACADEMICS & LABS',
    'CAMPUS PARTIES',
    'COMMUNITY',
  ];

  // Filter videos by search query and category tags
  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.university && v.university.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTag === 'All Campus') {
      if (selectedTab === 'HOME') return true;
      if (selectedTab === 'VARSITY SPORTS') return v.category === 'sports';
      if (selectedTab === 'HOSTEL LIFE') return v.category === 'comedy' || v.category === 'campus_life';
      if (selectedTab === 'ACADEMICS & LABS') return v.category === 'academic' || v.category === 'tech';
      if (selectedTab === 'CAMPUS PARTIES') return v.category === 'events';
      return true;
    }

    return v.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
  });

  return (
    <div className="w-full bg-[#000000] text-white font-sans flex flex-col min-h-[700px] border border-[#222222] rounded-2xl overflow-hidden shadow-2xl">
      {/* Standalone Top Navigation Bar if in fullscreen mode */}
      {isStandalone && (
        <div className="bg-[#141414] border-b border-[#2a2a2a] px-4 py-2 flex items-center justify-between text-xs text-[#909090]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff9900] animate-pulse" />
            <span className="text-white font-bold">
              ZedWhisper Video Hub Standalone Cinema
            </span>
            <span className="hidden sm:inline">· Campus Video Network</span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleStandalone && (
              <button
                onClick={onToggleStandalone}
                className="px-2.5 py-1 rounded bg-[#252525] hover:bg-[#333333] text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5 text-[#ff9900]" />
                <span>Exit Fullscreen</span>
              </button>
            )}
            {onExitToZedWhisper && (
              <button
                onClick={onExitToZedWhisper}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Return to ZedWhisper</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Row 1: Top Utility Category Bar */}
      <div className="bg-[#000000] border-b border-[#1b1b1b] px-4 py-1.5 flex items-center justify-end gap-3 sm:gap-5 text-[11px] font-semibold text-[#888888] overflow-x-auto scrollbar-none select-none">
        {topCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (cat === 'VARSITY SPORTS') setSelectedTab('VARSITY SPORTS');
              if (cat === 'ACADEMICS') setSelectedTab('ACADEMICS & LABS');
              if (cat === 'CAMPUS LIFE') setSelectedTab('HOSTEL LIFE');
            }}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Row 2: Iconic Branding, Search Bar, and Utility Icons */}
      <div className="bg-[#000000] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6 border-b border-[#1f1f1f]">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-white hover:text-[#ff9900] transition-colors cursor-pointer"
            aria-label="Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Iconic Two-Tone Logo: White "Zed" + Orange Rounded Container "Whisper" */}
          <div
            onClick={() => {
              setSelectedTab('HOME');
              setSelectedTag('All Campus');
              setSearchQuery('');
            }}
            className="flex items-center cursor-pointer select-none group"
            title="ZedWhisper Video Hub Home"
          >
            <span className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Zed
            </span>
            <div className="ml-1 px-2 py-0.5 rounded-lg bg-[#ff9900] text-black font-extrabold text-2xl sm:text-3xl tracking-tight shadow-sm group-hover:bg-[#ffaa22] transition-colors">
              Whisper
            </div>
          </div>
        </div>

        {/* Center: Search Box */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campus videos, sports derbies, hostel comedy, labs..."
              className="w-full bg-[#1b1b1b] text-white text-xs sm:text-sm placeholder-[#777777] rounded-full py-2 sm:py-2.5 pl-4 pr-10 border border-[#333333] focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] outline-none transition-all shadow-inner"
            />
            <button
              onClick={() => {}}
              className="absolute right-3 text-[#999999] hover:text-[#ff9900] transition-colors cursor-pointer"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-white shrink-0">
          <button
            onClick={() => setSelectedTab('VARSITY SPORTS')}
            className="p-2 hover:bg-[#1a1a1a] rounded-full text-white hover:text-[#ff9900] transition-colors hidden md:flex items-center justify-center cursor-pointer"
            title="Varsity Sports"
          >
            <Trophy className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedTab('CAMPUS PARTIES')}
            className="p-2 hover:bg-[#1a1a1a] rounded-full text-white hover:text-[#ff9900] transition-colors hidden sm:flex items-center justify-center cursor-pointer"
            title="Campus Events & Parties"
          >
            <Camera className="w-5 h-5" />
          </button>

          {onToggleStandalone && (
            <button
              onClick={onToggleStandalone}
              className="p-2 hover:bg-[#1a1a1a] rounded-full text-white hover:text-[#ff9900] transition-colors flex items-center justify-center cursor-pointer"
              title={isStandalone ? 'Exit Fullscreen' : 'Fullscreen Standalone Portal'}
            >
              <Maximize2 className="w-5 h-5 text-[#ff9900]" />
            </button>
          )}

          <div
            className="w-8 h-8 rounded-full bg-[#ff9900] text-black font-extrabold flex items-center justify-center text-xs shadow-md cursor-pointer hover:ring-2 hover:ring-orange-400"
            title="Student Profile"
          >
            ZM
          </div>
        </div>
      </div>

      {/* Row 3: Cupertino Primary Navigation Tabs */}
      <div className="bg-[#000000] border-b border-[#222222] px-4 sm:px-6 flex items-center gap-6 text-xs font-bold tracking-wider overflow-x-auto scrollbar-none select-none">
        {mainTabs.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setSelectedTag('All Campus');
              }}
              className={`py-3 relative whitespace-nowrap transition-colors cursor-pointer ${
                isActive ? 'text-white' : 'text-[#888888] hover:text-white'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff9900] rounded-t-full shadow-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Row 4: Dismissible Campus Notice Banner */}
      {!isNoticeDismissed && (
        <div className="bg-[#141414] border-b border-[#222222] px-4 py-2 flex items-center justify-between text-xs text-[#a0a0a0]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#ff9900] shrink-0" />
            <p>
              Welcome to the official <strong>ZedWhisper Campus Video Hub</strong>. Verified student videos from UNZA, CBU, Mulungushi, LMMU, Apex & Cavendish!
            </p>
          </div>
          <button
            onClick={() => setIsNoticeDismissed(true)}
            className="text-[#666666] hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid Viewport */}
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Title & Tag Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Trending Campus Videos & Activities</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#ff9900]/20 text-[#ff9900] font-bold border border-[#ff9900]/30 font-mono">
                {filteredVideos.length} Videos
              </span>
            </h2>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#ff9900] hover:underline cursor-pointer"
              >
                Clear filter: "{searchQuery}"
              </button>
            )}
          </div>

          {/* Scrolling Horizontal Tag Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
            {ZED_VIDEO_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff9900] text-black shadow-md'
                      : 'bg-[#1a1a1a] text-slate-300 hover:bg-[#282828] hover:text-white border border-[#2a2a2a]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#0d0d0d] rounded-2xl border border-dashed border-[#262626] p-8">
            <div className="w-14 h-14 rounded-2xl bg-[#ff9900]/10 text-[#ff9900] flex items-center justify-center mx-auto border border-[#ff9900]/20">
              <Video className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Campus Videos Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No videos matching "{searchQuery || selectedTag}". Try selecting another category tag or reset your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('All Campus');
                setSelectedTab('HOME');
              }}
              className="px-4 py-2 rounded-xl bg-[#ff9900] text-black font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredVideos.map((video) => (
              <StudentVideoCard
                key={video.id}
                video={video}
                onClick={() => onSelectVideo(video)}
                onOpenWatchPage={() => onOpenWatchPage(video)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
