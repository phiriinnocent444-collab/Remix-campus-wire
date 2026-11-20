import React, { useState } from 'react';
import { StudentVideo } from '../../types/studentVideo';
import { CheckCircle2, MoreVertical, ThumbsUp, Eye, Play, Sparkles } from 'lucide-react';

interface StudentVideoCardProps {
  video: StudentVideo;
  onClick: () => void;
  onOpenWatchPage?: () => void;
}

export const StudentVideoCard: React.FC<StudentVideoCardProps> = ({
  video,
  onClick,
  onOpenWatchPage,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverScrub, setHoverScrub] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setHoverScrub(pct);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoverScrub(0);
      }}
      onMouseMove={handleMouseMove}
      className="group flex flex-col bg-[#121212] rounded-xl overflow-hidden border border-[#272727] hover:border-[#ff9900] transition-all duration-200 cursor-pointer shadow-md hover:shadow-orange-500/10"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-[#1e1e1e] overflow-hidden select-none">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105 filter brightness-105' : 'scale-100'
          }`}
          loading="lazy"
          onError={(e) => {
            // Fallback to high quality campus placeholder if remote load fails
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&auto=format&fit=crop&q=80';
          }}
        />

        {/* Hover Scrubbing Simulation Bar */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
            <div
              className="h-full bg-[#ff9900] transition-all duration-75"
              style={{ width: `${Math.max(hoverScrub, 12)}%` }}
            />
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-white font-mono text-[11px] font-bold tracking-wider backdrop-blur-xs">
          {video.duration}
        </div>

        {/* Quality HD Badge */}
        {video.qualityBadge && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#ff9900] text-black font-extrabold text-[9px] uppercase tracking-wider shadow-sm">
            {video.qualityBadge}
          </div>
        )}

        {/* Hover Play Button Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/35 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#ff9900] text-black flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        {/* Creator Row & Channel */}
        <div className="flex items-center justify-between text-xs text-[#909090]">
          <div className="flex items-center gap-1.5 truncate max-w-[170px]">
            <span className="font-semibold text-white group-hover:text-[#ff9900] transition-colors truncate">
              {video.author}
            </span>
            {video.verified && (
              <span title="Verified Campus Creator">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ff9900] shrink-0" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium shrink-0">
            <span className="flex items-center gap-1 text-slate-300">
              <Eye className="w-3 h-3 text-[#ff9900]" />
              {video.views}
            </span>
            <span className="flex items-center gap-0.5 text-[#ff9900] font-bold">
              <ThumbsUp className="w-3 h-3 fill-[#ff9900]" />
              {video.rating}
            </span>
          </div>
        </div>

        {/* Title & More Context */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-100 transition-colors"
            title={video.title}
          >
            {video.title}
          </h3>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenWatchPage) onOpenWatchPage();
              else onClick();
            }}
            className="text-[#717171] hover:text-white p-1 rounded hover:bg-[#272727] transition-colors shrink-0"
            title="Watch Video"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* University Badge & Tag */}
        {video.university && (
          <div className="text-[10px] text-slate-400 font-medium truncate pt-1 border-t border-[#222222]">
            {video.university}
          </div>
        )}
      </div>
    </div>
  );
};
