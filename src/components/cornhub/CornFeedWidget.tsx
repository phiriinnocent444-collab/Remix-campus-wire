import React from 'react';
import { CornVideo } from '../../types/cornhub';
import { Play, Sparkles, ChevronRight, Eye, ThumbsUp } from 'lucide-react';

interface CornFeedWidgetProps {
  videos: CornVideo[];
  onSelectVideo: (video: CornVideo) => void;
  onOpenCornHub: () => void;
}

export const CornFeedWidget: React.FC<CornFeedWidgetProps> = ({
  videos,
  onSelectVideo,
  onOpenCornHub,
}) => {
  return (
    <div className="rounded-2xl bg-[#0a0a0a] border border-[#ff9000]/40 p-4 sm:p-5 shadow-lg space-y-3.5 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="font-black text-sm text-white">Corn</span>
            <span className="bg-[#ff9000] text-black font-black text-xs px-1.5 py-0.2 rounded ml-0.5">
              hub
            </span>
          </div>
          <span className="text-xs text-[#888888]">· Trending Campus Clips</span>
        </div>

        <button
          onClick={onOpenCornHub}
          className="text-xs font-bold text-[#ff9000] hover:text-[#ff9000]/80 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Explore All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-none">
        {videos.slice(0, 5).map((v) => (
          <div
            key={v.id}
            onClick={() => onSelectVideo(v)}
            className="group w-48 shrink-0 rounded-xl bg-[#141414] border border-[#242424] hover:border-[#ff9000] p-2 flex flex-col justify-between transition-all cursor-pointer shadow-sm select-none"
          >
            <div>
              <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-black mb-2">
                <img
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/thumb_76b7f7fb.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-[#ff9000] text-black flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 px-1 py-0.2 text-[9px] font-mono font-bold text-white bg-black/85 rounded">
                  {v.duration}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#ff9000] transition-colors">
                {v.title}
              </h4>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#888888] pt-2 border-t border-[#222222] mt-2">
              <span className="truncate max-w-[80px] text-white font-medium">{v.pornstar}</span>
              <span className="flex items-center gap-1 text-[#ff9000] font-bold">
                <ThumbsUp className="w-2.5 h-2.5" />
                {v.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
