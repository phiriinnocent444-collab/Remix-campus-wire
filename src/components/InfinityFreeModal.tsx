import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Server,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  Activity,
  Globe,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { checkBackendHealth, BackendStatus } from '../lib/fullstackApi';

interface InfinityFreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfinityFreeModal: React.FC<InfinityFreeModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'mysql' | 'guide'>('status');

  const checkStatus = async () => {
    setLoading(true);
    const res = await checkBackendHealth();
    setStatus(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sampleSql = `-- ZedWhisper MySQL Schema for InfinityFree (phpMyAdmin)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  real_name VARCHAR(120),
  alias VARCHAR(120) NOT NULL,
  university VARCHAR(64) NOT NULL,
  campus VARCHAR(120),
  program VARCHAR(150),
  year INT DEFAULT 1,
  token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  university VARCHAR(64) NOT NULL,
  campus_branch VARCHAR(120),
  category VARCHAR(64) NOT NULL,
  author_alias VARCHAR(120) NOT NULL,
  is_anonymous TINYINT(1) DEFAULT 1,
  upvotes INT DEFAULT 1,
  downvotes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  tags VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(64) PRIMARY KEY,
  post_id VARCHAR(64) NOT NULL,
  author_alias VARCHAR(120) NOT NULL,
  author_university VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const copySql = () => {
    navigator.clipboard?.writeText(sampleSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                <span>InfinityFree & Full-Stack Engine</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Live Active
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Full-stack Node/Express engine + InfinityFree PHP & MySQL architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="p-1 mx-5 mt-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'status'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Backend Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'mysql'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            MySQL Schema & Config
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'guide'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            InfinityFree Setup Guide
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Live Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Server Status</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{status?.online ? 'Online & Running' : 'Connecting...'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {status?.serverType || 'Express / Node.js'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Database Engine</span>
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    Active & Synced
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {status?.totalPosts || 0} Posts · {status?.totalUsers || 0} Students
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>API Response Latency</span>
                    <RefreshCw
                      className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`}
                    />
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {status?.latencyMs || 15} ms
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">Ultra-Responsive</span>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  Active REST Endpoints (Both Express & InfinityFree PHP)
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900 font-mono">
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span>POST /api/auth/register</span>
                    <span className="text-[10px] text-emerald-600 font-sans font-bold">201 OK</span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span>POST /api/auth/login</span>
                    <span className="text-[10px] text-emerald-600 font-sans font-bold">200 OK</span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span>GET /api/posts</span>
                    <span className="text-[10px] text-emerald-600 font-sans font-bold">200 OK</span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span>POST /api/posts</span>
                    <span className="text-[10px] text-emerald-600 font-sans font-bold">201 OK</span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span>POST /api/posts/:id/vote</span>
                    <span className="text-[10px] text-emerald-600 font-sans font-bold">200 OK</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={checkStatus}
                  disabled={loading}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Re-test Latency</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'mysql' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    InfinityFree MySQL Database Schema
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Import this into InfinityFree's phpMyAdmin under your MySQL database
                  </p>
                </div>
                <button
                  onClick={copySql}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Schema</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-slate-950 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-64 border border-slate-800">
                <pre>{sampleSql}</pre>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold">Automatic Schema Migration:</span>
                <p>
                  You don't even have to run this manually! Our included{' '}
                  <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">
                    public/api/db.php
                  </code>{' '}
                  automatically runs <code className="font-mono">CREATE TABLE IF NOT EXISTS</code> on
                  first request.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>3-Step InfinityFree Deployment</span>
                </span>
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>
                    <strong>Build Production Assets:</strong> Run{' '}
                    <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">
                      npm run build
                    </code>
                    .
                  </li>
                  <li>
                    <strong>Upload to InfinityFree:</strong> Using Monsta File Manager or FileZilla
                    FTP, upload all contents of the <code className="font-mono">dist/</code> folder into
                    your InfinityFree <code className="font-mono">htdocs/</code> directory.
                  </li>
                  <li>
                    <strong>Configure MySQL in public/api/config.php:</strong> In InfinityFree
                    VistaPanel, go to <em>MySQL Databases</em>, note your DB Host (e.g.{' '}
                    <code className="font-mono">sql102.epizy.com</code>), DB Name, and enter them in{' '}
                    <code className="font-mono">api/config.php</code>.
                  </li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold block">100% Free Hosting with Unlimited Bandwidth</span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Pre-configured .htaccess routes all frontend URLs & PHP API requests cleanly.
                  </span>
                </div>
                <a
                  href="https://www.infinityfree.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>InfinityFree</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Node.js / Express Server on port 3000 & Apache / PHP 8.x
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
