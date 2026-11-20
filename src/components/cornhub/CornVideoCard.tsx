import React, { useState } from 'react';
import { CornVideo } from '../../types/cornhub';
import {
  Eye,
  ThumbsUp,
  MoreVertical,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';

interface CornVideoCardProps {
  video: CornVideo;
  onSelectVideo: (video: CornVideo) => void;
  onOpenWatchPage?: (video: CornVideo) => void;
}

export const CornVideoCard: React.FC<CornVideoCardProps> = ({
  video,
  onSelectVideo,
  onOpenWatchPage,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + '?corn=' + video.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    setShowMenu(false);
  };

  return (
    <div
      onClick={() => onSelectVideo(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
      className="group flex flex-col bg-[#0e0e0e] border border-[#242424] hover:border-[#ff9000]/60 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shadow-md select-none"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-[#151515]">
        <img
          src={video.image}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          onError={(e) => {
            // Fallback image if remote url fails
            (e.target as HTMLImageElement).src = '/assets/aistudio/thumb_76b7f7fb.jpg';
          }}
        />

        {/* Hover animated scanline / play overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
            <div className="w-12 h-12 rounded-full bg-[#ff9000] text-black flex items-center justify-center shadow-lg shadow-[#ff9000]/30 transform scale-110 transition-transform">
              <Play className="w-6 h-6 fill-black ml-0.5" />
            </div>

            {/* Quick Watch Page button on hover */}
            {onOpenWatchPage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenWatchPage(video);
                }}
                className="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold rounded bg-black/80 hover:bg-[#ff9000] text-white hover:text-black border border-white/20 transition-colors"
                title="Open dedicated watch page"
              >
                Watch Page
              </button>
            )}
          </div>
        )}

        {/* Duration badge */}
        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 text-[11px] font-mono font-bold text-[#c6c6c6] bg-black/85 rounded">
          {video.duration}
        </span>
      </div>

      {/* Video Details & Meta */}
      <div className="p-3 flex flex-col justify-between flex-1 space-y-1.5">
        {/* Creator, Views & Rating Row */}
        <div className="flex items-center justify-between text-xs text-[#888888]">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[#ffffff] font-semibold truncate hover:text-[#ff9000] transition-colors text-xs">
              {video.pornstar}
            </span>
            {video.isVerified && (
              <span title="Verified Cornstar">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6] fill-[#3b82f6]/20 shrink-0" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 tabular-nums text-[11px]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{video.views}</span>
            </span>
            <span className="flex items-center gap-1 text-[#ff9000]">
              <ThumbsUp className="w-3 h-3" />
              <span>{video.rating}</span>
            </span>
          </div>
        </div>

        {/* Video Title & Actions */}
        <div className="flex items-start justify-between gap-1.5 relative">
          <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#ff9000] transition-colors">
            {video.title}
          </h3>

          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-[#888888] hover:text-white rounded hover:bg-[#242424] transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-36 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow-2xl py-1 z-30 text-xs text-[#c6c6c6] animate-in fade-in"
              >
                <button
                  onClick={handleShare}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#2b2b2b] hover:text-white flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#ff9000]" />
                  <span>{copiedLink ? 'Copied!' : 'Share Video'}</span>
                </button>
                {onOpenWatchPage && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenWatchPage(video);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#2b2b2b] hover:text-white flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 text-[#ff9000]" />
                    <span>Watch View</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
