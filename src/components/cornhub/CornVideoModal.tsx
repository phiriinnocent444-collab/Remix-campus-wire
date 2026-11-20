import React, { useState, useEffect, useRef } from 'react';
import { CornVideo, CornComment } from '../../types/cornhub';
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

interface CornVideoModalProps {
  video: CornVideo | null;
  onClose: () => void;
  onVote?: (videoId: string, type: 'up' | 'down') => void;
  onAddComment?: (videoId: string, commentText: string) => void;
  onOpenWatchPage?: (video: CornVideo) => void;
}

export const CornVideoModal: React.FC<CornVideoModalProps> = ({
  video,
  onClose,
  onVote,
  onAddComment,
  onOpenWatchPage,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(120);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [userVote, setUserVote] = useState<'up' | 'down' | undefined>(video?.userVote);
  const [upvotes, setUpvotes] = useState(video?.upvotes || 1200);
  const [downvotes, setDownvotes] = useState(video?.downvotes || 40);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<CornComment[]>(video?.comments || []);
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

      // Parse duration to seconds (e.g. 15:28 -> 928)
      const parts = video.duration.split(':').map((p) => parseInt(p, 10));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        setTotalSeconds(parts[0] * 60 + parts[1]);
      } else {
        setTotalSeconds(120);
      }
    }
  }, [video]);

  // Video playback time simulation ticker
  useEffect(() => {
    let interval: any;
    if (isPlaying && video) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds, playbackSpeed, video]);

  // Canvas visualizer rendering hot corn sizzle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw stylized golden glowing ear of corn
      ctx.save();
      ctx.translate(centerX, centerY);

      // Golden aura pulse if playing
      if (isPlaying) {
        const pulse = Math.sin(frame * 0.05) * 15;
        const gradient = ctx.createRadialGradient(0, 0, 40, 0, 0, 180 + pulse);
        gradient.addColorStop(0, 'rgba(255, 144, 0, 0.35)');
        gradient.addColorStop(0.6, 'rgba(234, 179, 8, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 180 + pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Corn Cob base
      ctx.fillStyle = '#eab308'; // Corn yellow
      ctx.beginPath();
      ctx.ellipse(0, 0, 65, 120, Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ca8a04';
      ctx.stroke();

      // Draw corn rows & kernels
      ctx.fillStyle = '#fef08a';
      for (let r = -5; r <= 5; r++) {
        for (let c = -2; c <= 2; c++) {
          const wobble = isPlaying ? Math.sin(frame * 0.08 + r + c) * 1.5 : 0;
          ctx.beginPath();
          ctx.arc(c * 20 + wobble, r * 18, 6.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Green husks on the sides
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(-55, 30, 22, 100, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(55, 30, 22, 100, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Butter sizzle particles
      if (isPlaying) {
        for (let i = 0; i < 8; i++) {
          const angle = (frame * 0.03 + (i * Math.PI) / 4) % (Math.PI * 2);
          const dist = 75 + ((frame * 2 + i * 20) % 80);
          const px = Math.cos(angle) * dist;
          const py = Math.sin(angle) * dist;
          ctx.fillStyle = '#ff9000';
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  if (!video) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
    if (onVote) onVote(video.id, type);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: CornComment = {
      id: 'comm-' + Date.now(),
      author: 'CampusStudent_' + Math.floor(100 + Math.random() * 900),
      comment: commentInput.trim(),
      upvotes: 1,
      timestamp: 'Just now',
    };

    setComments([newComment, ...comments]);
    setCommentInput('');
    if (onAddComment) onAddComment(video.id, commentInput.trim());
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + '?corn=' + video.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-[#0a0a0a] border border-[#242424] rounded-2xl shadow-2xl text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#242424]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm sm:text-base tracking-tight">
              Corn<span className="bg-[#ff9000] text-black px-1.5 py-0.2 rounded font-black text-xs ml-0.5">hub</span>
            </span>
            <span className="text-xs text-[#888888]">· Theater Player</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenWatchPage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWatchPage(video);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[#1e1e1e] hover:bg-[#ff9000] text-[#c6c6c6] hover:text-black transition-colors cursor-pointer"
              >
                Full Watch Page
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#c6c6c6] hover:text-white rounded-lg hover:bg-[#242424] transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Stage / Canvas Player */}
        <div className="relative aspect-16/9 w-full bg-black flex items-center justify-center overflow-hidden group">
          <canvas
            ref={canvasRef}
            width={854}
            height={480}
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          />

          {/* Central play/pause splash button on pause */}
          {!isPlaying && (
            <div
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#ff9000] text-black flex items-center justify-center shadow-xl shadow-[#ff9000]/40 transform hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
            </div>
          )}

          {/* Video Control Bar (Bottom overlay) */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2 transition-opacity">
            {/* Scrubber Progress Bar */}
            <div className="relative w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer transition-all">
              <div
                className="h-full bg-[#ff9000] rounded-full relative"
                style={{ width: `${(currentTime / totalSeconds) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md transform translate-x-1/2 scale-100" />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-[#ff9000] transition-colors p-1"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-[#ff9000] transition-colors p-1"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 sm:w-20 accent-[#ff9000] h-1"
                  />
                </div>

                <span className="font-mono tabular-nums text-[11px] text-[#c6c6c6]">
                  {formatSeconds(currentTime)} / {video.duration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Playback Speed selector */}
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="bg-black/60 text-[#c6c6c6] hover:text-white border border-white/20 rounded px-1.5 py-0.5 text-[11px] font-mono cursor-pointer"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2.0x</option>
                </select>

                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#ff9000] text-black">
                  1080p60 HD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info & Social Bar */}
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#888888] border-b border-[#242424] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[#c6c6c6] font-semibold">{video.views} views</span>
                <span>·</span>
                <span>Uploaded {video.uploadDate}</span>
                <span>·</span>
                <span className="text-[#ff9000] font-bold">{video.rating} Rating</span>
              </div>

              {/* Action Buttons: Like, Dislike, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVote('up')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    userVote === 'up'
                      ? 'bg-[#ff9000] text-black border-[#ff9000]'
                      : 'bg-[#151515] text-[#c6c6c6] border-[#242424] hover:text-white hover:border-[#ff9000]/60'
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151515] text-[#c6c6c6] hover:text-white border border-[#242424] hover:border-[#ff9000]/60 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#ff9000]" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Creator Profile Strip */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#242424]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff9000] text-black font-extrabold flex items-center justify-center text-sm shadow-md">
                {video.pornstar.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm">{video.pornstar}</span>
                  {video.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#3b82f6] fill-[#3b82f6]/20" />
                  )}
                </div>
                <p className="text-[11px] text-[#888888]">Verified Corn Producer · 42.8K Subscribers</p>
              </div>
            </div>

            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSubscribed
                  ? 'bg-[#242424] text-[#c6c6c6]'
                  : 'bg-[#ff9000] hover:bg-[#ff9000]/90 text-black shadow-md shadow-[#ff9000]/20'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Description & Tags */}
          <div className="p-3.5 rounded-xl bg-[#0e0e0e] border border-[#242424] space-y-2">
            <p className="text-xs text-[#c6c6c6] leading-relaxed whitespace-pre-line">
              {video.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium bg-[#1e1e1e] text-[#c6c6c6] border border-[#2b2b2b] px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Student Comments Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#ff9000]" />
              <span>Campus Reactions & Comments ({comments.length})</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Leave a comment about this corn..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#242424] bg-[#141414] text-white placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-[#ff9000]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#ff9000] text-black disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Post</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-2.5 rounded-lg bg-[#141414] border border-[#222222] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#888888]">
                    <span className="font-semibold text-white">@{comm.author}</span>
                    <span>{comm.timestamp}</span>
                  </div>
                  <p className="text-[#c6c6c6]">{comm.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
