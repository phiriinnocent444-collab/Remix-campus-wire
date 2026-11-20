import React, { useState } from 'react';
import { CornVideo, CornComment } from '../../types/cornhub';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Share2,
  CheckCircle2,
  Eye,
  MessageSquare,
  Sparkles,
  Send,
  ExternalLink,
} from 'lucide-react';

interface CornWatchPageProps {
  video: CornVideo;
  allVideos: CornVideo[];
  onSelectVideo: (video: CornVideo) => void;
  onBackToPortal: () => void;
  onExitToZedWhisper?: () => void;
}

export const CornWatchPage: React.FC<CornWatchPageProps> = ({
  video,
  allVideos,
  onSelectVideo,
  onBackToPortal,
  onExitToZedWhisper,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [userVote, setUserVote] = useState<'up' | 'down' | undefined>(video.userVote);
  const [upvotes, setUpvotes] = useState(video.upvotes);
  const [downvotes, setDownvotes] = useState(video.downvotes);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<CornComment[]>(video.comments || []);
  const [copiedLink, setCopiedLink] = useState(false);

  const relatedVideos = allVideos.filter((v) => v.id !== video.id);

  const handleToggleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      setUserVote(undefined);
      if (type === 'up') setUpvotes((v) => v - 1);
      else setDownvotes((v) => v - 1);
    } else {
      if (userVote === 'up') setUpvotes((v) => v - 1);
      if (userVote === 'down') setDownvotes((v) => v - 1);
      setUserVote(type);
      if (type === 'up') setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: CornComment = {
      id: 'comm-' + Date.now(),
      author: 'StudentFan_' + Math.floor(100 + Math.random() * 900),
      comment: commentInput.trim(),
      upvotes: 1,
      timestamp: 'Just now',
    };

    setComments([newComment, ...comments]);
    setCommentInput('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + '?corn=' + video.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-3 sm:p-6 space-y-6">
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-[#242424] pb-3">
        <button
          onClick={onBackToPortal}
          className="flex items-center gap-2 text-xs font-semibold text-[#c6c6c6] hover:text-[#ff9000] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CornHub Portal</span>
        </button>

        {onExitToZedWhisper && (
          <button
            onClick={onExitToZedWhisper}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#1a1a1a] hover:bg-[#ff9000] text-[#c6c6c6] hover:text-black border border-[#2e2e2e] transition-colors cursor-pointer"
          >
            <span>Exit to Campus Network</span>
          </button>
        )}
      </div>

      {/* Main Two-Column Watch Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player & Meta (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Video Screen */}
          <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-[#0e0e0e] border border-[#242424] shadow-2xl flex items-center justify-center">
            <img
              src={video.image}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/aistudio/thumb_76b7f7fb.jpg';
              }}
            />

            {/* Simulated Live Player Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-[#ff9000] text-black flex items-center justify-center shadow-xl shadow-[#ff9000]/40 transform hover:scale-110 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black ml-1" />}
              </button>
            </div>

            <span className="absolute bottom-3 right-3 px-2 py-1 text-xs font-mono font-bold text-white bg-black/85 rounded-md">
              {video.duration} · 1080p
            </span>
          </div>

          {/* Video Title & Metrics */}
          <div className="space-y-3">
            <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight">
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#888888] pb-3 border-b border-[#242424]">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold flex items-center gap-1">
                  <Eye className="w-4 h-4 text-[#ff9000]" />
                  {video.views} views
                </span>
                <span>·</span>
                <span>Uploaded {video.uploadDate}</span>
                <span>·</span>
                <span className="text-[#ff9000] font-bold">{video.rating} Approval</span>
              </div>

              {/* Vote & Share Row */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVote('up')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    userVote === 'up'
                      ? 'bg-[#ff9000] text-black border-[#ff9000]'
                      : 'bg-[#151515] text-[#c6c6c6] border-[#242424] hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 fill-current" />
                  <span>{upvotes.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => handleToggleVote('down')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    userVote === 'down'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-[#151515] text-[#c6c6c6] border-[#242424] hover:text-white'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5 fill-current" />
                  <span>{downvotes.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151515] text-[#c6c6c6] hover:text-white border border-[#242424] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#ff9000]" />
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Creator Profile Box */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#0e0e0e] border border-[#242424]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#ff9000] text-black font-black text-base flex items-center justify-center">
                {video.pornstar.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm">{video.pornstar}</span>
                  {video.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#3b82f6] fill-[#3b82f6]/20" />
                  )}
                </div>
                <p className="text-xs text-[#888888]">42.8K Corn Enthusiasts Subscribed</p>
              </div>
            </div>

            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSubscribed
                  ? 'bg-[#242424] text-[#c6c6c6]'
                  : 'bg-[#ff9000] hover:bg-[#ff9000]/90 text-black shadow-md shadow-[#ff9000]/30'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Description & Tags */}
          <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#242424] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888]">
              About This Corn
            </h3>
            <p className="text-xs sm:text-sm text-[#c6c6c6] leading-relaxed whitespace-pre-line">
              {video.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {video.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-[#1a1a1a] text-[#c6c6c6] border border-[#2b2b2b] px-2.5 py-1 rounded-md"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#242424] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#ff9000]" />
              <span>Comments ({comments.length})</span>
            </h3>

            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Join the corny discussion..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#242424] bg-[#141414] text-white placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#ff9000]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#ff9000] text-black disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            <div className="space-y-2.5">
              {comments.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-[#141414] border border-[#242424] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">@{c.author}</span>
                    <span className="text-[10px] text-[#888888]">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#c6c6c6]">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Up Next / Recommended Corns (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider pb-1 border-b border-[#242424]">
            <Sparkles className="w-4 h-4 text-[#ff9000]" />
            <span>Up Next & Recommended</span>
          </h2>

          <div className="space-y-3">
            {relatedVideos.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectVideo(item)}
                className="group flex gap-3 p-2 rounded-xl bg-[#0e0e0e] hover:bg-[#161616] border border-[#242424] hover:border-[#ff9000]/60 transition-all cursor-pointer"
              >
                <div className="relative w-32 aspect-16/10 rounded-lg overflow-hidden bg-[#181818] shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/aistudio/thumb_76b7f7fb.jpg';
                    }}
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 text-[10px] font-mono font-bold text-white bg-black/85 rounded">
                    {item.duration}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#ff9000] transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-[#888888] space-y-0.5">
                    <p className="truncate text-white">{item.pornstar}</p>
                    <p>{item.views} views · {item.rating}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
