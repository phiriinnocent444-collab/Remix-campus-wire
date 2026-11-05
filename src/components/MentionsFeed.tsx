import React, { useState } from 'react';
import { CampusMention, CurrentUser } from '../types';
import { UniversityLogo } from './UniversityLogo';
import { FormattedMentionText } from './MentionAutocomplete';
import {
  AtSign,
  CheckCheck,
  MessageSquare,
  MessageCircle,
  ExternalLink,
  Sparkles,
  BellRing,
  Filter,
} from 'lucide-react';

interface MentionsFeedProps {
  mentions: CampusMention[];
  currentUser: CurrentUser;
  onSelectMention: (mention: CampusMention) => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (mentionId: string) => void;
  onMentionClickAlias?: (alias: string) => void;
}

export const MentionsFeed: React.FC<MentionsFeedProps> = ({
  mentions,
  currentUser,
  onSelectMention,
  onMarkAllAsRead,
  onMarkAsRead,
  onMentionClickAlias,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'post' | 'comment'>('all');

  const unreadCount = mentions.filter((m) => !m.isRead).length;

  const filteredMentions = mentions.filter((m) => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'post') return m.type === 'post';
    if (filter === 'comment') return m.type === 'comment';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-[#0c1527] border border-[#1e294b] rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <AtSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Campus Peer Mentions
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Notifications when students tag <span className="text-emerald-400 font-semibold">@{currentUser.alias}</span> in campus tea, study discussions, and replies.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl hover:text-white transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#1e294b]/70 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium whitespace-nowrap ${
              filter === 'all'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            All ({mentions.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium whitespace-nowrap ${
              filter === 'unread'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('post')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium whitespace-nowrap ${
              filter === 'post'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            In Whispers ({mentions.filter((m) => m.type === 'post').length})
          </button>
          <button
            onClick={() => setFilter('comment')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium whitespace-nowrap ${
              filter === 'comment'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            In Comments ({mentions.filter((m) => m.type === 'comment').length})
          </button>
        </div>
      </div>

      {/* Mentions List */}
      {filteredMentions.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#0c1527] border border-dashed border-[#1e294b] rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-[#1e294b] text-slate-400 flex items-center justify-center mx-auto mb-3">
            <BellRing className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            No mentions in this filter
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Tag peers using <span className="text-emerald-400 font-semibold">@alias</span> in your whispers or comments to notify them and start a conversation!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMentions.map((mention) => (
            <article
              key={mention.id}
              onClick={() => {
                onMarkAsRead(mention.id);
                onSelectMention(mention);
              }}
              className={`group bg-[#0c1527] border transition-all rounded-xl p-4 sm:p-4.5 cursor-pointer relative shadow-sm hover:shadow-md ${
                !mention.isRead
                  ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-[#0c1527] to-[#0c1527]'
                  : 'border-[#1e294b] hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="relative shrink-0 mt-0.5">
                    <UniversityLogo university={mention.authorUniversity} size="sm" />
                    {!mention.isRead && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c1527]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-xs mb-1">
                      <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        @{mention.authorAlias}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 uppercase text-[11px] font-semibold">
                        {mention.authorUniversity}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 text-[11px]">{mention.timestamp}</span>
                      <span className="text-slate-500">·</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                        {mention.type === 'post' ? (
                          <>
                            <MessageSquare className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Whisper Post</span>
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-2.5 h-2.5 text-blue-400" />
                            <span>Comment Reply</span>
                          </>
                        )}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1 mb-1.5 group-hover:text-white transition-colors">
                      {mention.postTitle}
                    </h4>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-[#1e294b]/60 text-xs text-slate-300 leading-relaxed">
                      <FormattedMentionText
                        text={mention.snippet}
                        onMentionClick={onMentionClickAlias}
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(mention.id);
                      onSelectMention(mention);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="View whisper conversation"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
