import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Moon, Sun, Wind, Volume2, VolumeX, Eye } from 'lucide-react';

export type EnvironmentalMode = 'mist' | 'golden' | 'lanterns';

interface LiveEnvironmentalBackgroundProps {
  mode?: EnvironmentalMode;
  onChangeMode?: (mode: EnvironmentalMode) => void;
}

export const LiveEnvironmentalBackground: React.FC<LiveEnvironmentalBackgroundProps> = ({
  mode: propMode,
  onChangeMode,
}) => {
  const [internalMode, setInternalMode] = useState<EnvironmentalMode>(() => {
    return (localStorage.getItem('zedwhisper_env_mode') as EnvironmentalMode) || 'mist';
  });
  const currentMode = propMode || internalMode;

  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  const setMode = (newMode: EnvironmentalMode) => {
    setInternalMode(newMode);
    localStorage.setItem('zedwhisper_env_mode', newMode);
    if (onChangeMode) onChangeMode(newMode);
  };

  // Web Audio nature synthesizer (Zero external MP3 dependencies)
  const toggleAudio = () => {
    if (isAudioActive) {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
      setIsAudioActive(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Soft filtered pink/brown noise for night breeze
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.02; // very quiet
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      setIsAudioActive(true);
    } catch {
      setIsAudioActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle pool
    const PARTICLE_COUNT = Math.min(45, Math.floor(width / 35));
    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      baseAlpha: number;
      pulseSpeed: number;
      hue: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -Math.random() * 0.5 - 0.15, // gently floating upwards
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        hue: Math.random() * 20,
      });
    }

    let tick = 0;

    const render = () => {
      if (!isPaused) {
        ctx.clearRect(0, 0, width, height);
        tick += 0.015;

        // Render ambient gradient overlays according to current environmental mode
        const isDark = document.documentElement.classList.contains('dark');

        if (currentMode === 'mist') {
          // Lush Zambezi Mist: Emerald & deep teal bioluminescence
          const grad = ctx.createRadialGradient(
            width * 0.15,
            height * 0.2,
            50,
            width * 0.25,
            height * 0.35,
            width * 0.65
          );
          grad.addColorStop(0, isDark ? 'rgba(5, 150, 105, 0.12)' : 'rgba(16, 185, 129, 0.08)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          // Secondary lower right mist pocket
          const grad2 = ctx.createRadialGradient(
            width * 0.85,
            height * 0.8,
            80,
            width * 0.8,
            height * 0.75,
            width * 0.5
          );
          grad2.addColorStop(0, isDark ? 'rgba(13, 148, 136, 0.09)' : 'rgba(20, 184, 166, 0.05)');
          grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad2;
          ctx.fillRect(0, 0, width, height);
        } else if (currentMode === 'golden') {
          // Luangwa Golden Twilight: Warm copper, amber sun rays
          const grad = ctx.createRadialGradient(
            width * 0.5,
            height * 0.05,
            40,
            width * 0.5,
            height * 0.25,
            width * 0.7
          );
          grad.addColorStop(0, isDark ? 'rgba(217, 119, 6, 0.14)' : 'rgba(245, 158, 11, 0.09)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        } else {
          // Midnight Lanterns: Indigo starlight, warm lantern glow
          const grad = ctx.createRadialGradient(
            width * 0.7,
            height * 0.15,
            50,
            width * 0.65,
            height * 0.3,
            width * 0.6
          );
          grad.addColorStop(0, isDark ? 'rgba(99, 102, 241, 0.13)' : 'rgba(79, 70, 229, 0.06)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }

        // Draw and update particles
        particles.forEach((p) => {
          p.x += p.vx + Math.sin(tick + p.hue) * 0.25;
          p.y += p.vy;

          // Wrap boundaries
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;

          // Mouse deflection
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }

          // Gentle pulse
          const alphaPulse = p.baseAlpha + Math.sin(tick * 2 + p.x) * 0.2;
          const currentAlpha = Math.max(0.05, Math.min(0.85, alphaPulse));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

          if (currentMode === 'mist') {
            ctx.fillStyle = `rgba(52, 211, 153, ${currentAlpha})`;
            ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
            ctx.shadowBlur = 8;
          } else if (currentMode === 'golden') {
            ctx.fillStyle = `rgba(251, 191, 36, ${currentAlpha})`;
            ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
            ctx.shadowBlur = 9;
          } else {
            ctx.fillStyle = `rgba(167, 139, 250, ${currentAlpha})`;
            ctx.shadowColor = 'rgba(129, 140, 248, 0.6)';
            ctx.shadowBlur = 8;
          }

          ctx.fill();
          ctx.shadowBlur = 0; // reset
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentMode, isPaused]);

  return (
    <>
      {/* Living Atmospheric Canvas (Fixed underneath content, non-blocking pointer events) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-1000"
      />

      {/* Floating Ambient Atmosphere Dock (Bottom right, clean anti-slop design) */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-md text-xs">
        {/* Toggle Controls Drawer */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer"
          title="Campus Environmental Ambience"
          aria-label="Environmental controls"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="font-medium text-[11px] hidden sm:inline">
            {currentMode === 'mist'
              ? 'Lush Mist'
              : currentMode === 'golden'
              ? 'Sunset Glow'
              : 'Lanterns'}
          </span>
        </button>

        {showControls && (
          <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-slate-700 animate-in fade-in duration-150">
            <button
              onClick={() => setMode('mist')}
              className={`p-1 rounded-md transition-colors ${
                currentMode === 'mist'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Lush Zambezi Campus Mist"
            >
              <Wind className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('golden')}
              className={`p-1 rounded-md transition-colors ${
                currentMode === 'golden'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Luangwa Twilight Sun"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('lanterns')}
              className={`p-1 rounded-md transition-colors ${
                currentMode === 'lanterns'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Midnight Campus Lanterns"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleAudio}
              className={`p-1 rounded-md transition-colors ${
                isAudioActive
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title={isAudioActive ? 'Mute Campus Breeze Audio' : 'Play Gentle Ambient Campus Breeze'}
            >
              {isAudioActive ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
              title={isPaused ? 'Resume Animation' : 'Pause Background'}
            >
              <Eye className={`w-3.5 h-3.5 ${isPaused ? 'opacity-40' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
