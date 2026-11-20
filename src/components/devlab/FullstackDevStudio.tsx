import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Database,
  Globe,
  Layers,
  Sparkles,
  BookOpen,
  FolderGit2,
  PlayCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Cpu,
  GraduationCap,
} from 'lucide-react';
import {
  DEV_TRACKS,
  DEV_LESSONS,
  DEV_STARTER_PROJECTS,
} from '../../data/devlabData';
import type { DevLesson, DevProjectTemplate } from '../../types/devlab';
import { CodePlayground } from './CodePlayground';
import { ApiExplorer } from './ApiExplorer';
import { SqlStudio } from './SqlStudio';

export const FullstackDevStudio: React.FC = () => {
  const [activeStudioTab, setActiveStudioTab] = useState<
    'curriculum' | 'playground' | 'api' | 'sql' | 'projects'
  >('curriculum');
  const [selectedLesson, setSelectedLesson] = useState<DevLesson | null>(DEV_LESSONS[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  const handleOpenLessonInPlayground = (lesson: DevLesson) => {
    setSelectedLesson(lesson);
    setActiveStudioTab('playground');
  };

  const handleOpenProjectInPlayground = (proj: DevProjectTemplate) => {
    const syntheticLesson: DevLesson = {
      id: proj.id,
      title: proj.title,
      description: proj.description,
      duration: 'Interactive Project',
      module: proj.difficulty,
      starterCode: {
        html: proj.code.html,
        css: proj.code.css,
        js: proj.code.js,
      },
      challengeObjective: 'Inspect and customize this project in the live editor.',
      solutionHint: 'Edit styles, HTML markup, and JavaScript logic then view the preview.',
      category: 'javascript',
    };
    setSelectedLesson(syntheticLesson);
    setActiveStudioTab('playground');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              freeCodeCamp & Scrimba 48-Hour Curriculum Reverse-Engineered
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Fullstack Dev Studio & Lab
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Master the full-stack engineering curriculum from the 48-hour masterclass. Write real-time HTML/CSS/JavaScript in an in-app sandbox, execute live Express REST API calls, inspect database schemas, and run interactive SQL queries against ZedWhisper's live server.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://youtu.be/LzMnsfqjzkA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Watch 48h Tutorial
            </a>
            <button
              onClick={() => setActiveStudioTab('playground')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition active:scale-95"
            >
              <Terminal className="w-3.5 h-3.5" />
              Launch Code Sandbox
            </button>
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveStudioTab('curriculum')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeStudioTab === 'curriculum'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Curriculum Tracks ({DEV_TRACKS.length})
          </button>
          <button
            onClick={() => setActiveStudioTab('playground')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeStudioTab === 'playground'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code className="w-4 h-4" />
            Live Code Playground
          </button>
          <button
            onClick={() => setActiveStudioTab('api')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeStudioTab === 'api'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            Express REST API Explorer
          </button>
          <button
            onClick={() => setActiveStudioTab('sql')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeStudioTab === 'sql'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4" />
            Relational SQL Studio
          </button>
          <button
            onClick={() => setActiveStudioTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeStudioTab === 'projects'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Starter Project Gallery ({DEV_STARTER_PROJECTS.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Curriculum Tracks & Lessons */}
      {activeStudioTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEV_TRACKS.map((track) => {
              const trackCategoryMap: Record<string, string> = {
                'track-html-css': 'html_css',
                'track-javascript': 'javascript',
                'track-react': 'react',
                'track-backend': 'nodejs',
                'track-sql': 'sql',
                'track-fullstack': 'deployment',
              };
              const targetCategory = trackCategoryMap[track.id];
              const trackLessons = DEV_LESSONS.filter(
                (l) => l.category === targetCategory
              );

              return (
                <div
                  key={track.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {track.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                        {track.hours}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {track.description}
                      </p>
                    </div>

                    {/* Lesson Count & Badges */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400">
                        Interactive Exercises:
                      </span>
                      <div className="space-y-1">
                        {trackLessons.length > 0 ? (
                          trackLessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleOpenLessonInPlayground(lesson)}
                              className="w-full text-left p-2 rounded-lg bg-slate-950/80 hover:bg-amber-500/10 border border-slate-800/70 hover:border-amber-500/30 text-xs text-slate-300 flex items-center justify-between transition group/btn"
                            >
                              <span className="truncate pr-2 font-medium">
                                › {lesson.title}
                              </span>
                              <span className="text-[10px] text-amber-400 opacity-0 group-hover/btn:opacity-100 flex items-center gap-1">
                                Code <ArrowRight className="w-3 h-3" />
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-500 italic p-1">
                            Exercises included in Starter Projects
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span>{track.lessonsCount} lessons</span>
                    <button
                      onClick={() => {
                        const first = trackLessons[0] || DEV_LESSONS[0];
                        if (first) handleOpenLessonInPlayground(first);
                        else setActiveStudioTab('playground');
                      }}
                      className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      Start Track <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Live Code Playground */}
      {activeStudioTab === 'playground' && (
        <div className="space-y-4">
          {selectedLesson && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Active Exercise
                </span>
                <h3 className="text-sm font-bold text-white">{selectedLesson.title}</h3>
                <p className="text-xs text-slate-400">{selectedLesson.description}</p>
              </div>

              {selectedLesson.challengeObjective && (
                <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 max-w-md">
                  <span className="font-semibold text-amber-300">Goal:</span>{' '}
                  {selectedLesson.challengeObjective}
                </div>
              )}
            </div>
          )}

          <CodePlayground initialLesson={selectedLesson} />
        </div>
      )}

      {/* Tab 3: Live Express REST API Explorer */}
      {activeStudioTab === 'api' && <ApiExplorer />}

      {/* Tab 4: Relational SQL Studio */}
      {activeStudioTab === 'sql' && <SqlStudio />}

      {/* Tab 5: Starter Project Gallery */}
      {activeStudioTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEV_STARTER_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {proj.difficulty}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">
                    Fullstack Project
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tech.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Reverse-engineered code</span>
                <button
                  onClick={() => handleOpenProjectInPlayground(proj)}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  Open in Sandbox
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
