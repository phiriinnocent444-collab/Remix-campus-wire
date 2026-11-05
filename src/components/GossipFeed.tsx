import React, { useState } from 'react';
import {
  EmojiReactionType,
  EMOJI_REACTIONS,
  GossipPost,
  UniversityId,
} from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { UniversityLogo } from './UniversityLogo';
import { FormattedMentionText } from './MentionAutocomplete';
import {
  MessageCircle,
  Share2,
  Bookmark,
  ShieldAlert,
  CheckCircle,
  Ghost,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Lock,
  Calendar,
  MapPin,
} from 'lucide-react';

interface GossipFeedProps {
  posts: GossipPost[];
  onVote: (postId: string, direction: 'up' | 'down') => void;
  onOpenPostDetail: (post: GossipPost) => void;
  onBookmark: (postId: string) => void;
  bookmarkedIds: string[];
  onReport: (postId: string) => void;
  onOpenComposer: () => void;
  onToggleReaction?: (postId: string, commentId: string | undefined, reactionType: EmojiReactionType) => void;
  onMentionClick?: (alias: string) => void;
}

export const GossipFeed: React.FC<GossipFeedProps> = ({
  posts,
  onVote,
  onOpenPostDetail,
  onBookmark,
  bookmarkedIds,
  onReport,
  onOpenComposer,
  onToggleReaction,
  onMentionClick,
}) => {
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSpoiler = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getUniversityBadge = (uniId: UniversityId) => {
    const uni = UNIVERSITIES.find((u) => u.id === uniId);
    return uni ? uni.shortName : 'Zed Campus';
  };

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center bg-[#0c1527] rounded-2xl border border-dashed border-[#1e294b] p-8 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <MessageCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Campus Feed is Ready for Whispers
        </h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto mb-2">
          Share live campus updates, event announcements, hostel intel, and campus discussions.
        </p>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          Be the first student from UNZA, CBU, Mulungushi, NIPA, Cavendish, or any Zambian institution to spill tea or tag peers!
        </p>
        <button
          onClick={onOpenComposer}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 hover:scale-102 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Post First Campus Whisper</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const isSpoiler = post.isSpoilerTea && !revealedSpoilers[post.id];
        const isBookmarked = bookmarkedIds.includes(post.id);

        return (
          <article
            key={post.id}
            onClick={() => onOpenPostDetail(post)}
            className="group bg-[#0c1527] rounded-xl border border-[#1e294b] hover:border-emerald-500/40 p-4 sm:p-5 transition-all shadow-sm hover:shadow-md cursor-pointer relative"
          >
            {/* Header: University, Category & Time (Unboxed clean metadata with SVG logo) */}
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <UniversityLogo university={post.university} size="xs" />
                <span className="font-semibold text-emerald-400">
                  {getUniversityBadge(post.university)}
                </span>
                {post.campusBranch && (
                  <>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300">{post.campusBranch}</span>
                  </>
                )}
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="capitalize text-slate-400">{post.category}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">{post.timestamp}</span>
              </div>

              <div className="flex items-center gap-2">
                {post.isActivityLive && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-950/70 px-2 py-0.5 rounded-full border border-rose-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    LIVE UPDATE
                  </span>
                )}
                {post.isVerifiedNews && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified Alert</span>
                  </div>
                )}
              </div>
            </div>

            {/* Post Title */}
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
              {post.title}
            </h3>

            {/* Activity Date & Venue Bar if present */}
            {(post.eventDate || post.eventVenue) && (
              <div className="flex items-center gap-3 text-xs text-slate-300 mb-2.5 bg-[#080d1a] px-3 py-1.5 rounded-lg border border-[#1e294b]">
                {post.eventDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>{post.eventDate}</span>
                  </span>
                )}
                {post.eventDate && post.eventVenue && <span className="text-slate-600">·</span>}
                {post.eventVenue && (
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{post.eventVenue}</span>
                  </span>
                )}
              </div>
            )}

            {/* Body Content with optional Spoiler Blur & Formatted Mentions */}
            <div className="relative mb-3">
              {isSpoiler ? (
                <div
                  onClick={(e) => toggleSpoiler(post.id, e)}
                  className="bg-amber-950/30 border border-amber-900/60 rounded-lg p-3 text-center cursor-pointer hover:bg-amber-950/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Juicy Campus Tea (Hidden Spoiler)</span>
                  </div>
                  <p className="text-[11px] text-amber-400/80 mt-0.5">
                    Click to reveal confidential discussion
                  </p>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  <FormattedMentionText
                    text={post.content}
                    onMentionClick={onMentionClick}
                  />
                </p>
              )}
            </div>

            {/* Tags strip */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3 flex-wrap">
                {post.tags.map((tag) => (
                  <span key={tag} className="hover:text-emerald-400 text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Emoji Reactions Horizontal Bar */}
            <div
              className="flex items-center gap-1.5 mb-3 flex-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              {EMOJI_REACTIONS.map((reaction) => {
                const count = post.reactions?.[reaction.type] || 0;
                const isPicked = post.userReactions?.includes(reaction.type);
                return (
                  <button
                    key={reaction.type}
                    type="button"
                    onClick={() => onToggleReaction?.(post.id, undefined, reaction.type)}
                    title={`${reaction.label} (${count})`}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs transition-all cursor-pointer border ${
                      isPicked
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-[#080d1a] border-[#1e294b] text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{reaction.emoji}</span>
                    {count > 0 && (
                      <span className="tabular-nums font-semibold text-[11px]">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer row: Author info & Interactive action buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1e294b] text-xs">
              {/* Author Alias & Identity */}
              <div className="flex items-center gap-1.5 text-slate-400">
                {post.isAnonymous ? (
                  <Ghost className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-[9px] text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                )}
                <span className="font-medium text-slate-200 truncate max-w-[140px] sm:max-w-none">
                  {post.authorAlias}
                </span>
                {post.authorBadge && (
                  <span className="hidden sm:inline text-[11px] text-slate-500">
                    ({post.authorBadge})
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Voting segmented controls */}
                <div
                  className="flex items-center bg-[#080d1a] border border-[#1e294b] rounded-lg p-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onVote(post.id, 'up')}
                    aria-label="Spill tea upvote"
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      post.userVoted === 'up'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{post.upvotes}</span>
                  </button>

                  <button
                    onClick={() => onVote(post.id, 'down')}
                    aria-label="Cap downvote"
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      post.userVoted === 'down'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-500 hover:text-rose-400'
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Comments button */}
                <button
                  onClick={() => onOpenPostDetail(post)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label={`${post.commentsCount} comments`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{post.commentsCount}</span>
                </button>

                {/* Share button */}
                <button
                  onClick={(e) => handleShare(post.id, e)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative"
                  title="Copy link"
                  aria-label="Share post"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedId === post.id && (
                    <span className="absolute -top-7 right-0 bg-slate-900 text-emerald-400 text-[10px] px-2 py-0.5 rounded shadow border border-[#1e294b]">
                      Copied!
                    </span>
                  )}
                </button>

                {/* Bookmark button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark(post.id);
                  }}
                  className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                    isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Bookmark post"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                </button>

                {/* Report button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReport(post.id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Report inappropriate content"
                  aria-label="Report post"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
