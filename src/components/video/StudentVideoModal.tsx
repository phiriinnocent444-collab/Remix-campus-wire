import React, { useState, useEffect, useRef } from 'react';
import { StudentVideo, StudentVideoComment } from '../../types/studentVideo';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Send,
  Sliders,
  Settings,
  Film,
} from 'lucide-react';

interface StudentVideoModalProps {
  video: StudentVideo | null;
  onClose: () => void;
  onVote?: (videoId: string, type: 'up' | 'down') => void;
  onAddComment?: (videoId: string, commentText: string) => void;
  onOpenWatchPage?: (video: StudentVideo) => void;
}

export const StudentVideoModal: React.FC<StudentVideoModalProps> = ({
  video,
  onClose,
  onVote,
  onAddComment,
  onOpenWatchPage,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(180);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [userVote, setUserVote] = useState<'up' | 'down' | undefined>(video?.userVote);
  const [upvotes, setUpvotes] = useState(video?.upvotes || 4200);
  const [downvotes, setDownvotes] = useState(video?.downvotes || 40);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<StudentVideoComment[]>(video?.comments || []);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state when video prop changes
  useEffect(() => {
    if (video) {
      setUserVote(video.userVote);
      setUpvotes(video.upvotes);
      setDownvotes(video.downvotes);
      setComments(video.comments || []);
      setCurrentTime(0);
      setIsPlaying(true);

      // Parse duration like "14:32" into seconds
      const parts = video.duration.split(':').map(Number);
      if (parts.length === 2) {
        setTotalSeconds(parts[0] * 60 + parts[1]);
      } else {
        setTotalSeconds(180);
      }
    }
  }, [video]);

  // Video progress timer simulation
  useEffect(() => {
    if (!isPlaying || !video) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalSeconds) {
          return 0; // Loop video
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds, playbackSpeed, video]);

  // Canvas animated video wave visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      step += isPlaying ? 0.05 * playbackSpeed : 0.005;
      const w = canvas.width;
      const h = canvas.height;

      // Dark stage gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0a0a0a');
      grad.addColorStop(0.5, '#161208');
      grad.addColorStop(1, '#050505');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw subtle audio energy wave across the middle
      ctx.beginPath();
      ctx.strokeStyle = '#ff9900';
      ctx.lineWidth = 3;
      for (let x = 0; x < w; x += 6) {
        const freq1 = Math.sin(x * 0.015 + step * 2);
        const freq2 = Math.cos(x * 0.03 - step * 1.5);
        const amplitude = isPlaying ? 28 : 6;
        const y = h / 2 + (freq1 + freq2) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw energetic ambient particles
      for (let i = 0; i < 20; i++) {
        const px = (Math.sin(step + i * 1.7) * 0.5 + 0.5) * w;
        const py = (Math.cos(step * 0.8 + i * 1.3) * 0.4 + 0.5) * h;
        const size = (Math.sin(step + i) + 1.5) * 3;

        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 153, 0, 0.45)' : 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed, video]);

  if (!video) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setCurrentTime(Math.floor(pct * totalSeconds));
  };

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
    if (onVote) onVote(video.id, type);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: StudentVideoComment = {
      id: 'c-' + Date.now(),
      author: '@CampusStudent',
      comment: commentInput.trim(),
      upvotes: 1,
      timestamp: 'Just now',
    };

    setComments([newComment, ...comments]);
    if (onAddComment) onAddComment(video.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#121212] rounded-2xl border border-[#2e2e2e] shadow-2xl overflow-hidden my-auto text-white flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#181818] border-b border-[#282828] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">Zed</span>
            <span className="px-1.5 py-0.5 rounded bg-[#ff9900] text-black font-extrabold text-sm tracking-tight">
              Whisper
            </span>
            <span className="text-xs text-[#a0a0a0] font-medium hidden sm:inline">
              · Campus Video Player
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenWatchPage && (
              <button
                onClick={() => onOpenWatchPage(video)}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#272727] hover:bg-[#333333] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#ff9900]" />
                <span className="hidden sm:inline">Full Watch Page</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#222222] hover:bg-[#333333] text-[#aaaaaa] hover:text-white transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas & Controls */}
        <div className="relative aspect-video w-full bg-black select-none shrink-0 group">
          <canvas
            ref={canvasRef}
            width={854}
            height={480}
            className="w-full h-full object-cover block"
          />

          {/* Center Play Overlay Click Target */}
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-[#ff9900] text-black flex items-center justify-center shadow-2xl transform scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
            )}
          </div>

          {/* Bottom Player Overlay Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
            {/* Scrub Progress Bar */}
            <div
              onClick={handleScrub}
              className="relative w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full cursor-pointer transition-all group/scrub"
            >
              <div
                className="h-full bg-[#ff9900] rounded-full relative"
                style={{ width: `${(currentTime / totalSeconds) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md transform scale-0 group-hover/scrub:scale-100 transition-transform" />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 hover:text-[#ff9900] transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                </button>

                {/* Volume slider */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:text-[#ff9900] transition-colors cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-16 accent-[#ff9900] h-1 bg-white/30 rounded cursor-pointer hidden sm:inline-block"
                  />
                </div>

                <span className="text-[#a0a0a0] font-mono text-[11px]">
                  {formatTime(currentTime)} / {formatTime(totalSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Speed selector */}
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="bg-[#242424] text-white text-[11px] rounded px-1.5 py-0.5 border border-[#3a3a3a] outline-none cursor-pointer"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2.0x</option>
                </select>

                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ff9900]/20 text-[#ff9900] font-bold border border-[#ff9900]/40">
                  {video.qualityBadge || '1080p60 HD'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Metadata & Actions Row */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#282828]">
            <div className="space-y-1">
              <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
                {video.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#909090] flex-wrap">
                <span>{video.views} views</span>
                <span>·</span>
                <span>Uploaded {video.uploadDate}</span>
                <span>·</span>
                <span className="text-[#ff9900] font-bold">{video.rating} Rating</span>
                {video.university && (
                  <>
                    <span>·</span>
                    <span className="text-slate-300 font-medium">{video.university}</span>
                  </>
                )}
              </div>
            </div>

            {/* Voting & Share segmented buttons */}
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              <div className="flex items-center rounded-lg bg-[#222222] border border-[#333333] p-0.5">
                <button
                  onClick={() => handleVoteClick('up')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    userVote === 'up'
                      ? 'bg-[#ff9900] text-black'
                      : 'text-slate-300 hover:text-white hover:bg-[#2e2e2e]'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${userVote === 'up' ? 'fill-black' : ''}`} />
                  <span>{upvotes.toLocaleString()}</span>
                </button>

                <div className="w-[1px] h-4 bg-[#3a3a3a]" />

                <button
                  onClick={() => handleVoteClick('down')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    userVote === 'down'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-[#2e2e2e]'
                  }`}
                >
                  <ThumbsDown
                    className={`w-3.5 h-3.5 ${userVote === 'down' ? 'fill-white' : ''}`}
                  />
                  <span>{downvotes.toLocaleString()}</span>
                </button>
              </div>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#333333] border border-[#333333] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#ff9900]" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Author Channel Box */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#181818] border border-[#272727]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff9900] text-black font-extrabold flex items-center justify-center text-base shadow">
                {video.author.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-white">
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
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSubscribed
                  ? 'bg-[#2a2a2a] text-[#aaaaaa] border border-[#3a3a3a]'
                  : 'bg-[#ff9900] hover:bg-[#ffaa22] text-black shadow-md'
              }`}
            >
              {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </div>

          {/* Description & Tags */}
          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#242424] space-y-2">
            <p className="text-xs text-slate-300 leading-relaxed">{video.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium text-[#ff9900] hover:underline cursor-pointer"
                >
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#ff9900]" />
                <span>Campus Reactions & Comments ({comments.length})</span>
              </h3>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Leave a comment about this video or varsity activity..."
                className="flex-1 bg-[#1a1a1a] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#333333] focus:border-[#ff9900] outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#ff9900] hover:bg-[#ffaa22] text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comment List */}
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3 rounded-xl bg-[#181818] border border-[#252525] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1">
                      <span>{comm.author}</span>
                      {comm.university && (
                        <span className="text-[10px] text-[#ff9900] font-normal">
                          ({comm.university})
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500">{comm.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{comm.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
