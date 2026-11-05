import React, { useState } from 'react';
import { CurrentUser, EmojiReactionType, EMOJI_REACTIONS, GossipPost } from '../types';
import { validateContentSafety } from '../utils/rules';
import { FormattedMentionText, MentionAutocomplete } from './MentionAutocomplete';
import {
  X,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Ghost,
  CheckCircle2,
  Send,
  ShieldAlert,
  Lock,
  Unlock,
  Calendar,
  MapPin,
  AtSign,
} from 'lucide-react';

interface PostDetailModalProps {
  post: GossipPost | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onVotePost: (postId: string, direction: 'up' | 'down') => void;
  onAddComment: (postId: string, commentText: string, isAnonymous: boolean) => void;
  onVoteComment: (postId: string, commentId: string, direction: 'up' | 'down') => void;
  onReport: (postId: string) => void;
  onToggleReaction?: (postId: string, commentId: string | undefined, reactionType: EmojiReactionType) => void;
  onMentionClick?: (alias: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  currentUser,
  onVotePost,
  onAddComment,
  onVoteComment,
  onReport,
  onToggleReaction,
  onMentionClick,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [isAnonymousComment, setIsAnonymousComment] = useState(currentUser.isGhostMode);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [showSpoilerContent, setShowSpoilerContent] = useState(false);
  const [commentMentionQuery, setCommentMentionQuery] = useState<string | null>(null);

  if (!isOpen || !post) return null;

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCommentInput(val);
    const cursor = e.target.selectionStart || val.length;
    const textBefore = val.slice(0, cursor);
    const match = textBefore.match(/@([a-zA-Z0-9_]*)$/);
    if (match) {
      setCommentMentionQuery(match[1]);
    } else {
      setCommentMentionQuery(null);
    }
  };

  const handleSelectCommentMention = (alias: string) => {
    if (commentMentionQuery === null) return;
    const regex = new RegExp(`@${commentMentionQuery}$`);
    const newText = commentInput.replace(regex, `@${alias} `);
    setCommentInput(newText);
    setCommentMentionQuery(null);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    const check = validateContentSafety(commentInput);
    if (!check.isValid) {
      setCommentError(check.warning || 'Invalid comment.');
      return;
    }

    onAddComment(post.id, commentInput.trim(), isAnonymousComment);
    setCommentInput('');
    setCommentMentionQuery(null);
  };

  const isHiddenSpoiler = post.isSpoilerTea && !showSpoilerContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-[#0c1527] rounded-2xl border border-[#1e294b] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e294b] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {post.university.toUpperCase()} Buzz
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 capitalize">{post.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Main Post Header */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                {post.isAnonymous ? (
                  <Ghost className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </div>
                )}
                <span>{post.authorAlias}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span>{post.timestamp}</span>
              {post.campusBranch && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-300">{post.campusBranch}</span>
                </>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-white leading-snug mb-3">
              {post.title}
            </h1>

            {/* Activity Date, Venue & Live Marker if present */}
            {(post.eventDate || post.eventVenue || post.isActivityLive) && (
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs text-slate-300 mb-3.5 bg-[#080d1a] p-2.5 rounded-xl border border-[#1e294b]">
                {post.isActivityLive && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-950/70 px-2 py-0.5 rounded-full border border-rose-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    LIVE UPDATE
                  </span>
                )}
                {post.eventDate && (
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>{post.eventDate}</span>
                  </span>
                )}
                {post.eventDate && post.eventVenue && <span className="text-slate-600">·</span>}
                {post.eventVenue && (
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{post.eventVenue}</span>
                  </span>
                )}
              </div>
            )}

            {/* Content with spoiler toggle if active & formatted @mentions */}
            {isHiddenSpoiler ? (
              <div
                onClick={() => setShowSpoilerContent(true)}
                className="p-4 bg-amber-950/30 border border-amber-900/60 rounded-xl text-center cursor-pointer hover:bg-amber-950/50 transition-all"
              >
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-300">
                  <Lock className="w-4 h-4" />
                  <span>Hidden Campus Tea Spoiler</span>
                </div>
                <p className="text-xs text-amber-400/80 mt-1">
                  Click here to reveal the tea
                </p>
              </div>
            ) : (
              <div className="text-sm sm:text-base text-slate-200 leading-relaxed space-y-3">
                <p>
                  <FormattedMentionText
                    text={post.content}
                    onMentionClick={onMentionClick}
                  />
                </p>
                {post.isSpoilerTea && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 pt-1">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Spoiler revealed</span>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-400">
                {post.tags.map((t) => (
                  <span key={t} className="text-emerald-400">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Emoji Reactions Bar on Post */}
            <div className="mt-4 pt-3 border-t border-[#1e294b]/60">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Reactions:</span>
                {EMOJI_REACTIONS.map((reaction) => {
                  const count = post.reactions?.[reaction.type] || 0;
                  const isPicked = post.userReactions?.includes(reaction.type);
                  return (
                    <button
                      key={reaction.type}
                      type="button"
                      onClick={() => onToggleReaction?.(post.id, undefined, reaction.type)}
                      title={`${reaction.label} (${count})`}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border ${
                        isPicked
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-[#080d1a] border-[#1e294b] text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{reaction.emoji}</span>
                      {count > 0 && <span className="tabular-nums font-semibold text-[11px]">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post stats bar */}
            <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-[#1e294b] text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onVotePost(post.id, 'up')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    post.userVoted === 'up'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes} Upvotes</span>
                </button>

                <button
                  onClick={() => onVotePost(post.id, 'down')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    post.userVoted === 'down'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} replies</span>
                </span>
                <button
                  onClick={() => onReport(post.id)}
                  className="hover:text-rose-400 p-1 transition-colors"
                  title="Report post"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments Discussion Thread Section */}
          <div className="space-y-4 pt-4 border-t border-[#1e294b]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Student Discussion</span>
              <span className="text-xs text-slate-400 font-normal">
                ({post.comments.length} comments)
              </span>
            </h2>

            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No replies yet. Drop your take first or tag peers with @alias!
              </p>
            ) : (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-xl bg-[#080d1a] border border-[#1e294b] text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5 text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        {comment.isAuthorGhost ? (
                          <Ghost className="w-3 h-3 text-purple-400" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        )}
                        <span>{comment.authorAlias}</span>
                        <span className="text-[10px] text-slate-500">({comment.authorUniversity.toUpperCase()})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                    </div>

                    <p className="text-slate-200 leading-relaxed">
                      <FormattedMentionText
                        text={comment.content}
                        onMentionClick={onMentionClick}
                      />
                    </p>

                    {/* Comment Reactions & Voting */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#1e294b]/60">
                      <div className="flex items-center gap-1 flex-wrap">
                        {EMOJI_REACTIONS.slice(0, 4).map((r) => {
                          const count = comment.reactions?.[r.type] || 0;
                          const isPicked = comment.userReactions?.includes(r.type);
                          return (
                            <button
                              key={r.type}
                              type="button"
                              onClick={() => onToggleReaction?.(post.id, comment.id, r.type)}
                              className={`px-1.5 py-0.5 rounded text-[11px] transition-colors cursor-pointer border ${
                                isPicked
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                                  : 'bg-slate-900 border-[#1e294b] text-slate-400 hover:text-white'
                              }`}
                            >
                              <span>{r.emoji}</span>
                              {count > 0 && <span className="ml-1 text-[10px]">{count}</span>}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => onVoteComment(post.id, comment.id, 'up')}
                        className={`flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                          comment.userVoted === 'up'
                            ? 'text-emerald-400'
                            : 'text-slate-400 hover:text-emerald-400'
                        }`}
                      >
                        <ArrowUp className="w-3 h-3" />
                        <span className="tabular-nums">{comment.upvotes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comment Composer Footer with @mention autocomplete */}
        <div className="p-4 border-t border-[#1e294b] bg-[#0c1527] shrink-0 relative">
          {commentMentionQuery !== null && (
            <MentionAutocomplete
              query={commentMentionQuery}
              onSelect={handleSelectCommentMention}
              className="bottom-full left-4 mb-2"
            />
          )}

          {commentError && (
            <div className="mb-2 p-2 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{commentError}</span>
            </div>
          )}

          <form onSubmit={handleSendComment} className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span>Replying as:</span>
                <button
                  type="button"
                  onClick={() => setIsAnonymousComment(!isAnonymousComment)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                    isAnonymousComment
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {isAnonymousComment ? (
                    <>
                      <Ghost className="w-3 h-3" />
                      <span>Ghost Mode</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{currentUser.alias}</span>
                    </>
                  )}
                </button>
              </div>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <AtSign className="w-3 h-3" /> Type @ to mention peer
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={commentInput}
                onChange={handleCommentInputChange}
                placeholder="Spill your thought or counter-argument... (e.g. @CopperGeek)"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#1e294b] bg-[#080d1a] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-xs active:scale-95"
                title="Send reply"
                aria-label="Send reply"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
