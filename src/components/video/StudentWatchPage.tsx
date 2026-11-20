import React, { useState } from 'react';
import { StudentVideo, StudentVideoComment } from '../../types/studentVideo';
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

interface StudentWatchPageProps {
  video: StudentVideo;
  allVideos: StudentVideo[];
  onSelectVideo: (video: StudentVideo) => void;
  onBackToPortal: () => void;
  onExitToZedWhisper?: () => void;
}

export const StudentWatchPage: React.FC<StudentWatchPageProps> = ({
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
  const [comments, setComments] = useState<StudentVideoComment[]>(video.comments || []);
  const [copiedLink, setCopiedLink] = useState(false);

  const relatedVideos = allVideos.filter((v) => v.id !== video.id);

  const handleVoteClick = (type: 'up' | 'down') => {
    if (userVote === type) {
      setUserVote(undefined);
      if (type === 'up') setUpvotes((v) => v - 1);
      if (type === 'down') setDownvotes((v) => v - 1);
    } else {
      if (userVote === 'up') setUpvotes((v) => v - 1);
      if (userVote === 'down') setDownvotes((v) => v - 1);
      setUserVote(type);
      if (type === 'up') setUpvotes((v) => v + 1);
      if (type === 'down') setDownvotes((v) => v + 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComm: StudentVideoComment = {
      id: 'comm-' + Date.now(),
      author: '@CampusStudent',
      comment: commentInput.trim(),
      upvotes: 1,
      timestamp: 'Just now',
    };

    setComments([newComm, ...comments]);
    setCommentInput('');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-3 sm:p-6 space-y-6">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#252525] text-xs font-bold text-white border border-[#2d2d2d] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#ff9900]" />
          <span>Back to Video Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181818] border border-[#2e2e2e]">
            <span className="font-extrabold text-sm text-white">Zed</span>
            <span className="px-1.5 py-0.5 rounded bg-[#ff9900] text-black font-extrabold text-xs">
              Whisper
            </span>
            <span className="text-xs text-[#888888] font-medium hidden sm:inline">Cinema</span>
          </div>

          {onExitToZedWhisper && (
            <button
              onClick={onExitToZedWhisper}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Exit to Campus Network</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: 8 cols Video + 4 cols Related Sidebar */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main 8 columns: Player, Metadata, Comments */}
        <div className="lg:col-span-8 space-y-5">
          {/* Main Video Viewport */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0c0c0c] border border-[#222222] shadow-2xl select-none group">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover filter brightness-95"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&auto=format&fit=crop&q=80';
              }}
            />

            {/* Play/Pause Center Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ff9900] text-black flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform cursor-pointer"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-black" />
                ) : (
                  <Play className="w-8 h-8 fill-black ml-1" />
                )}
              </button>
            </div>

            {/* Duration & Quality pill */}
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/85 text-white font-mono text-xs font-bold backdrop-blur-xs">
              {video.duration} · {video.qualityBadge || '1080p'}
            </div>
          </div>

          {/* Title & Stats */}
          <div className="space-y-3 pb-4 border-b border-[#222222]">
            <h1 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">
              {video.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#909090] flex-wrap">
                <span className="flex items-center gap-1 text-white font-semibold">
                  <Eye className="w-4 h-4 text-[#ff9900]" />
                  {video.views} views
                </span>
                <span>·</span>
                <span>Uploaded {video.uploadDate}</span>
                <span>·</span>
                <span className="text-[#ff9900] font-bold">{video.rating} Approval</span>
                {video.university && (
                  <>
                    <span>·</span>
                    <span className="text-slate-300">{video.university}</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl bg-[#181818] border border-[#2b2b2b] p-0.5">
                  <button
                    onClick={() => handleVoteClick('up')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      userVote === 'up'
                        ? 'bg-[#ff9900] text-black'
                        : 'text-slate-300 hover:text-white hover:bg-[#252525]'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${userVote === 'up' ? 'fill-black' : ''}`} />
                    <span>{upvotes.toLocaleString()}</span>
                  </button>
                  <div className="w-[1px] h-4 bg-[#333333]" />
                  <button
                    onClick={() => handleVoteClick('down')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      userVote === 'down'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-[#252525]'
                    }`}
                  >
                    <ThumbsDown
                      className={`w-4 h-4 ${userVote === 'down' ? 'fill-white' : ''}`}
                    />
                    <span>{downvotes.toLocaleString()}</span>
                  </button>
                </div>

                <button
                  onClick={handleShare}
                  className="px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#252525] border border-[#2b2b2b] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#ff9900]" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Channel Info & Subscribe */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#141414] border border-[#242424]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#ff9900] text-black font-extrabold flex items-center justify-center text-lg shadow">
                {video.author.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-base text-white">
                  <span>{video.author}</span>
                  {video.verified && <CheckCircle2 className="w-4 h-4 text-[#ff9900]" />}
                </div>
                <p className="text-xs text-[#888888]">
                  Verified Campus Creator · Zambian Student Network
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isSubscribed
                  ? 'bg-[#282828] text-slate-400 border border-[#383838]'
                  : 'bg-[#ff9900] hover:bg-[#ffaa22] text-black shadow-md'
              }`}
            >
              {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </div>

          {/* Video Description Box */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About This Campus Video
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">{video.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#ff9900] hover:underline cursor-pointer"
                >
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Comments Section */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#ff9900]" />
              <span>Campus Reactions ({comments.length})</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Join the discussion on this campus highlight..."
                className="flex-1 bg-[#1c1c1c] text-xs text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-[#303030] focus:border-[#ff9900] outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-5 py-3 rounded-xl bg-[#ff9900] hover:bg-[#ffaa22] text-black font-extrabold text-xs flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[#181818] border border-[#262626] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{c.author}</span>
                      {c.university && (
                        <span className="text-[10px] text-[#ff9900] font-normal">
                          ({c.university})
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-500">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 columns: Up Next & Recommended Videos Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#909090] flex items-center gap-2 pb-2 border-b border-[#222222]">
            <Sparkles className="w-4 h-4 text-[#ff9900]" />
            <span>Up Next on Campus</span>
          </h2>

          <div className="space-y-3">
            {relatedVideos.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectVideo(item)}
                className="group flex gap-3 p-2 rounded-xl bg-[#121212] hover:bg-[#1a1a1a] border border-[#222222] hover:border-[#ff9900] transition-all cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative w-36 aspect-video bg-[#1e1e1e] rounded-lg overflow-hidden shrink-0">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/85 text-white font-mono text-[9px] font-bold">
                    {item.duration}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#ff9900] transition-colors">
                    {item.title}
                  </h4>
                  <div className="space-y-0.5 text-[11px] text-[#888888]">
                    <p className="truncate font-medium text-slate-300">{item.author}</p>
                    <p className="flex items-center gap-1.5">
                      <span>{item.views} views</span>
                      <span>·</span>
                      <span className="text-[#ff9900] font-semibold">{item.rating}</span>
                    </p>
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
