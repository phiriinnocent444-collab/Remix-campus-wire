import { DevLesson, DevTrack, ApiEndpointSpec, DevProjectTemplate } from '../types/devlab';

export const DEV_TRACKS: DevTrack[] = [
  {
    id: 'track-html-css',
    title: 'HTML5 & CSS3 Web Foundations',
    hours: '10 Hours',
    badge: 'Front-End Basics',
    level: 'Beginner',
    description: 'Learn semantic HTML markup, CSS Box Model, Flexbox, Grid, and responsive styling as taught in the freeCodeCamp & Scrimba 48h masterclass.',
    lessonsCount: 12,
    iconName: 'Layout',
  },
  {
    id: 'track-javascript',
    title: 'Modern JavaScript & DOM Logic',
    hours: '12 Hours',
    badge: 'Core Programming',
    level: 'Beginner to Intermediate',
    description: 'Master variables, data types, functions, array methods (.map, .filter), event listeners, and localStorage persistence.',
    lessonsCount: 15,
    iconName: 'Code',
  },
  {
    id: 'track-react',
    title: 'React Components & State Management',
    hours: '10 Hours',
    badge: 'UI Framework',
    level: 'Intermediate',
    description: 'Build modular component hierarchies, handle form state with useState, manage lifecycle side-effects with useEffect, and create custom hooks.',
    lessonsCount: 14,
    iconName: 'Atom',
  },
  {
    id: 'track-backend',
    title: 'Node.js & Express REST APIs',
    hours: '8 Hours',
    badge: 'Server Architecture',
    level: 'Intermediate',
    description: 'Construct server-side RESTful endpoints, request middleware, parameter handling, status codes (200, 201, 400, 404), and JSON data formatting.',
    lessonsCount: 10,
    iconName: 'Server',
  },
  {
    id: 'track-sql',
    title: 'Relational SQL & Database Design',
    hours: '6 Hours',
    badge: 'Database Layer',
    level: 'Intermediate',
    description: 'Design relational schemas, primary/foreign keys, write SELECT, INSERT, UPDATE queries, and perform multi-table JOINs.',
    lessonsCount: 8,
    iconName: 'Database',
  },
  {
    id: 'track-fullstack',
    title: 'Full-Stack Integration & Cloud Deployment',
    hours: '4 Hours',
    badge: 'Production Ready',
    level: 'Advanced',
    description: 'Wire client React with Express API, implement JWT/Bearer token authentication, configure Docker, Cloud Run, Supabase, and InfinityFree LAMP hosting.',
    lessonsCount: 6,
    iconName: 'Globe',
  },
];

export const DEV_LESSONS: DevLesson[] = [
  {
    id: 'lesson-1',
    title: 'Build a Student Digital Profile Card',
    duration: '25 mins',
    module: 'HTML5 & CSS3 Foundations',
    category: 'html_css',
    description: 'Reverse-engineered from Chapter 3 of the tutorial (02:21:01). Build a responsive student card with avatar, social tags, and campus contact actions using CSS Flexbox.',
    challengeObjective: 'Style the card container with a dark background (#1e1e2f), center the content, and create a rounded contact button with a smooth hover effect.',
    solutionHint: 'Use display: flex; flex-direction: column; align-items: center; and border-radius: 16px; on the .profile-card container.',
    starterCode: {
      html: `<div class="profile-card">
  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" alt="Avatar" class="avatar" />
  <h2>Innocent Phiri</h2>
  <p class="role">Computer Science · UNZA</p>
  <div class="tags">
    <span class="tag">React</span>
    <span class="tag">Node.js</span>
    <span class="tag">TypeScript</span>
  </div>
  <button class="btn" onclick="sayHello()">Connect on ZedWhisper</button>
</div>`,
      css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0b0f19;
  font-family: system-ui, -apple-system, sans-serif;
  color: #f1f5f9;
}
.profile-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 32px 24px;
  width: 280px;
  text-align: center;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
  transition: transform 0.2s ease;
}
.profile-card:hover {
  transform: translateY(-4px);
  border-color: #ff9900;
}
.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff9900;
  margin-bottom: 12px;
}
h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
}
.role {
  margin: 0 0 16px 0;
  color: #94a3b8;
  font-size: 13px;
}
.tags {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 20px;
}
.tag {
  background: #0f172a;
  color: #ff9900;
  border: 1px solid #334155;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}
.btn {
  background: #ff9900;
  color: #0b0f19;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}
.btn:hover {
  background: #ffaa22;
}`,
      js: `function sayHello() {
  alert('Connecting with Innocent on ZedWhisper Campus Network!');
  console.log('Student connection initiated.');
}`,
    },
  },
  {
    id: 'lesson-2',
    title: 'Interactive Study Time & Nshima Counter',
    duration: '30 mins',
    module: 'Modern JavaScript & DOM Logic',
    category: 'javascript',
    description: 'Reverse-engineered from Scrimba Passenger Counter Project. Learn DOM selection (document.getElementById), innerText mutation, and state tracking.',
    challengeObjective: 'Increment the count on button click, display previous study lap counts with save(), and reset the tally.',
    solutionHint: 'Use let count = 0; inside increment(), update countEl.innerText = count, and concatenate previous entries in save().',
    starterCode: {
      html: `<div class="counter-app">
  <h1>UNZA Exam Study Counter</h1>
  <div id="count-el" class="number">0</div>
  <div class="btn-group">
    <button id="increment-btn" onclick="increment()">+1 Study Hour</button>
    <button id="save-btn" onclick="save()">Save Lap</button>
  </div>
  <p id="save-el">Logged Sessions: </p>
</div>`,
      css: `body {
  background: #080d1a;
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
.counter-app {
  background: #111c35;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  width: 320px;
  border: 1px solid #1e294b;
}
h1 { font-size: 18px; color: #cbd5e1; margin-bottom: 20px; }
.number { font-size: 56px; font-weight: 800; color: #ff9900; margin: 15px 0; }
.btn-group { display: flex; gap: 10px; margin-bottom: 20px; }
button {
  flex: 1;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
#increment-btn { background: #ff9900; color: black; }
#save-btn { background: #10b981; color: white; }
#save-el { color: #94a3b8; font-size: 13px; min-height: 20px; }`,
      js: `let count = 0;
const countEl = document.getElementById("count-el");
const saveEl = document.getElementById("save-el");

function increment() {
  count += 1;
  countEl.innerText = count;
  console.log("Current study hours:", count);
}

function save() {
  const countStr = count + " hrs - ";
  saveEl.innerText += countStr;
  count = 0;
  countEl.innerText = 0;
  console.log("Logged session saved to student log.");
}`,
    },
  },
  {
    id: 'lesson-3',
    title: 'Student Chrome Extension & Lead Tracker',
    duration: '40 mins',
    module: 'Modern JavaScript & LocalStorage',
    category: 'javascript',
    description: 'Reverse-engineered from Scrimba Extension Tracker. Master JSON.parse, JSON.stringify, localStorage.setItem, and template literals.',
    challengeObjective: 'Render saved student whisper links as an un-ordered list, persist them in localStorage across page reloads, and clear on dblclick.',
    solutionHint: 'Store array with localStorage.setItem("myLeads", JSON.stringify(myLeads)) and parse on load.',
    starterCode: {
      html: `<div class="tracker-box">
  <h2>ZedWhisper Campus Lead Tracker</h2>
  <input type="text" id="input-el" placeholder="Paste campus whisper URL..." />
  <div class="actions">
    <button id="input-btn" onclick="addLead()">SAVE INPUT</button>
    <button id="delete-btn" onclick="clearLeads()">CLEAR ALL</button>
  </div>
  <ul id="ul-el"></ul>
</div>`,
      css: `body { background: #000; color: #fff; font-family: system-ui; padding: 20px; }
.tracker-box { max-width: 360px; margin: 40px auto; background: #141414; padding: 24px; border-radius: 12px; border: 1px solid #333; }
h2 { font-size: 16px; color: #ff9900; margin-top: 0; }
input { width: 100%; box-sizing: border-box; padding: 10px; border-radius: 6px; border: 1px solid #444; background: #222; color: #fff; margin-bottom: 10px; }
.actions { display: flex; gap: 8px; margin-bottom: 16px; }
button { flex: 1; padding: 10px; font-weight: bold; border-radius: 6px; border: none; cursor: pointer; }
#input-btn { background: #ff9900; color: #000; }
#delete-btn { background: transparent; color: #ff5555; border: 1px solid #ff5555; }
ul { list-style: none; padding: 0; margin: 0; }
li { padding: 8px 0; border-bottom: 1px solid #222; font-size: 13px; }
a { color: #38bdf8; text-decoration: none; word-break: break-all; }`,
      js: `let myLeads = ["https://unza.zm/exam-schedule", "https://cbu.ac.zm/results"];
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");

function renderLeads() {
  let listItems = "";
  for (let i = 0; i < myLeads.length; i++) {
    listItems += "<li><a target='_blank' href='" + myLeads[i] + "'>" + myLeads[i] + "</a></li>";
  }
  ulEl.innerHTML = listItems;
}

function addLead() {
  if (inputEl.value.trim()) {
    myLeads.push(inputEl.value.trim());
    inputEl.value = "";
    renderLeads();
    console.log("Lead added:", myLeads);
  }
}

function clearLeads() {
  myLeads = [];
  renderLeads();
}

renderLeads();`,
    },
  },
  {
    id: 'lesson-4',
    title: 'Varsity Blackjack Card Game Engine',
    duration: '45 mins',
    module: 'JavaScript Logic & Arrays',
    category: 'javascript',
    description: 'Reverse-engineered from Scrimba Blackjack Game. Practice array operations, random number generation (Math.random), boolean flags (hasBlackJack, isAlive).',
    challengeObjective: 'Draw new cards until sum reaches 21. Win on 21 (Blackjack), bust if sum > 21.',
    solutionHint: 'Use Math.floor(Math.random() * 11) + 1 for drawing random cards and check conditionals.',
    starterCode: {
      html: `<div class="game-container">
  <h1>Varsity 21 (Blackjack)</h1>
  <p id="message-el">Want to play a round?</p>
  <p id="cards-el">Cards: -</p>
  <p id="sum-el">Sum: -</p>
  <div class="btns">
    <button onclick="startGame()">START GAME</button>
    <button onclick="newCard()">NEW CARD</button>
  </div>
</div>`,
      css: `body { background: #064e3b; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
.game-container { text-align: center; background: #022c22; padding: 32px; border-radius: 16px; border: 2px solid #059669; width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
h1 { color: #34d399; font-size: 22px; margin-top: 0; }
p { font-size: 15px; margin: 12px 0; }
#message-el { font-style: italic; color: #a7f3d0; min-height: 24px; }
.btns { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
button { background: #ff9900; color: #000; font-weight: 800; border: none; padding: 12px; border-radius: 8px; cursor: pointer; }`,
      js: `let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";

function getRandomCard() {
  let val = Math.floor(Math.random() * 13) + 1;
  if (val > 10) return 10;
  if (val === 1) return 11;
  return val;
}

function startGame() {
  isAlive = true;
  hasBlackJack = false;
  let first = getRandomCard();
  let second = getRandomCard();
  cards = [first, second];
  sum = first + second;
  renderGame();
}

function renderGame() {
  document.getElementById("cards-el").textContent = "Cards: " + cards.join(" ");
  document.getElementById("sum-el").textContent = "Sum: " + sum;
  
  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    message = "🎉 You've got Blackjack! You win!";
    hasBlackJack = true;
  } else {
    message = "💥 You're out of the game (Bust)!";
    isAlive = false;
  }
  document.getElementById("message-el").textContent = message;
}

function newCard() {
  if (isAlive && !hasBlackJack) {
    let card = getRandomCard();
    sum += card;
    cards.push(card);
    renderGame();
  }
}`,
    },
  },
  {
    id: 'lesson-5',
    title: 'Live REST API Client with Async / Await',
    duration: '35 mins',
    module: 'Node.js & Express REST APIs',
    category: 'nodejs',
    description: 'Fetch live server endpoints (/api/posts) directly from our Express backend using window.fetch, async/await, and error handling.',
    challengeObjective: 'Call fetch("/api/posts"), parse the JSON, and map the campus whispers into structured cards.',
    solutionHint: 'Use const res = await fetch("/api/posts"); const data = await res.json();',
    starterCode: {
      html: `<div class="api-client">
  <h2>Live Express REST API Tester</h2>
  <div class="controls">
    <button onclick="fetchCampusPosts()">Fetch /api/posts</button>
    <button onclick="fetchHealth()">Fetch /api/health</button>
  </div>
  <div id="status-badge" class="badge">Status: Ready</div>
  <pre id="output-box">// Click a button above to execute a real HTTP request against our server</pre>
</div>`,
      css: `body { background: #000; color: #fff; font-family: monospace; padding: 20px; }
.api-client { max-width: 500px; margin: 20px auto; background: #111; padding: 20px; border-radius: 12px; border: 1px solid #333; }
h2 { color: #ff9900; margin-top: 0; font-size: 16px; }
.controls { display: flex; gap: 10px; margin-bottom: 12px; }
button { background: #2563eb; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-family: monospace; font-weight: bold; }
.badge { font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #222; display: inline-block; margin-bottom: 12px; color: #10b981; }
pre { background: #050505; padding: 14px; border-radius: 8px; border: 1px solid #222; overflow-x: auto; max-height: 250px; font-size: 11px; color: #38bdf8; }`,
      js: `async function fetchCampusPosts() {
  document.getElementById("status-badge").innerText = "Status: Fetching /api/posts...";
  try {
    const res = await fetch("/api/posts?limit=3");
    const json = await res.json();
    document.getElementById("status-badge").innerText = "Status: 200 OK (" + json.count + " posts)";
    document.getElementById("output-box").innerText = JSON.stringify(json, null, 2);
  } catch (err) {
    document.getElementById("status-badge").innerText = "Status: Error";
    document.getElementById("output-box").innerText = err.message;
  }
}

async function fetchHealth() {
  document.getElementById("status-badge").innerText = "Status: Fetching /api/health...";
  try {
    const res = await fetch("/api/health");
    const json = await res.json();
    document.getElementById("status-badge").innerText = "Status: 200 OK (Server Online)";
    document.getElementById("output-box").innerText = JSON.stringify(json, null, 2);
  } catch (err) {
    document.getElementById("output-box").innerText = err.message;
  }
}`,
    },
  },
  {
    id: 'lesson-6',
    title: 'Relational Database SQL Query Studio',
    duration: '35 mins',
    module: 'Relational SQL & Database Design',
    category: 'sql',
    description: 'Learn SQL table querying and relational JOINs against users, posts, and comments schemas.',
    challengeObjective: 'Execute SELECT queries to filter posts by university, sort by upvotes, and inspect related student comments.',
    solutionHint: 'SELECT title, upvotes, university FROM posts WHERE upvotes > 10 ORDER BY upvotes DESC;',
    starterCode: {
      html: `<div class="sql-box">
  <h3>Interactive SQL Query Simulator</h3>
  <textarea id="sql-input">SELECT id, title, university, upvotes FROM posts WHERE upvotes >= 10 ORDER BY upvotes DESC;</textarea>
  <button onclick="runQuery()">EXECUTE SQL</button>
  <div id="table-output"></div>
</div>`,
      css: `body { background: #0a0a0a; color: white; font-family: system-ui; padding: 20px; }
.sql-box { max-width: 600px; margin: 20px auto; background: #161616; padding: 20px; border-radius: 12px; border: 1px solid #333; }
h3 { color: #ff9900; margin-top: 0; }
textarea { width: 100%; box-sizing: border-box; height: 70px; background: #000; color: #a5f3fc; border: 1px solid #444; border-radius: 6px; padding: 10px; font-family: monospace; font-size: 13px; margin-bottom: 10px; }
button { background: #ff9900; color: black; font-weight: bold; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
th, td { border: 1px solid #333; padding: 8px; text-align: left; }
th { background: #222; color: #ff9900; }`,
      js: `async function runQuery() {
  const query = document.getElementById("sql-input").value;
  try {
    const res = await fetch("/api/dev/sql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: query })
    });
    const result = await res.json();
    if (result.rows && result.rows.length > 0) {
      const cols = Object.keys(result.rows[0]);
      let html = "<table><tr>" + cols.map(c => "<th>" + c + "</th>").join("") + "</tr>";
      result.rows.forEach(r => {
        html += "<tr>" + cols.map(c => "<td>" + (r[c] !== undefined ? r[c] : "") + "</td>").join("") + "</tr>";
      });
      html += "</table>";
      document.getElementById("table-output").innerHTML = html;
    } else {
      document.getElementById("table-output").innerText = "Query executed. 0 rows returned.";
    }
  } catch (err) {
    document.getElementById("table-output").innerText = "Execution error: " + err.message;
  }
}`,
    },
  },
];

export const DEV_STARTER_PROJECTS: DevProjectTemplate[] = [
  {
    id: 'proj-card',
    title: 'Digital Student Portfolio Card',
    difficulty: 'Beginner',
    tech: ['HTML5', 'CSS3', 'Flexbox'],
    description: 'A clean, modern student bio card with hover micro-interactions, badge chips, and direct whisper trigger.',
    code: DEV_LESSONS[0].starterCode,
  },
  {
    id: 'proj-counter',
    title: 'Campus Study Time Counter',
    difficulty: 'Beginner',
    tech: ['JavaScript', 'DOM Events', 'State'],
    description: 'Interactive counter with session logging, state resets, and UI updates.',
    code: DEV_LESSONS[1].starterCode,
  },
  {
    id: 'proj-tracker',
    title: 'Student Whisper Bookmark Tracker',
    difficulty: 'Intermediate',
    tech: ['JavaScript', 'LocalStorage', 'JSON'],
    description: 'Browser bookmark and link manager that persists student notes and links.',
    code: DEV_LESSONS[2].starterCode,
  },
  {
    id: 'proj-blackjack',
    title: 'Varsity 21 Blackjack Engine',
    difficulty: 'Intermediate',
    tech: ['JavaScript', 'Game Logic', 'Math API'],
    description: 'Classic 21 card game with random card generation, ace logic, and win/bust conditions.',
    code: DEV_LESSONS[3].starterCode,
  },
  {
    id: 'proj-rest-api',
    title: 'Live Express REST Client',
    difficulty: 'Intermediate',
    tech: ['Node.js', 'Express', 'Async/Await'],
    description: 'Live HTTP client that interacts with real running backend API endpoints.',
    code: DEV_LESSONS[4].starterCode,
  },
  {
    id: 'proj-sql-studio',
    title: 'PostgreSQL Relational Studio',
    difficulty: 'Advanced',
    tech: ['SQL', 'Relational Schemas', 'JOINs'],
    description: 'Relational query runner with tabular results and schema inspection.',
    code: DEV_LESSONS[5].starterCode,
  },
];

export const API_SPECS: ApiEndpointSpec[] = [
  {
    method: 'GET',
    path: '/api/health',
    category: 'System Diagnostics',
    summary: 'Server Health & Diagnostics',
    description: 'Returns server runtime status, active port, total database records, and hosting readiness.',
    responseSample: {
      status: 'online',
      server: 'Express.js (Node / TSX)',
      port: 3000,
      fullStack: true,
      totalPosts: 4,
      totalUsers: 1,
      timestamp: '2026-11-11T21:05:00.000Z',
      infinityFreeReady: true,
    },
  },
  {
    method: 'GET',
    path: '/api/posts',
    category: 'Campus Whispers',
    summary: 'List Posts & Whispers',
    description: 'Fetches list of student posts with optional query filters (university, category, search, sortBy).',
    params: [
      { name: 'university', type: 'string', required: false, description: 'Filter by university code (e.g. unza, cbu, mulungushi, all)', default: 'all' },
      { name: 'category', type: 'string', required: false, description: 'Filter by category (news, sports, exams, hostel, gossip)' },
      { name: 'search', type: 'string', required: false, description: 'Keyword search across titles, contents, and author aliases' },
      { name: 'sortBy', type: 'string', required: false, description: 'Sorting order: trending, latest, discussed', default: 'trending' },
    ],
    responseSample: {
      count: 2,
      posts: [
        {
          id: 'post-live-1',
          title: 'UNZA Main Library Exam Night Study Guidelines',
          university: 'unza',
          upvotes: 42,
          downvotes: 1,
          commentsCount: 3,
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/api/posts',
    category: 'Campus Whispers',
    summary: 'Create New Campus Whisper',
    description: 'Publishes a new anonymous or identified whisper to the university feed.',
    headers: { 'Content-Type': 'application/json' },
    bodyTemplate: {
      title: 'Study group for CS310 Database Systems',
      content: 'Meeting at UNZA CS Lab 2 on Thursday at 16:00. Everyone welcome!',
      university: 'unza',
      category: 'exams',
      authorAlias: 'DatabaseMonk',
      isAnonymous: false,
      tags: ['UNZA', 'StudyGroup', 'Databases'],
    },
    responseSample: {
      message: 'Post created successfully on full-stack backend.',
      post: {
        id: 'post-1731359000-123',
        title: 'Study group for CS310 Database Systems',
        upvotes: 1,
        downvotes: 0,
      },
    },
  },
  {
    method: 'POST',
    path: '/api/posts/:id/vote',
    category: 'Campus Whispers',
    summary: 'Vote on Whisper',
    description: 'Upvotes or downvotes a whisper.',
    headers: { 'Content-Type': 'application/json' },
    params: [{ name: 'id', type: 'string', required: true, description: 'Target post ID' }],
    bodyTemplate: { direction: 'up' },
    responseSample: { success: true, upvotes: 43, downvotes: 1 },
  },
  {
    method: 'POST',
    path: '/api/posts/:id/comments',
    category: 'Campus Whispers',
    summary: 'Add Comment to Whisper',
    description: 'Posts a comment to a specific whisper thread.',
    headers: { 'Content-Type': 'application/json' },
    params: [{ name: 'id', type: 'string', required: true, description: 'Target post ID' }],
    bodyTemplate: {
      content: 'I will be there with past exam papers!',
      authorAlias: 'Algorist_ZM',
      authorUniversity: 'unza',
    },
    responseSample: {
      success: true,
      comment: {
        id: 'c-1731359100',
        content: 'I will be there with past exam papers!',
        upvotes: 0,
      },
    },
  },
  {
    method: 'GET',
    path: '/api/polls',
    category: 'Campus Polls',
    summary: 'Get Active Campus Polls',
    description: 'Retrieves all voting polls and option tallies.',
    responseSample: {
      polls: [
        {
          id: 'poll-server-1',
          question: 'Which university library has the fastest WiFi for exam prep?',
          totalVotes: 413,
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    category: 'Student Authentication',
    summary: 'Register Student Account',
    description: 'Creates a verified student profile with secure session token.',
    headers: { 'Content-Type': 'application/json' },
    bodyTemplate: {
      email: 'student@unza.zm',
      password: 'mypassword123',
      university: 'unza',
      realName: 'Mwamba Chileshe',
      alias: 'Mwamba_Dev',
      program: 'BSc Computer Science',
      year: 2,
    },
    responseSample: {
      message: 'Student account registered successfully.',
      token: 'tok_1731359300_xyz789',
      user: { id: 'user-1731359300', email: 'student@unza.zm', alias: 'Mwamba_Dev' },
    },
  },
  {
    method: 'POST',
    path: '/api/dev/sql',
    category: 'Dev Studio & SQL',
    summary: 'Simulated SQL Query Runner',
    description: 'Executes SQL statements (SELECT, INSERT, UPDATE, DESCRIBE) against the fullstack database schema.',
    headers: { 'Content-Type': 'application/json' },
    bodyTemplate: { sql: 'SELECT id, title, university, upvotes FROM posts LIMIT 5;' },
    responseSample: {
      success: true,
      query: 'SELECT id, title, university, upvotes FROM posts LIMIT 5;',
      columns: ['id', 'title', 'university', 'upvotes'],
      rows: [
        { id: 'post-live-1', title: 'UNZA Main Library Exam Night', university: 'unza', upvotes: 42 },
      ],
      rowCount: 1,
      executionTimeMs: 4,
    },
  },
];
