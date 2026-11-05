import { CampusMention, UniversityId } from '../types';

export function extractMentions(text: string): string[] {
  if (!text) return [];
  const regex = /@([a-zA-Z0-9_]+)/g;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)];
}

export const INITIAL_MENTIONS: CampusMention[] = [
  {
    id: 'mention-1',
    postId: 'post-live-1',
    postTitle: 'UNZA Main Library Exam Night Study Guidelines & WiFi Boost',
    mentionedAlias: 'ZedScholar_ZM',
    authorAlias: 'LibraryMonk',
    authorUniversity: 'unza',
    snippet: 'Hey @ZedScholar_ZM check out the revised basement study carrels for our group revision tonight.',
    timestamp: '25m ago',
    isRead: false,
    type: 'post',
  },
  {
    id: 'mention-2',
    postId: 'post-live-2',
    postTitle: 'CBU Riverside Engineering Workshop Exhibition Tomorrow',
    mentionedAlias: 'ZedScholar_ZM',
    authorAlias: 'CopperGeek',
    authorUniversity: 'cbu',
    snippet: 'Are you coming with @ZedScholar_ZM from Lusaka for the copper tech robotics demo?',
    timestamp: '1h ago',
    isRead: false,
    type: 'comment',
  },
  {
    id: 'mention-3',
    postId: 'post-live-1',
    postTitle: 'UNZA Main Library Exam Night Study Guidelines & WiFi Boost',
    mentionedAlias: 'ZedScholar_ZM',
    authorAlias: 'RidgewayDoc',
    authorUniversity: 'unza',
    snippet: '@ZedScholar_ZM do you have the PDF notes for clinical anatomy study group?',
    timestamp: '3h ago',
    isRead: true,
    type: 'comment',
  },
];
