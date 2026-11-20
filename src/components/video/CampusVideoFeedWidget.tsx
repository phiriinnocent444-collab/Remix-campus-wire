import React from 'react';
import { StudentVideo } from '../../types/studentVideo';
import { Play, Sparkles, ChevronRight, Eye, ThumbsUp } from 'lucide-react';

interface CampusVideoFeedWidgetProps {
  videos: StudentVideo[];
  onSelectVideo: (video: StudentVideo) => void;
  onOpenVideoHub: () => void;
}

export const CampusVideoFeedWidget: React.FC<CampusVideoFeedWidgetProps> = ({
  videos,
  onSelectVideo,
  onOpenVideoHub,
}) => {
  return (
    <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-[#262626] shadow-xl text-white space-y-3.5">
      {/* Widget Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Iconic two-tone logo badge */}
          <div className="flex items-center select-none">
            <span className="font-extrabold text-sm sm:text-base text-white">Zed</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-[#ff9900] text-black font-extrabold text-xs sm:text-sm">
              Whisper
            </span>
          </div>

          <span className="text-slate-600">·</span>

          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-[#ff9900]" />
            <span>Trending Student Videos on Campus</span>
          </div>
        </div>

        <button
          onClick={onOpenVideoHub}
          className="text-xs font-bold text-[#ff9900] hover:text-[#ffaa22] flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View All ({videos.length})</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Horizontal Scrolling Video Carousel */}
      <div className="flex items-stretch gap-3.5 overflow-x-auto pb-2 scrollbar-none select-none">
        {videos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => onSelectVideo(vid)}
            className="group w-52 shrink-0 bg-[#141414] rounded-xl overflow-hidden border border-[#272727] hover:border-[#ff9900] transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full bg-[#1e1e1e] overflow-hidden">
              <img
                src={vid.thumbnailUrl}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#ff9900] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-md">
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-white font-mono text-[9px] font-bold">
                {vid.duration}
              </div>
            </div>

            {/* Video Meta */}
            <div className="p-2.5 space-y-1">
              <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#ff9900] transition-colors">
                {vid.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="truncate max-w-[90px]">{vid.author}</span>
                <span className="flex items-center gap-1 text-[#ff9900] font-semibold">
                  <ThumbsUp className="w-2.5 h-2.5 fill-[#ff9900]" />
                  {vid.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
