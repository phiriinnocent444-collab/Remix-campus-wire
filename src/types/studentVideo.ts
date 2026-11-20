export interface StudentVideoComment {
  id: string;
  author: string;
  comment: string;
  upvotes: number;
  timestamp: string;
  avatarUrl?: string;
  university?: string;
}

export interface StudentVideo {
  id: string;
  title: string;
  duration: string;
  views: string;
  rating: string;
  author: string;
  verified: boolean;
  avatarUrl?: string;
  thumbnailUrl: string;
  category: 'sports' | 'comedy' | 'academic' | 'campus_life' | 'events' | 'tech';
  tags: string[];
  uploadDate: string;
  description: string;
  comments: StudentVideoComment[];
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  university?: string;
  qualityBadge?: string;
}
