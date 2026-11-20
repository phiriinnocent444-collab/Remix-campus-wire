import React, { useState, useEffect } from 'react';
import {
  Database,
  Play,
  RotateCcw,
  Table,
  Check,
  Copy,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { SqlQueryResult, DatabaseSchemaTable } from '../../types/devlab';

const SQL_PRESETS = [
  {
    label: 'All Campus Posts',
    sql: 'SELECT * FROM posts ORDER BY upvotes DESC LIMIT 10;',
  },
  {
    label: 'UNZA Students Only',
    sql: "SELECT * FROM users WHERE university = 'unza';",
  },
  {
    label: 'Active Student Polls',
    sql: 'SELECT id, question, university, total_votes FROM polls;',
  },
  {
    label: 'Inspect Available Tables',
    sql: 'SHOW TABLES;',
  },
];

export const SqlStudio: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM posts ORDER BY upvotes DESC LIMIT 10;');
  const [result, setResult] = useState<SqlQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [schemaTables, setSchemaTables] = useState<DatabaseSchemaTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('posts');
  const [copied, setCopied] = useState(false);

  // Load database schema on mount
  useEffect(() => {
    fetch('/api/dev/schema')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tables) {
          setSchemaTables(data.tables);
        }
      })
      .catch((err) => console.error('Error loading schema:', err));

    // Run initial query
    handleExecuteQuery('SELECT * FROM posts ORDER BY upvotes DESC LIMIT 10;');
  }, []);

  const handleExecuteQuery = async (queryToRun?: string) => {
    const q = (queryToRun || sqlQuery).trim();
    if (!q) return;

    setLoading(true);
    try {
      const res = await fetch('/api/dev/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: q }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        query: q,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: err.message || 'Execution error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!result || !result.rows || result.rows.length === 0) return;
    const headers = result.columns.join(',');
    const rows = result.rows
      .map((row) =>
        result.columns
          .map((col: string) => `"${String(row[col] ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_result_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.rows, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTableSchema = schemaTables.find((t) => t.name === selectedTable);

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* Schema Navigation Sidebar */}
      <div className="w-full lg:w-72 flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Schema Explorer
            </h3>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            Relational SQL
          </span>
        </div>

        {/* Table Selector */}
        <div className="space-y-1.5">
          {schemaTables.map((tbl) => (
            <button
              key={tbl.name}
              onClick={() => {
                setSelectedTable(tbl.name);
                const q = `SELECT * FROM ${tbl.name} LIMIT 10;`;
                setSqlQuery(q);
                handleExecuteQuery(q);
              }}
              className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between border ${
                selectedTable === tbl.name
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Table className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-mono font-semibold">{tbl.name}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                {tbl.rowCount} rows
              </span>
            </button>
          ))}
        </div>

        {/* Columns Details for selected table */}
        {currentTableSchema && (
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>{currentTableSchema.name} Columns</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {currentTableSchema.columns.map((col) => (
                <div key={col.name} className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300 truncate">{col.name}</span>
                  <span className="text-slate-500 text-[10px]">{col.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preset Queries */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" /> Quick SQL Snippets
          </span>
          <div className="space-y-1">
            {SQL_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSqlQuery(preset.sql);
                  handleExecuteQuery(preset.sql);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 rounded-lg transition truncate font-mono"
              >
                › {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main SQL Editor & Table Results */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* SQL Input Area */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              SQL Query Console
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSqlQuery('SELECT * FROM posts LIMIT 10;')}
                className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
              <button
                onClick={() => handleExecuteQuery()}
                disabled={loading}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                Run SQL
              </button>
            </div>
          </div>

          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            spellCheck={false}
            rows={3}
            className="w-full p-3 font-mono text-xs bg-slate-950 text-amber-200 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50 leading-relaxed"
            placeholder="Type your SQL query here (e.g. SELECT * FROM users;)"
          />
        </div>

        {/* Query Results / Grid */}
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[360px]">
          {/* Results Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-200">Execution Results</span>
              {result && result.success && (
                <span className="text-slate-400 font-mono text-[11px]">
                  {result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'} returned
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {result && (
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {result.executionTimeMs}ms
                </span>
              )}
              {result && result.success && result.rowCount > 0 && (
                <>
                  <button
                    onClick={handleExportCsv}
                    title="Export as CSV"
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-[11px]"
                  >
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button
                    onClick={handleCopy}
                    title="Copy as JSON"
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} JSON
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Results Table */}
          <div className="flex-1 overflow-auto max-h-[420px]">
            {loading ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-mono">
                Running SQL query...
              </div>
            ) : result && !result.success ? (
              <div className="p-4 bg-red-950/20 border-l-4 border-red-500 text-red-300 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">SQL Execution Error</div>
                  <div className="mt-1">{result.error}</div>
                </div>
              </div>
            ) : result && result.rows && result.rows.length > 0 ? (
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-slate-900 sticky top-0 text-slate-300 border-b border-slate-800">
                  <tr>
                    {result.columns.map((col) => (
                      <th key={col} className="p-2.5 font-semibold tracking-wider text-[11px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-900/40 transition">
                      {result.columns.map((col) => (
                        <td key={col} className="p-2.5 text-slate-300 text-[11px] truncate max-w-xs">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-600 gap-2">
                <Database className="w-8 h-8 opacity-40" />
                <p className="text-xs">No records found or query returned 0 rows.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
