import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  Maximize2,
  Minimize2,
  Columns,
  Rows,
  Sparkles,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import type { DevLesson } from '../../types/devlab';

interface CodePlaygroundProps {
  initialLesson?: DevLesson | null;
  onLessonComplete?: (lessonId: string) => void;
}

interface ConsoleMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialLesson,
  onLessonComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState(
    initialLesson?.starterCode?.html || '<h1>Welcome to Dev Lab!</h1>\n<p>Start coding below.</p>'
  );
  const [cssCode, setCssCode] = useState(
    initialLesson?.starterCode?.css || 'body {\n  font-family: sans-serif;\n  padding: 20px;\n  color: #1e293b;\n}'
  );
  const [jsCode, setJsCode] = useState(
    initialLesson?.starterCode?.js || '// JavaScript goes here\nconsole.log("Dev Lab Playground ready!");'
  );
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
  const [showConsole, setShowConsole] = useState(true);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [copied, setCopied] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [runKey, setRunKey] = useState(0);

  // Update editor state when initialLesson changes
  useEffect(() => {
    if (initialLesson && initialLesson.starterCode) {
      setHtmlCode(initialLesson.starterCode.html || '');
      setCssCode(initialLesson.starterCode.css || '');
      setJsCode(initialLesson.starterCode.js || '');
      setConsoleLogs([]);
      setRunKey((k) => k + 1);
    }
  }, [initialLesson]);

  // Construct iframe srcDoc with console interception script
  const srcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            ${cssCode}
          </style>
          <script>
            (function() {
              const origLog = console.log;
              const origError = console.error;
              const origWarn = console.warn;
              const origInfo = console.info;

              function sendLog(type, args) {
                try {
                  const text = Array.from(args).map(a => {
                    if (typeof a === 'object') return JSON.stringify(a);
                    return String(a);
                  }).join(' ');
                  window.parent.postMessage({ type: 'CONSOLE_LOG', level: type, text }, '*');
                } catch (e) {}
              }

              console.log = function(...args) { sendLog('log', args); origLog.apply(console, args); };
              console.error = function(...args) { sendLog('error', args); origError.apply(console, args); };
              console.warn = function(...args) { sendLog('warn', args); origWarn.apply(console, args); };
              console.info = function(...args) { sendLog('info', args); origInfo.apply(console, args); };

              window.onerror = function(msg, url, line) {
                sendLog('error', [msg + ' (line ' + line + ')']);
              };
            })();
          </script>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch(e) {
              console.error(e.message);
            }
          </script>
        </body>
      </html>
    `;
  }, [htmlCode, cssCode, jsCode, runKey]);

  // Listen for iframe console logs
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        const newMsg: ConsoleMessage = {
          id: `${Date.now()}-${Math.random()}`,
          type: event.data.level,
          message: event.data.text,
          timestamp: new Date().toLocaleTimeString(),
        };
        setConsoleLogs((prev) => [...prev.slice(-49), newMsg]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleReset = () => {
    if (initialLesson && initialLesson.starterCode) {
      setHtmlCode(initialLesson.starterCode.html || '');
      setCssCode(initialLesson.starterCode.css || '');
      setJsCode(initialLesson.starterCode.js || '');
    } else {
      setHtmlCode('<h1>Hello World</h1>');
      setCssCode('body { font-family: sans-serif; padding: 20px; }');
      setJsCode('console.log("Reset done");');
    }
    setConsoleLogs([]);
    setRunKey((k) => k + 1);
  };

  const handleCopy = () => {
    const activeContent =
      activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode;
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${initialLesson?.title.replace(/\\s+/g, '_').toLowerCase() || 'devlab_project'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[780px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {initialLesson ? initialLesson.title : 'Live Scratchpad Sandbox'}
          </span>
          {initialLesson && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {initialLesson.module || initialLesson.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Layout switch */}
          <button
            onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}
            title="Toggle Split Layout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {layout === 'horizontal' ? <Columns className="w-4 h-4" /> : <Rows className="w-4 h-4" />}
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            title="Copy current tab code"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download file */}
          <button
            onClick={handleDownload}
            title="Download standalone HTML package"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            title="Reset code to original"
            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 rounded-lg flex items-center gap-1 border border-slate-700 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>

          {/* Run button */}
          <button
            onClick={() => setRunKey((k) => k + 1)}
            className="px-3 py-1 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Preview
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Panel */}
      <div className={`flex flex-1 overflow-hidden ${layout === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
        {/* Left Side: Code Editor with Tabs */}
        <div className={`flex flex-col bg-slate-900/90 border-r border-slate-800 ${layout === 'horizontal' ? 'w-1/2' : 'h-1/2 border-b'}`}>
          {/* Language Tabs */}
          <div className="flex items-center justify-between bg-slate-950/60 px-2 pt-2 border-b border-slate-800/80">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition flex items-center gap-1.5 ${
                  activeTab === 'html'
                    ? 'bg-slate-900 text-orange-400 border-t-2 border-orange-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-[10px] font-bold px-1 rounded bg-orange-500/20 text-orange-400">&lt;/&gt;</span>
                index.html
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition flex items-center gap-1.5 ${
                  activeTab === 'css'
                    ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-[10px] font-bold px-1 rounded bg-sky-500/20 text-sky-400">#</span>
                styles.css
              </button>
              <button
                onClick={() => setActiveTab('js')}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition flex items-center gap-1.5 ${
                  activeTab === 'js'
                    ? 'bg-slate-900 text-yellow-400 border-t-2 border-yellow-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-[10px] font-bold px-1 rounded bg-yellow-500/20 text-yellow-400">JS</span>
                app.js
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-mono pr-2">
              {activeTab.toUpperCase()} • Live Sandbox
            </span>
          </div>

          {/* Textarea Code Editor */}
          <div className="relative flex-1 p-2 font-mono text-xs overflow-hidden">
            <textarea
              value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
              onChange={(e) => {
                const val = e.target.value;
                if (activeTab === 'html') setHtmlCode(val);
                else if (activeTab === 'css') setCssCode(val);
                else setJsCode(val);
              }}
              spellCheck={false}
              className="w-full h-full p-3 font-mono text-xs bg-slate-950/70 text-slate-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50 border border-slate-800/80 leading-relaxed tracking-wide selection:bg-amber-500/30 selection:text-white"
              placeholder={`Write your ${activeTab.toUpperCase()} here...`}
            />
          </div>
        </div>

        {/* Right Side: Live Iframe Preview & Console */}
        <div className={`flex flex-col bg-slate-950 ${layout === 'horizontal' ? 'w-1/2' : 'h-1/2'}`}>
          {/* Preview Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Browser Viewport</span>
            </div>
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition ${
                showConsole
                  ? 'bg-slate-800 text-amber-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Terminal className="w-3 h-3" />
              Console ({consoleLogs.length})
            </button>
          </div>

          {/* IFrame Viewport */}
          <div className="flex-1 bg-white relative overflow-hidden">
            <iframe
              key={runKey}
              srcDoc={srcDoc}
              title="DevLab Output Sandbox"
              sandbox="allow-scripts"
              className="w-full h-full border-none"
            />
          </div>

          {/* Collapsible Console Log Panel */}
          {showConsole && (
            <div className="h-44 bg-slate-950 border-t border-slate-800 flex flex-col font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-slate-400" />
                  DevTools Console
                </span>
                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-[10px] text-slate-400 hover:text-white hover:underline"
                >
                  Clear Console
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {consoleLogs.length === 0 ? (
                  <p className="text-slate-600 text-[11px] italic px-1">
                    No console messages yet. Use console.log() in app.js to print output.
                  </p>
                ) : (
                  consoleLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`text-[11px] px-2 py-0.5 rounded flex items-start justify-between ${
                        log.type === 'error'
                          ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                          : log.type === 'warn'
                          ? 'bg-amber-950/40 text-amber-300 border-l-2 border-amber-500'
                          : 'text-emerald-300'
                      }`}
                    >
                      <span className="break-all font-mono">
                        {log.type === 'error' ? '✖ ' : '› '}
                        {log.message}
                      </span>
                      <span className="text-[9px] text-slate-600 ml-2 whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
