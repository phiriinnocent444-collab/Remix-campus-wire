import React, { useState } from 'react';
import {
  Send,
  Check,
  Copy,
  Clock,
  Database,
  ArrowRight,
  Code,
  Globe,
  RefreshCw,
  HelpCircle,
  FileCode,
} from 'lucide-react';
import { API_SPECS } from '../../data/devlabData';
import type { ApiEndpointSpec } from '../../types/devlab';

export const ApiExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointSpec>(API_SPECS[0]);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [bodyContent, setBodyContent] = useState<string>(
    selectedEndpoint.bodyTemplate
      ? JSON.stringify(selectedEndpoint.bodyTemplate, null, 2)
      : ''
  );
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseDuration, setResponseDuration] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'response' | 'curl' | 'docs'>('response');

  const handleSelectEndpoint = (ep: ApiEndpointSpec) => {
    setSelectedEndpoint(ep);
    setQueryParams({});
    setBodyContent(ep.bodyTemplate ? JSON.stringify(ep.bodyTemplate, null, 2) : '');
    setResponseStatus(null);
    setResponseDuration(null);
    setResponseData(null);
  };

  const executeRequest = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    const start = performance.now();

    try {
      // Build URL with query params
      let url = selectedEndpoint.path;

      // Handle path parameters (like :id)
      if (url.includes(':id')) {
        url = url.replace(':id', 'post-live-1');
      }

      const queryString = new URLSearchParams(queryParams).toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (selectedEndpoint.method !== 'GET' && bodyContent.trim()) {
        options.body = bodyContent;
      }

      const res = await fetch(url, options);
      const end = performance.now();
      setResponseDuration(Math.round(end - start));
      setResponseStatus(res.status);

      const json = await res.json().catch(() => ({ message: 'Non-JSON response' }));
      setResponseData(json);
    } catch (err: any) {
      const end = performance.now();
      setResponseDuration(Math.round(end - start));
      setResponseStatus(500);
      setResponseData({ error: err.message || 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  const getCurlCommand = () => {
    let cmd = `curl -X ${selectedEndpoint.method} "http://localhost:3000${selectedEndpoint.path}"`;
    if (selectedEndpoint.method !== 'GET' && bodyContent.trim()) {
      cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${bodyContent.replace(/'/g, "'\\''")}'`;
    }
    return cmd;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* Sidebar: Endpoint Catalog */}
      <div className="w-full lg:w-72 flex flex-col space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Express Routes
            </h3>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            {API_SPECS.length} endpoints
          </span>
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-[620px] pr-1">
          {API_SPECS.map((ep) => {
            const isSelected =
              selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
            const epKey = `${ep.method}-${ep.path}`;
            return (
              <button
                key={epKey}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between group border ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      ep.method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : ep.method === 'POST'
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-mono truncate">{ep.path}</div>
                    <div className="text-[10px] text-slate-500 truncate">{ep.summary}</div>
                  </div>
                </div>
                <ArrowRight
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${
                    isSelected ? 'translate-x-0.5 text-amber-400' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-auto p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" /> Live Backend Server
          </p>
          Target: <code className="text-amber-300 font-mono">http://localhost:3000</code>. All requests are handled in real-time by <code className="text-slate-300 font-mono">server.ts</code>.
        </div>
      </div>

      {/* Main Request / Response Studio */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Request Header Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                selectedEndpoint.method === 'GET'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-sky-500/20 text-sky-400'
              }`}
            >
              {selectedEndpoint.method}
            </span>
            <input
              type="text"
              readOnly
              value={selectedEndpoint.path}
              className="bg-transparent font-mono text-xs text-white flex-1 focus:outline-none select-all"
            />
          </div>

          <button
            onClick={executeRequest}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Send Request
          </button>
        </div>

        {/* Endpoint Documentation & Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Description & Query Params */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              {selectedEndpoint.summary}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedEndpoint.description}
            </p>

            {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-300">Query Parameters</span>
                <div className="space-y-1.5">
                  {selectedEndpoint.params.map((param: { name: string; type: string; required: boolean; description: string; default?: string }) => (
                    <div key={param.name} className="flex items-center gap-2 text-xs">
                      <span className="w-24 font-mono text-amber-300 text-[11px] truncate">
                        {param.name}:
                      </span>
                      <input
                        type="text"
                        placeholder={param.default || param.description}
                        value={queryParams[param.name] || ''}
                        onChange={(e) =>
                          setQueryParams({ ...queryParams, [param.name]: e.target.value })
                        }
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Request Body Editor (if POST/PUT) */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-sky-400" />
                Request Payload (JSON)
              </span>
              {selectedEndpoint.method === 'GET' && (
                <span className="text-[10px] text-slate-500 italic">GET requests do not have a body</span>
              )}
            </div>

            <textarea
              disabled={selectedEndpoint.method === 'GET'}
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              placeholder="Enter JSON request body..."
              spellCheck={false}
              className={`flex-1 min-h-[120px] p-2.5 font-mono text-xs bg-slate-900 rounded-lg border border-slate-800 text-slate-200 resize-none focus:outline-none focus:border-sky-500 ${
                selectedEndpoint.method === 'GET' ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Response Section */}
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          {/* Response Tab Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('response')}
                className={`font-semibold transition ${
                  activeView === 'response' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Response Body
              </button>
              <button
                onClick={() => setActiveView('curl')}
                className={`font-semibold transition ${
                  activeView === 'curl' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                cURL Command
              </button>
            </div>

            {/* Status & Latency Pills */}
            <div className="flex items-center gap-3">
              {responseStatus !== null && (
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  Status: {responseStatus}
                </span>
              )}
              {responseDuration !== null && (
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {responseDuration}ms
                </span>
              )}
              <button
                onClick={() =>
                  handleCopy(
                    activeView === 'curl'
                      ? getCurlCommand()
                      : JSON.stringify(responseData, null, 2)
                  )
                }
                title="Copy contents"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Response Content */}
          <div className="flex-1 p-4 font-mono text-xs overflow-auto max-h-[300px]">
            {activeView === 'curl' ? (
              <pre className="text-sky-300 whitespace-pre-wrap select-all">
                {getCurlCommand()}
              </pre>
            ) : responseData ? (
              <pre className="text-emerald-400 whitespace-pre-wrap select-all">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-600 gap-2">
                <FileCode className="w-8 h-8 opacity-40" />
                <p>Click "Send Request" to test this endpoint against the live Express server.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
