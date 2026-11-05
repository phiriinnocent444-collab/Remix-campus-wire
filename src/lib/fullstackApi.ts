import { GossipPost, UniversityId, PostCategory } from '../types';

export interface AuthStudent {
  id: string;
  email: string;
  realName: string;
  alias: string;
  university: UniversityId;
  campus: string;
  program: string;
  year: number;
}

export interface BackendStatus {
  online: boolean;
  serverType: string;
  database: string;
  totalPosts: number;
  totalUsers: number;
  latencyMs: number;
  timestamp?: string;
}

const TOKEN_KEY = 'zedwhisper_auth_token';
const USER_KEY = 'zedwhisper_auth_user';

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAuthUser(): AuthStudent | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setStoredAuth(token: string, user: AuthStudent) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// 1. Health check
export async function checkBackendHealth(): Promise<BackendStatus> {
  const start = performance.now();
  try {
    const res = await fetch('/api/health');
    const latencyMs = Math.round(performance.now() - start);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      online: true,
      serverType: data.server || 'Full-Stack Express / Node',
      database: data.database || 'Active Server DB',
      totalPosts: data.totalPosts || 0,
      totalUsers: data.totalUsers || 0,
      latencyMs,
      timestamp: data.timestamp,
    };
  } catch {
    const latencyMs = Math.round(performance.now() - start);
    return {
      online: false,
      serverType: 'Local Fallback / Standalone',
      database: 'Client Store & Supabase Mirror',
      totalPosts: 0,
      totalUsers: 0,
      latencyMs,
    };
  }
}

// 2. Student Registration
export async function registerStudent(data: {
  email: string;
  password: string;
  university: UniversityId;
  realName: string;
  alias: string;
  program: string;
  year: number;
}): Promise<{ token: string; user: AuthStudent }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Failed to register student account.');
  }

  setStoredAuth(body.token, body.user);
  return body;
}

// 3. Student Login
export async function loginStudent(credentials: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthStudent }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Invalid university email or password.');
  }

  setStoredAuth(body.token, body.user);
  return body;
}

// 4. Current Authenticated User Check
export async function fetchCurrentAuthUser(): Promise<AuthStudent | null> {
  const token = getStoredAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      clearStoredAuth();
      return null;
    }
    const data = await res.json();
    if (data.user) {
      setStoredAuth(token, data.user);
      return data.user;
    }
  } catch {
    // Return cached user if offline
    return getStoredAuthUser();
  }
  return null;
}

// 5. Fetch Posts from Database
export async function fetchBackendPosts(params?: {
  university?: UniversityId;
  category?: PostCategory;
  search?: string;
  sortBy?: 'trending' | 'latest' | 'discussed';
}): Promise<GossipPost[]> {
  try {
    const query = new URLSearchParams();
    if (params?.university && params.university !== 'all') {
      query.set('university', params.university);
    }
    if (params?.category && params.category !== 'all') {
      query.set('category', params.category);
    }
    if (params?.search) {
      query.set('search', params.search);
    }
    if (params?.sortBy) {
      query.set('sortBy', params.sortBy);
    }

    const res = await fetch(`/api/posts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load posts from full-stack backend');
    const data = await res.json();
    return data.posts || [];
  } catch (err) {
    console.warn('Backend fetch failed, using local/peer store:', err);
    return [];
  }
}

// 6. Create Post in Database
export async function createBackendPost(postData: {
  title: string;
  content: string;
  university: UniversityId;
  campusBranch?: string;
  category: PostCategory;
  authorAlias: string;
  isAnonymous: boolean;
  tags?: string[];
}): Promise<GossipPost | null> {
  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error('Failed to create post');
    const data = await res.json();
    return data.post;
  } catch (err) {
    console.error('Create backend post error:', err);
    return null;
  }
}

// 7. Vote Post
export async function voteBackendPost(
  postId: string,
  direction: 'up' | 'down'
): Promise<{ upvotes: number; downvotes: number } | null> {
  try {
    const res = await fetch(`/api/posts/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// 8. Add Comment
export async function addBackendComment(
  postId: string,
  comment: { content: string; authorAlias: string; authorUniversity: UniversityId }
) {
  try {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
