import React, { useState } from 'react';
import { AppTab, PostCategory, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { UniversityLogo } from './UniversityLogo';
import {
  GraduationCap,
  MessageSquare,
  Flame,
  Newspaper,
  Trophy,
  Calendar,
  Home,
  HelpCircle,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  Bookmark,
  AtSign,
  Compass,
  Mail,
  ShieldCheck,
  QrCode,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  X,
  Lock,
  BarChart3,
  ExternalLink,
  Code,
} from 'lucide-react';

interface SidebarProps {
  selectedUniversity: UniversityId;
  onSelectUniversity: (id: UniversityId) => void;
  selectedCategory: PostCategory;
  onSelectCategory: (category: PostCategory) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  unreadMentionsCount: number;
  savedCount: number;
  unreadDmsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenComposer: () => void;
  onOpenProfile: () => void;
  onOpenSafety: () => void;
  onOpenQrModal: () => void;
  postsCountByUniversity?: Record<string, number>;
  postsCountByCategory?: Record<string, number>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedUniversity,
  onSelectUniversity,
  selectedCategory,
  onSelectCategory,
  activeTab,
  setActiveTab,
  unreadMentionsCount,
  savedCount,
  unreadDmsCount,
  isOpenMobile,
  onCloseMobile,
  onOpenComposer,
  onOpenProfile,
  onOpenSafety,
  onOpenQrModal,
  postsCountByUniversity = {},
  postsCountByCategory = {},
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [isUnisExpanded, setIsUnisExpanded] = useState(true);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isAppsExpanded, setIsAppsExpanded] = useState(true);

  const categories: { id: PostCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Activities', icon: <SlidersHorizontal className="w-4 h-4 text-slate-400" /> },
    { id: 'news', label: 'Campus News & Bulletins', icon: <Newspaper className="w-4 h-4 text-blue-400" /> },
    { id: 'exams', label: 'Academics & Past Papers', icon: <GraduationCap className="w-4 h-4 text-emerald-400" /> },
    { id: 'hostel', label: 'Hostel & Housing Vacancies', icon: <Home className="w-4 h-4 text-indigo-400" /> },
    { id: 'gossip', label: 'Hot Tea & Whispers', icon: <Flame className="w-4 h-4 text-amber-400" /> },
    { id: 'crushes', label: 'Crushes & Confessions', icon: <Heart className="w-4 h-4 text-pink-400" /> },
    { id: 'marketplace', label: 'Marketplace & Hustle', icon: <ShoppingBag className="w-4 h-4 text-teal-400" /> },
    { id: 'sports', label: 'Sports & Varsity Games', icon: <Trophy className="w-4 h-4 text-yellow-400" /> },
    { id: 'events', label: 'Events & Socials', icon: <Calendar className="w-4 h-4 text-purple-400" /> },
    { id: 'lost_found', label: 'Lost & Found', icon: <HelpCircle className="w-4 h-4 text-rose-400" /> },
  ];

  const filteredUniversities = filterQuery.trim()
    ? UNIVERSITIES.filter(
        (u) =>
          u.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          u.shortName.toLowerCase().includes(filterQuery.toLowerCase()) ||
          u.city.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : UNIVERSITIES;

  const handleUniversityClick = (id: UniversityId) => {
    onSelectUniversity(id);
    if (activeTab !== 'feed' && activeTab !== 'saved') {
      setActiveTab('feed');
    }
    if (isOpenMobile) onCloseMobile();
  };

  const handleCategoryClick = (cat: PostCategory) => {
    if (cat === 'marketplace') {
      setActiveTab('marketplace');
      if (isOpenMobile) onCloseMobile();
      return;
    }
    onSelectCategory(cat);
    if (activeTab !== 'feed') {
      setActiveTab('feed');
    }
    if (isOpenMobile) onCloseMobile();
  };

  const handleAppTabClick = (tab: any) => {
    setActiveTab(tab);
    if (isOpenMobile) onCloseMobile();
  };

  const sidebarContent = (
    <aside className="w-full h-full flex flex-col bg-[#0c1527] border-r border-[#1e294b] text-slate-300 select-none">
      {/* Sidebar Header / Brand */}
      <div className="p-4 border-b border-[#1e294b] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-sm ring-1 ring-emerald-400/30">
            Z
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-sm text-white tracking-wide">
                ZedWhisper
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-semibold px-1.5 py-0.2 rounded border border-emerald-500/30">
                ZM
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Higher Learning Network</p>
          </div>
        </div>

        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Fast-Filter Search in Sidebar */}
      <div className="p-3 border-b border-[#1e294b]/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter campuses, topics..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#080d1a] border border-[#1e294b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Action Button (W3Schools / FreeCodeCamp style prominent trigger) */}
      <div className="p-3 border-b border-[#1e294b]/60">
        <button
          onClick={() => {
            onOpenComposer();
            if (isOpenMobile) onCloseMobile();
          }}
          className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Post Whisper or Intel</span>
        </button>
      </div>

      {/* Scrollable Navigation Tree (FreeCodeCamp & W3Schools signature hierarchy) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin text-xs">
        {/* Section 1: Interactive Campus Hubs / Views */}
        <div>
          <button
            onClick={() => setIsAppsExpanded(!isAppsExpanded)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2 py-1 hover:text-slate-200 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Campus Interactive Spaces</span>
            </span>
            {isAppsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {isAppsExpanded && (
            <nav className="space-y-0.5">
              {/* Feed */}
              <button
                onClick={() => handleAppTabClick('feed')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-emerald-600/15 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Campus Buzz Feed</span>
                </div>
              </button>

              {/* Campus Marketplace / ZedStore */}
              <button
                onClick={() => handleAppTabClick('marketplace')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'marketplace'
                    ? 'bg-emerald-600/15 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Campus Marketplace</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-1.5 py-0.2 rounded">
                  Store
                </span>
              </button>

              {/* ZedWhisper Video Hub Cinema */}
              <button
                onClick={() => handleAppTabClick('cinema')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'cinema' || activeTab === 'cornhub'
                    ? 'bg-[#ff9900]/15 text-[#ff9900] font-semibold border-l-2 border-[#ff9900]'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-white">Zed</span>
                  <span className="bg-[#ff9900] text-black font-black text-[9px] px-1 py-0.2 rounded shadow-xs">
                    Whisper
                  </span>
                  <span className="text-xs text-slate-300 ml-1 font-medium">Cinema</span>
                </div>
                <span className="text-[10px] bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/40 font-semibold px-1.5 py-0.2 rounded">
                  Hot
                </span>
              </button>

              {/* Fullstack Dev Studio / Lab */}
              <button
                onClick={() => handleAppTabClick('devlab')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'devlab'
                    ? 'bg-amber-500/15 text-amber-400 font-semibold border-l-2 border-amber-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>Fullstack Dev Lab</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold px-1.5 py-0.2 rounded">
                  48h Code
                </span>
              </button>

              {/* Mentions */}
              <button
                onClick={() => handleAppTabClick('mentions')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'mentions'
                    ? 'bg-emerald-600/15 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AtSign className="w-4 h-4 text-emerald-400" />
                  <span>@Mentions & Tags</span>
                </div>
                {unreadMentionsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                    {unreadMentionsCount}
                  </span>
                )}
              </button>

              {/* Saved */}
              <button
                onClick={() => handleAppTabClick('saved')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'saved'
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border-l-2 border-amber-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Saved Whispers</span>
                </div>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                    {savedCount}
                  </span>
                )}
              </button>

              {/* ZedMatch Encounters */}
              <button
                onClick={() => handleAppTabClick('dating')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'dating'
                    ? 'bg-pink-500/15 text-pink-300 font-semibold border-l-2 border-pink-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>ZedMatch (Crushes)</span>
                </div>
                <span className="text-[10px] text-pink-400 font-medium">Spotlight</span>
              </button>

              {/* Secret Crush Lockbox */}
              <button
                onClick={() => handleAppTabClick('secret_crush')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'secret_crush'
                    ? 'bg-rose-500/15 text-rose-300 font-semibold border-l-2 border-rose-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>Secret Crush Lockbox</span>
                </div>
              </button>

              {/* Campus Polls */}
              <button
                onClick={() => handleAppTabClick('polls')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'polls'
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border-l-2 border-cyan-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Campus Polls & Debates</span>
                </div>
              </button>

              {/* Google Map */}
              <button
                onClick={() => handleAppTabClick('map')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <span>Campus Google Map</span>
                </div>
              </button>

              {/* Calendar */}
              <button
                onClick={() => handleAppTabClick('calendar')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-purple-500/15 text-purple-300 font-semibold border-l-2 border-purple-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Campus Event Calendar</span>
                </div>
              </button>

              {/* Direct Messages */}
              <button
                onClick={() => handleAppTabClick('messages')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'messages'
                    ? 'bg-blue-500/15 text-blue-300 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Direct Whispers</span>
                </div>
                {unreadDmsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                    {unreadDmsCount}
                  </span>
                )}
              </button>
            </nav>
          )}
        </div>

        {/* Section 2: Universities Index (W3Schools tutorial list style) */}
        <div>
          <button
            onClick={() => setIsUnisExpanded(!isUnisExpanded)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2 py-1 hover:text-slate-200 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Campus Networks ({UNIVERSITIES.length - 1})</span>
            </span>
            {isUnisExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {isUnisExpanded && (
            <div className="space-y-0.5">
              {filteredUniversities.map((uni) => {
                const isSelected = selectedUniversity === uni.id;
                const count = postsCountByUniversity[uni.id] ?? (uni.id === 'all' ? undefined : 0);

                return (
                  <button
                    key={uni.id}
                    onClick={() => handleUniversityClick(uni.id)}
                    className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600/20 text-emerald-300 font-semibold border-l-2 border-emerald-500'
                        : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <UniversityLogo university={uni.id} size="xs" />
                      <span className="truncate">{uni.shortName}</span>
                    </div>
                    {count !== undefined && count > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-1">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Topic Categories (FreeCodeCamp Curriculum module style) */}
        <div>
          <button
            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2 py-1 hover:text-slate-200 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>Discussion Topics</span>
            </span>
            {isCategoriesExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {isCategoriesExpanded && (
            <div className="space-y-0.5">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id && activeTab === 'feed';
                const count = postsCountByCategory[cat.id];

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600/15 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                        : 'text-slate-300 hover:bg-[#111c35] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {cat.icon}
                      <span className="truncate">{cat.label}</span>
                    </div>
                    {count !== undefined && count > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-1">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Student Toolkit & Quick Utilities */}
        <div className="pt-2 border-t border-[#1e294b]/60 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-1">
            Student Toolkit
          </div>

          <button
            onClick={() => {
              onOpenProfile();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#111c35] hover:text-white transition-colors cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>My Campus ID & Persona</span>
          </button>

          <button
            onClick={() => {
              onOpenQrModal();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#111c35] hover:text-white transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-teal-400" />
            <span>Social QR Code</span>
          </button>

          <button
            onClick={() => {
              onOpenSafety();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#111c35] hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Cyber Safety Rules</span>
          </button>
        </div>
      </div>

      {/* Footer info strip */}
      <div className="p-3 border-t border-[#1e294b] text-[11px] text-slate-500 flex items-center justify-between">
        <span>ZedWhisper Zambia</span>
        <span className="font-mono text-[10px] text-emerald-500">v2.4 Live</span>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Like W3Schools & FreeCodeCamp left navigation) */}
      <div className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="sticky top-16 h-[calc(100vh-4rem)] rounded-xl overflow-hidden border border-[#1e294b] shadow-lg">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Slide-Over Drawer with backdrop blur */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 flex">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
