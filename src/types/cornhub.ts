export interface CornComment {
  id: string;
  author: string;
  authorAvatar?: string;
  comment: string;
  upvotes: number;
  timestamp: string;
  userLiked?: boolean;
}

export interface CornVideo {
  id: string;
  title: string;
  image: string;
  duration: string;
  views: string;
  rating: string;
  pornstar: string;
  isVerified?: boolean;
  tags: string[];
  description: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  uploadDate: string;
  comments: CornComment[];
  videoUrl?: string;
}
