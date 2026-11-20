import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.resolve(__dirname, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.resolve(__dirname, 'data'))) {
  fs.mkdirSync(path.resolve(__dirname, 'data'), { recursive: true });
}

// Database schema and memory cache
interface DbSchema {
  users: Array<{
    id: string;
    email: string;
    passwordHash: string;
    realName: string;
    alias: string;
    university: string;
    campus: string;
    program: string;
    year: number;
    token: string;
    createdAt: string;
  }>;
  posts: Array<{
    id: string;
    title: string;
    content: string;
    university: string;
    campusBranch?: string;
    category: string;
    authorAlias: string;
    isAnonymous: boolean;
    upvotes: number;
    downvotes: number;
    commentsCount: number;
    timestamp: string;
    tags: string[];
    comments: Array<{
      id: string;
      postId: string;
      authorAlias: string;
      authorUniversity: string;
      content: string;
      upvotes: number;
      timestamp: string;
    }>;
  }>;
  polls: Array<{
    id: string;
    question: string;
    university: string;
    options: Array<{ id: string; text: string; votes: number }>;
    totalVotes: number;
    closingDate: string;
    category: string;
  }>;
  votes: Record<string, 'up' | 'down'>;
}

// Initial DB template
const defaultDb: DbSchema = {
  users: [
    {
      id: 'user-default-1',
      email: 'student@unza.zm',
      passwordHash: 'pass123',
      realName: 'Innocent Phiri',
      alias: 'ZedScholar_ZM',
      university: 'unza',
      campus: 'Great East Road Campus',
      program: 'Computer Science',
      year: 3,
      token: 'tok_demo_zed_unza_998',
      createdAt: new Date().toISOString(),
    },
  ],
  posts: [
    {
      id: 'post-live-1',
      title: 'UNZA Main Library Exam Night Study Guidelines & WiFi Boost',
      content:
        'Fellow monks and mommas, UNZA Library has increased WiFi bandwidth in basement reading halls ahead of semester finals. Power sockets have also been serviced.',
      university: 'unza',
      campusBranch: 'Great East Road',
      category: 'exams',
      authorAlias: 'LibraryMonk',
      isAnonymous: false,
      upvotes: 42,
      downvotes: 1,
      commentsCount: 3,
      timestamp: 'Just now',
      tags: ['UNZA', 'Exams', 'Library', 'WiFi'],
      comments: [
        {
          id: 'c-1',
          postId: 'post-live-1',
          authorAlias: 'RidgewayDoc',
          authorUniversity: 'unza',
          content: 'Confirmed, downloading anatomy slides without lag today!',
          upvotes: 8,
          timestamp: '15m ago',
        },
      ],
    },
    {
      id: 'post-live-2',
      title: 'CBU Riverside Engineering Workshop Exhibition Tomorrow',
      content:
        'All CBU engineering students are welcome to the Jambo Drive innovation hall tomorrow at 10:00 AM for the annual robotics and mining tech demo.',
      university: 'cbu',
      campusBranch: 'Riverside Kitwe',
      category: 'events',
      authorAlias: 'CopperGeek',
      isAnonymous: true,
      upvotes: 35,
      downvotes: 0,
      commentsCount: 1,
      timestamp: '1h ago',
      tags: ['CBU', 'Engineering', 'Innovation'],
      comments: [],
    },
  ],
  polls: [
    {
      id: 'poll-server-1',
      question: 'Which university library has the fastest WiFi for exam prep?',
      university: 'all',
      options: [
        { id: 'opt-1', text: 'UNZA Great East Road Library', votes: 142 },
        { id: 'opt-2', text: 'CBU Riverside Knowledge Centre', votes: 118 },
        { id: 'opt-3', text: 'ZCAS University Digital Lab', votes: 89 },
        { id: 'opt-4', text: 'Mulungushi Great North Resource Hall', votes: 64 },
      ],
      totalVotes: 413,
      closingDate: '2026-12-01',
      category: 'Academics',
    },
  ],
  votes: {},
};

// Load or initialize DB
function getDb(): DbSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db.json, falling back to default:', err);
  }
  saveDb(defaultDb);
  return defaultDb;
}

function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// Middleware
app.use(express.json());

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  const db = getDb();
  res.json({
    status: 'online',
    server: 'Express.js (Node / TSX)',
    port: PORT,
    fullStack: true,
    totalPosts: db.posts.length,
    totalUsers: db.users.length,
    timestamp: new Date().toISOString(),
    infinityFreeReady: true,
  });
});

// Authentication: Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, university, realName, alias, program, year } = req.body;

  if (!email || !password || !university) {
    return res.status(400).json({ error: 'Email, password, and university are required.' });
  }

  const db = getDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'A student account with this email already exists.' });
  }

  const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const newUser = {
    id: `user-${Date.now()}`,
    email: email.trim().toLowerCase(),
    passwordHash: password, // In production, bcrypt
    realName: realName || 'Student Scholar',
    alias: alias || `Scholar_${Math.floor(Math.random() * 899 + 100)}`,
    university: university || 'unza',
    campus: 'Main Campus',
    program: program || 'Undergraduate Degree',
    year: Number(year) || 1,
    token,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({
    message: 'Student account registered successfully.',
    token,
    user: safeUser,
  });
});

// Authentication: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = getDb();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid university email or password.' });
  }

  const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  user.token = token;
  saveDb(db);

  const { passwordHash: _, ...safeUser } = user;
  res.json({
    message: 'Welcome back to ZedWhisper.',
    token,
    user: safeUser,
  });
});

// Authentication: Current User
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const db = getDb();
  const user = db.users.find((u) => u.token === token);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid token.' });
  }

  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Posts: Get Posts with filters
app.get('/api/posts', (req: Request, res: Response) => {
  const { university, category, search, sortBy } = req.query;
  const db = getDb();

  let results = [...db.posts];

  if (university && university !== 'all') {
    results = results.filter((p) => p.university === university);
  }

  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.authorAlias.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sortBy === 'latest') {
    // Reverse or by timestamp
    results.reverse();
  } else if (sortBy === 'discussed') {
    results.sort((a, b) => b.commentsCount - a.commentsCount);
  } else {
    // default trending
    results.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
  }

  res.json({
    count: results.length,
    posts: results,
  });
});

// Posts: Create Post
app.post('/api/posts', (req: Request, res: Response) => {
  const {
    title,
    content,
    university,
    campusBranch,
    category,
    authorAlias,
    isAnonymous,
    tags,
  } = req.body;

  if (!title || !content || !university) {
    return res.status(400).json({ error: 'Title, content, and university are required.' });
  }

  const db = getDb();
  const newPost = {
    id: `post-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: title.trim(),
    content: content.trim(),
    university: university || 'all',
    campusBranch: campusBranch || 'Main Campus',
    category: category || 'gossip',
    authorAlias: isAnonymous ? 'Anonymous Scholar' : authorAlias || 'ZedStudent',
    isAnonymous: Boolean(isAnonymous),
    upvotes: 1,
    downvotes: 0,
    commentsCount: 0,
    timestamp: 'Just now',
    tags: Array.isArray(tags) ? tags : ['CampusBuzz'],
    comments: [],
  };

  db.posts.unshift(newPost);
  saveDb(db);

  res.status(201).json({
    message: 'Post created successfully on full-stack backend.',
    post: newPost,
  });
});

// Posts: Vote
app.post('/api/posts/:id/vote', (req: Request, res: Response) => {
  const { id } = req.params;
  const { direction } = req.body; // 'up' | 'down'
  const db = getDb();

  const post = db.posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  if (direction === 'up') {
    post.upvotes += 1;
  } else if (direction === 'down') {
    post.downvotes += 1;
  }

  saveDb(db);
  res.json({
    success: true,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
  });
});

// Posts: Add Comment
app.post('/api/posts/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, authorAlias, authorUniversity } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content cannot be empty.' });
  }

  const db = getDb();
  const post = db.posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    postId: id,
    authorAlias: authorAlias || 'Campus Peer',
    authorUniversity: authorUniversity || 'all',
    content: content.trim(),
    upvotes: 0,
    timestamp: 'Just now',
  };

  if (!post.comments) post.comments = [];
  post.comments.push(newComment);
  post.commentsCount = post.comments.length;

  saveDb(db);
  res.status(201).json({
    success: true,
    comment: newComment,
  });
});

// Polls: Get & Vote
app.get('/api/polls', (req: Request, res: Response) => {
  const db = getDb();
  res.json({ polls: db.polls });
});

app.post('/api/polls/:id/vote', (req: Request, res: Response) => {
  const { id } = req.params;
  const { optionId } = req.body;
  const db = getDb();

  const poll = db.polls.find((p) => p.id === id);
  if (!poll) {
    return res.status(404).json({ error: 'Poll not found.' });
  }

  const option = poll.options.find((o) => o.id === optionId);
  if (!option) {
    return res.status(404).json({ error: 'Poll option not found.' });
  }

  option.votes += 1;
  poll.totalVotes += 1;
  saveDb(db);

  res.json({ success: true, poll });
});

// InfinityFree Deployment & MySQL diagnostics
app.get('/api/infinityfree/status', (req: Request, res: Response) => {
  res.json({
    platform: 'InfinityFree Free LAMP Hosting',
    apachePhpCompatibility: '100% PHP 7.4 - 8.3 Supported',
    mysqlReady: true,
    endpointsProvided: [
      '/api/auth.php (Register, Login, Session)',
      '/api/posts.php (List, Create, Vote, Comment)',
      '/api/polls.php (List & Vote)',
      '/api/dev.php (Dev Lab Schema, SQL Sandbox & REST Catalog)',
      '/api/db.php (PDO MySQL & SQLite Auto-Fallback)',
    ],
    recommendedPhpVersion: 'PHP 8.2',
    instructionsUrl: '/INFINITYFREE_DEPLOYMENT_GUIDE.md',
  });
});

// DEV LAB: Database Schema Endpoint
app.get('/api/dev/schema', (req: Request, res: Response) => {
  res.json({
    database: 'zedwhisper_db (PostgreSQL / MySQL compatible)',
    tables: [
      {
        name: 'users',
        description: 'Registered university students across UNZA, CBU, Mulungushi, etc.',
        rowCount: getDb().users.length,
        columns: [
          { name: 'id', type: 'VARCHAR(64)', isPrimaryKey: true, nullable: false, description: 'Unique student identifier' },
          { name: 'email', type: 'VARCHAR(128)', isPrimaryKey: false, nullable: false, description: 'Verified student university email' },
          { name: 'real_name', type: 'VARCHAR(128)', isPrimaryKey: false, nullable: false, description: 'Student full legal name' },
          { name: 'alias', type: 'VARCHAR(64)', isPrimaryKey: false, nullable: false, description: 'Public or anonymous campus handle' },
          { name: 'university', type: 'VARCHAR(32)', isPrimaryKey: false, nullable: false, description: 'University acronym (unza, cbu, etc.)' },
          { name: 'program', type: 'VARCHAR(128)', isPrimaryKey: false, nullable: true, description: 'Academic program of study' },
          { name: 'year', type: 'INT', isPrimaryKey: false, nullable: true, description: 'Academic year (1-7)' },
          { name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, description: 'Account creation date' },
        ],
      },
      {
        name: 'posts',
        description: 'Campus discussions, academic notices, and student whispers',
        rowCount: getDb().posts.length,
        columns: [
          { name: 'id', type: 'VARCHAR(64)', isPrimaryKey: true, nullable: false, description: 'Unique post identifier' },
          { name: 'title', type: 'VARCHAR(255)', isPrimaryKey: false, nullable: false, description: 'Post heading' },
          { name: 'content', type: 'TEXT', isPrimaryKey: false, nullable: false, description: 'Body text content' },
          { name: 'university', type: 'VARCHAR(32)', isPrimaryKey: false, nullable: false, description: 'Target campus filter' },
          { name: 'category', type: 'VARCHAR(32)', isPrimaryKey: false, nullable: false, description: 'Category (exams, events, gossip, etc.)' },
          { name: 'author_alias', type: 'VARCHAR(64)', isPrimaryKey: false, nullable: false, description: 'Author display name' },
          { name: 'upvotes', type: 'INT', isPrimaryKey: false, nullable: false, description: 'Total upvotes count' },
          { name: 'comments_count', type: 'INT', isPrimaryKey: false, nullable: false, description: 'Total comments count' },
          { name: 'timestamp', type: 'VARCHAR(32)', isPrimaryKey: false, nullable: false, description: 'Relative time label' },
        ],
      },
      {
        name: 'polls',
        description: 'Campus community polls and voting analytics',
        rowCount: getDb().polls.length,
        columns: [
          { name: 'id', type: 'VARCHAR(64)', isPrimaryKey: true, nullable: false, description: 'Unique poll ID' },
          { name: 'question', type: 'TEXT', isPrimaryKey: false, nullable: false, description: 'Poll survey prompt' },
          { name: 'university', type: 'VARCHAR(32)', isPrimaryKey: false, nullable: false, description: 'Target university' },
          { name: 'total_votes', type: 'INT', isPrimaryKey: false, nullable: false, description: 'Sum of all options votes' },
          { name: 'closing_date', type: 'DATE', isPrimaryKey: false, nullable: false, description: 'Poll expiration date' },
        ],
      },
    ],
  });
});

// DEV LAB: Interactive SQL Query Engine
app.post('/api/dev/sql', (req: Request, res: Response) => {
  const startTime = Date.now();
  const rawSql = String(req.body?.sql || '').trim();

  if (!rawSql) {
    return res.status(400).json({
      success: false,
      error: 'Empty SQL query. Try: SELECT * FROM posts LIMIT 10;',
      executionTimeMs: 0,
    });
  }

  const db = getDb();
  const sql = rawSql.replace(/;+$/, '').trim();
  const normalized = sql.toLowerCase();

  try {
    // SELECT query parser
    if (normalized.startsWith('select')) {
      let targetTable = '';
      if (normalized.includes('from users')) targetTable = 'users';
      else if (normalized.includes('from posts')) targetTable = 'posts';
      else if (normalized.includes('from polls')) targetTable = 'polls';
      else if (normalized.includes('from comments')) targetTable = 'comments';
      else {
        return res.status(400).json({
          success: false,
          error: `Table not found. Available tables in ZedWhisper schema: 'users', 'posts', 'polls'.`,
          executionTimeMs: Date.now() - startTime,
        });
      }

      let data: any[] = [];
      if (targetTable === 'users') {
        data = db.users.map((u) => ({
          id: u.id,
          email: u.email,
          real_name: u.realName,
          alias: u.alias,
          university: u.university,
          program: u.program,
          year: u.year,
          created_at: u.createdAt,
        }));
      } else if (targetTable === 'posts') {
        data = db.posts.map((p) => ({
          id: p.id,
          title: p.title,
          university: p.university,
          category: p.category,
          author_alias: p.authorAlias,
          upvotes: p.upvotes,
          downvotes: p.downvotes,
          comments_count: p.commentsCount,
          timestamp: p.timestamp,
        }));
      } else if (targetTable === 'polls') {
        data = db.polls.map((pl) => ({
          id: pl.id,
          question: pl.question,
          university: pl.university,
          total_votes: pl.totalVotes,
          closing_date: pl.closingDate,
          options_count: pl.options?.length || 0,
        }));
      }

      // Simple WHERE filter: e.g. university = 'unza'
      const whereMatch = normalized.match(/where\s+([a-z_]+)\s*(=|!=|>|<|like)\s*['"]?([a-z0-9_ -%]+)['"]?/);
      if (whereMatch) {
        const [, col, op, val] = whereMatch;
        const cleanVal = val.replace(/['"%]/g, '').trim();
        data = data.filter((row) => {
          const rowVal = String(row[col] ?? '').toLowerCase();
          if (op === '=') return rowVal === cleanVal;
          if (op === '!=') return rowVal !== cleanVal;
          if (op === '>') return Number(row[col]) > Number(cleanVal);
          if (op === '<') return Number(row[col]) < Number(cleanVal);
          if (op === 'like') return rowVal.includes(cleanVal);
          return true;
        });
      }

      // Simple ORDER BY: e.g. ORDER BY upvotes DESC
      const orderMatch = normalized.match(/order\s+by\s+([a-z_]+)(\s+(asc|desc))?/);
      if (orderMatch) {
        const col = orderMatch[1];
        const isDesc = orderMatch[3] === 'desc';
        data.sort((a, b) => {
          const aVal = a[col];
          const bVal = b[col];
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return isDesc ? bVal - aVal : aVal - bVal;
          }
          return isDesc
            ? String(bVal).localeCompare(String(aVal))
            : String(aVal).localeCompare(String(bVal));
        });
      }

      // Simple LIMIT: e.g. LIMIT 5
      const limitMatch = normalized.match(/limit\s+([0-9]+)/);
      if (limitMatch) {
        const limit = parseInt(limitMatch[1], 10);
        data = data.slice(0, limit);
      }

      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      return res.json({
        success: true,
        query: sql,
        columns,
        rows: data,
        rowCount: data.length,
        executionTimeMs: Date.now() - startTime,
      });
    }

    // SHOW TABLES
    if (normalized.startsWith('show tables') || normalized.startsWith('\\dt')) {
      return res.json({
        success: true,
        query: sql,
        columns: ['table_name', 'engine', 'records'],
        rows: [
          { table_name: 'users', engine: 'InnoDB / PostgreSQL', records: db.users.length },
          { table_name: 'posts', engine: 'InnoDB / PostgreSQL', records: db.posts.length },
          { table_name: 'polls', engine: 'InnoDB / PostgreSQL', records: db.polls.length },
        ],
        rowCount: 3,
        executionTimeMs: Date.now() - startTime,
      });
    }

    return res.status(400).json({
      success: false,
      error: `Unsupported query type in sandbox. Supported: SELECT ... FROM [users|posts|polls] [WHERE ...] [ORDER BY ...] [LIMIT ...], or SHOW TABLES.`,
      executionTimeMs: Date.now() - startTime,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'SQL execution failed.',
      executionTimeMs: Date.now() - startTime,
    });
  }
});

// DEV LAB: API Endpoint Catalog
app.get('/api/dev/endpoints', (req: Request, res: Response) => {
  res.json({
    title: 'ZedWhisper University Live Express REST API Catalog',
    baseUrl: `http://localhost:${PORT}`,
    endpoints: [
      {
        path: '/api/health',
        method: 'GET',
        description: 'Server health check, platform status, total record counts',
      },
      {
        path: '/api/posts',
        method: 'GET',
        description: 'List posts with optional filters (?university=unza&category=exams&sortBy=trending)',
      },
      {
        path: '/api/posts',
        method: 'POST',
        description: 'Publish a new campus post or discussion thread',
      },
      {
        path: '/api/posts/:id/vote',
        method: 'POST',
        description: 'Upvote or downvote an existing post',
      },
      {
        path: '/api/polls',
        method: 'GET',
        description: 'Get active university survey polls',
      },
      {
        path: '/api/dev/sql',
        method: 'POST',
        description: 'Execute SQL queries against student database tables',
      },
      {
        path: '/api/dev/schema',
        method: 'GET',
        description: 'Get relational database schema definitions',
      },
    ],
  });
});

// Vite middleware for development or static build for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[ZedWhisper] Vite middleware attached in development mode.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[ZedWhisper] Serving static production build from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [ZedWhisper Full-Stack] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
