import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Radio, 
  Terminal as TerminalIcon, 
  ExternalLink, 
  Compass,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Flame,
  GitCommit
} from 'lucide-react';
import Starfield from './Starfield';
import ScrollRibbon from './ScrollRibbon';
import Experience3D from './Experience3D';

gsap.registerPlugin(ScrollTrigger);

const CURRENT_YEAR = new Date().getFullYear();

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════
   AEROSPACE BLUEPRINT CORNER REGISTRATION MARKS (Handmade Precision)
   ══════════════════════════════════════════════════════════════════════ */
const BlueprintBrackets = ({ className = "" }: { className?: string }) => (
  <>
    <span className={`absolute top-2 left-2 text-[9px] font-mono text-white/20 select-none pointer-events-none ${className}`}>┌</span>
    <span className={`absolute top-2 right-2 text-[9px] font-mono text-white/20 select-none pointer-events-none ${className}`}>┐</span>
    <span className={`absolute bottom-2 left-2 text-[9px] font-mono text-white/20 select-none pointer-events-none ${className}`}>└</span>
    <span className={`absolute bottom-2 right-2 text-[9px] font-mono text-white/20 select-none pointer-events-none ${className}`}>┘</span>
  </>
);

/* ══════════════════════════════════════════════════════════════════════
   VERTICAL HIGH-ALTITUDE TELEMETRY TAPE (Fixed Left Margin)
   ══════════════════════════════════════════════════════════════════════ */
const AltitudeTape = ({ totalProgress }: { totalProgress: number }) => {
  const currentAlt = Math.round(totalProgress * 98420);

  const milestones = [
    { label: '100K // ARMSTRONG', pct: 96 },
    { label: '85K // CAP APOGEE', pct: 82 },
    { label: '60K // STRATO-CORE', pct: 58 },
    { label: '35K // FL350 TROPO', pct: 36 },
    { label: '10K // VFR CEILING', pct: 14 },
    { label: '0K // UCONN STORRS', pct: 2 },
  ];

  return (
    <aside 
      aria-label="High-altitude telemetry elevation tape"
      className="fixed left-3 top-28 bottom-16 w-8 hidden 2xl:flex flex-col justify-between items-center z-30 pointer-events-none select-none font-mono text-[8px] text-slate-500"
    >
      {/* Millimeter Center Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />
      
      {/* Precision Millimeter Ticks */}
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-between py-2">
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className={`h-[1px] self-center transition-colors ${
              i % 6 === 0 ? 'w-4 bg-white/35' : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Dynamic Altitude Reticle Pointer */}
      <div
        className="absolute left-5 -translate-y-1/2 flex items-center gap-1.5 transition-transform duration-75 ease-out whitespace-nowrap"
        style={{ top: `${(1 - totalProgress) * 88 + 6}%` }}
      >
        <span className="w-2 h-[1px] bg-[#00f2fe]" />
        <span className="px-1.5 py-0.5 rounded-[2px] bg-[#070709]/90 border border-[#00f2fe]/40 text-[#00f2fe] font-bold text-[8px] tracking-wider shadow-[0_0_12px_rgba(0,242,254,0.35)] backdrop-blur-sm">
          {currentAlt.toLocaleString()} FT
        </span>
      </div>

      {/* Milestone Annotations */}
      <div className="w-full h-full relative">
        {milestones.map((m, i) => (
          <div
            key={i}
            className="absolute left-5 -translate-y-1/2 text-slate-500 tracking-widest text-[7px] whitespace-nowrap uppercase"
            style={{ bottom: `${m.pct}%` }}
          >
            {m.label}
          </div>
        ))}
      </div>
    </aside>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   PRECISION ATMOSPHERIC TELEMETRY HUD (Hero Section)
   ══════════════════════════════════════════════════════════════════════ */
const TelemetryHUD = () => {
  const [mem, setMem] = useState('0x4F9A');
  const [pid, setPid] = useState('8042');
  const [altitude, setAltitude] = useState('98,420 FT');
  const [flux, setFlux] = useState('142.8 µSv/h');

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setMem('0x' + Math.floor(Math.random() * 65535).toString(16).toUpperCase());
      }
      if (Math.random() > 0.85) {
        setPid(Math.floor(Math.random() * 9000 + 1000).toString());
      }
      if (Math.random() > 0.8) {
        setAltitude((98000 + Math.floor(Math.random() * 850)).toLocaleString() + ' FT');
      }
      if (Math.random() > 0.75) {
        setFlux((140 + Math.random() * 6.5).toFixed(1) + ' µSv/h');
      }
    }, 140);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-3 font-mono text-[10px] tracking-widest text-slate-400">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f2fe] dot-glow-cyan animate-pulse"></span>
          <span className="text-white font-semibold">STATUS: NOMINAL</span>
          <span className="text-slate-500">//</span>
          <span className="text-slate-300">UCONN FINANCE '30</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-white font-semibold">PAYLOAD: ACTIVE</span>
          <span className="text-slate-500">//</span>
          <span className="text-slate-300">CAP NER-CT-071</span>
        </div>
      </div>

      {/* Real-time Atmospheric Telemetry Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 max-w-xl text-[9px] relative">
        <BlueprintBrackets />
        <div className="p-2.5 bg-[#0e1117]/85 border border-white/5 rounded-sm backdrop-blur-sm">
          <div className="text-slate-500 uppercase">SYS.PID</div>
          <div className="text-[#00f2fe] font-bold mt-0.5">{pid}</div>
        </div>
        <div className="p-2.5 bg-[#0e1117]/85 border border-white/5 rounded-sm backdrop-blur-sm">
          <div className="text-slate-500 uppercase">MEM.BUFFER</div>
          <div className="text-slate-200 font-bold mt-0.5">{mem}</div>
        </div>
        <div className="p-2.5 bg-[#0e1117]/85 border border-white/5 rounded-sm backdrop-blur-sm">
          <div className="text-slate-500 uppercase">RAD.FLUX</div>
          <div className="text-[#10b981] font-bold mt-0.5">{flux}</div>
        </div>
        <div className="p-2.5 bg-[#0e1117]/85 border border-white/5 rounded-sm backdrop-blur-sm">
          <div className="text-slate-500 uppercase">PEAK.ALT</div>
          <div className="text-white font-bold mt-0.5">{altitude}</div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   CLOCK TICKER COMPONENT
   ══════════════════════════════════════════════════════════════════════ */
const ClockTicker = () => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
      <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse dot-glow-cyan"></span>
      <span className="tracking-widest">TICK {time} UTC-4</span>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   INTERACTIVE 364-DAY ACTIVITY HEATMAP (Forensic Commits)
   ══════════════════════════════════════════════════════════════════════ */
const ContributionHeatmap = () => {
  const [activeDay, setActiveDay] = useState<{ day: number; commits: number; hash: string } | null>(null);

  return (
    <div className="w-full overflow-x-auto pb-4 opacity-100 animate-up relative">
      <div className="flex justify-between items-center mb-3 font-mono text-[10px] text-slate-400">
        <span className="flex items-center gap-2">
          <GitCommit className="w-3.5 h-3.5 text-[#00f2fe]" />
          <span>ACTIVITY MATRIX // 364-DAY CYCLE</span>
        </span>
        <span className="text-[#00f2fe] font-mono">
          {activeDay
            ? `CYCLE DAY ${activeDay.day} // ${activeDay.commits} COMMITS VERIFIED // HASH #${activeDay.hash}`
            : 'HOVER MATRIX NODE FOR TELEMETRY'}
        </span>
      </div>
      <div className="inline-grid grid-rows-7 grid-flow-col gap-1 w-max p-4 bg-[#0e1117]/85 border border-white/10 rounded-sm backdrop-blur-sm relative">
        <BlueprintBrackets />
        {Array.from({ length: 364 }).map((_, i) => {
          const val = (Math.sin(i * 0.37) * 0.4 + Math.sin(i * 1.83) * 0.3 + Math.cos(i * 0.08) * 0.3 + 1) / 2;
          let bg = 'rgba(255,255,255,0.05)';
          let shadow = 'none';
          let commits = 0;
          if (val > 0.85) { 
            bg = '#00f2fe'; 
            shadow = '0 0 10px rgba(0, 242, 254, 0.6)'; 
            commits = Math.floor(val * 8) + 4;
          } else if (val > 0.65) { 
            bg = '#10b981'; 
            shadow = '0 0 10px rgba(16, 185, 129, 0.6)'; 
            commits = Math.floor(val * 5) + 2;
          } else if (val > 0.45) { 
            bg = 'rgba(0, 242, 254, 0.4)'; 
            commits = 2;
          } else if (val > 0.25) { 
            bg = 'rgba(16, 185, 129, 0.25)'; 
            commits = 1;
          }

          const hash = ((i * 2654435761) >>> 0).toString(16).slice(0, 7).padStart(7, '0');

          return (
            <div
              key={i}
              onMouseEnter={() => setActiveDay({ day: i + 1, commits, hash })}
              onMouseLeave={() => setActiveDay(null)}
              className="w-3 h-3 rounded-[2px] transition-all duration-200 hover:scale-150 hover:z-20 relative cursor-pointer"
              style={{ backgroundColor: bg, boxShadow: shadow }}
              title={`Day ${i + 1}: ${commits} commits`}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN PORTFOLIO APPLICATION
   ══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const appContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);

  // Smooth Scrolling with Lenis synchronized to multi-stage 3D kinematics
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 1.5;
      const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const total = Math.min(Math.max(scrollY / docHeight, 0), 1);
      setScrollProgress(progress);
      setTotalProgress(total);
    };

    lenis.on('scroll', onScroll);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Hardware Cursor for Fine Pointers
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
    };

    const onMouseEnter = () => gsap.to(cursor, { scale: 1.5, borderColor: '#00f2fe', duration: 0.2 });
    const onMouseLeave = () => gsap.to(cursor, { scale: 1.0, borderColor: 'rgba(0, 242, 254, 0.4)', duration: 0.2 });

    window.addEventListener('mousemove', onMouseMove);

    const interactables = document.querySelectorAll('a, button, .group, .interactive');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  // GSAP ScrollTrigger Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>('.animate-up');
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, appContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={appContainerRef}
      className="relative min-h-screen selection:bg-[#00f2fe] selection:text-black pb-28 overflow-x-hidden bg-[#070709] text-[#e2e8f0]"
    >
      {/* 2D Background Cosmic Particle Canvas & Fluid Curved Parallax Ribbon */}
      <Starfield />
      <ScrollRibbon />

      {/* Vertical Altitude Calibration Tape */}
      <AltitudeTape totalProgress={totalProgress} />

      {/* Custom Hardware Cursor */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#00f2fe] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 dot-glow-cyan hidden md:block"
      />
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-[#00f2fe]/40 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-60 hidden md:block"
      />

      {/* Top Fixed Engineering Navigation */}
      <nav className="fixed top-0 left-0 w-full px-6 md:px-16 py-4 flex justify-between items-center z-40 font-mono text-[10px] tracking-[0.2em] border-b border-white/5 backdrop-blur-md bg-[#070709]/80">
        <a href="#hero" className="flex items-center gap-2 text-white font-bold tracking-wider group text-xs">
          <TerminalIcon className="w-3.5 h-3.5 text-[#00f2fe]" />
          <span>ROHAN KOSUR</span>
          <span className="text-[#00f2fe] font-mono text-[9px] px-1.5 py-0.5 rounded border border-[#00f2fe]/30 bg-[#00f2fe]/10 hidden sm:inline">
            ATMOSPHERIC TERMINAL
          </span>
        </a>

        <div className="hidden md:flex gap-8 text-slate-400">
          <a href="#about" className="hover:text-[#00f2fe] transition-colors">
            01/ABOUT
          </a>
          <a href="#subsystems" className="hover:text-[#00f2fe] transition-colors">
            02/SUBSYSTEMS
          </a>
          <a href="#proof-of-work" className="hover:text-[#00f2fe] transition-colors">
            03/PROOF OF WORK
          </a>
          <a href="#toolkit" className="hover:text-[#00f2fe] transition-colors">
            04/TOOLKIT
          </a>
          <a href="#work" className="hover:text-[#00f2fe] transition-colors">
            05/REPOS
          </a>
          <a href="#off-screen" className="hover:text-[#00f2fe] transition-colors">
            06/OFF-SCREEN
          </a>
        </div>

        <ClockTicker />
      </nav>

      {/* Marquee Ticker Tape */}
      <div className="fixed top-[57px] left-0 w-full border-b border-white/5 py-1.5 overflow-hidden flex gap-8 font-mono text-[8px] uppercase tracking-widest text-slate-500 z-30 bg-[#070709]/90 backdrop-blur-sm whitespace-nowrap pointer-events-none">
        <div className="animate-[marquee_25s_linear_infinite] flex gap-10">
          <span><span className="text-[#00f2fe]">●</span> QUANTITATIVE FINANCE</span>
          <span><span className="text-[#10b981]">●</span> AGENTIC SYSTEMS</span>
          <span><span className="text-[#00f2fe]">●</span> UCONN SCHOOL OF BUSINESS '30</span>
          <span><span className="text-[#10b981]">●</span> 180 MATH LLC</span>
          <span><span className="text-[#00f2fe]">●</span> HIGH-FREQUENCY LOGIC</span>
          <span><span className="text-[#10b981]">●</span> HIGH-ALTITUDE TELEMETRY</span>
          <span><span className="text-[#00f2fe]">●</span> QUANTITATIVE FINANCE</span>
          <span><span className="text-[#10b981]">●</span> AGENTIC SYSTEMS</span>
          <span><span className="text-[#00f2fe]">●</span> UCONN SCHOOL OF BUSINESS '30</span>
          <span><span className="text-[#10b981]">●</span> 180 MATH LLC</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          FIXED 3D HERO CANVAS (Atmospheric Terminal with Exploded Mechanics)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="fixed right-[-15%] md:right-[-2%] top-1/2 -translate-y-1/2 w-[90vw] md:w-[60vw] h-[90vh] pointer-events-auto z-10 cursor-crosshair">
        <Experience3D scrollProgress={scrollProgress} totalProgress={totalProgress} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          001 / HERO
          ══════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="min-h-screen relative pt-44 pb-20 px-6 md:px-16 flex flex-col justify-center z-20 pointer-events-none"
      >
        <div className="max-w-2xl pointer-events-auto">
          <div className="animate-up">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#00f2fe] tracking-[0.25em] uppercase mb-4">
              <Compass className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>AEROSPACE INSTRUMENTATION // QUANTITATIVE ARCHITECTURE</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase text-white leading-none">
              ROHAN
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-white to-[#10b981] leading-none mb-6">
              KOSUR
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-xl">
              Finance student at the <span className="text-white font-medium">University of Connecticut</span> (Class of 2030) building at the nexus of high-frequency quantitative systems, ed-tech scale, and autonomous AI telemetry.
            </p>

            <TelemetryHUD />

            <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs">
              <a
                href="#subsystems"
                className="px-6 py-3 rounded-sm bg-[#00f2fe] text-black font-bold tracking-wider flex items-center gap-2 hover:bg-[#10b981] transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)]"
              >
                <span>EXPLORE EXPLODED VIEW</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/rohankosur"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-sm border border-white/20 hover:border-[#00f2fe] text-white flex items-center gap-2 transition-all hover:bg-white/5"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GITHUB MATRIX</span>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-6 md:left-16 font-mono text-[9px] tracking-widest text-slate-500 flex items-center gap-3">
          <span className="w-1.5 h-4 border border-slate-600 rounded-full flex justify-center pt-0.5">
            <span className="w-0.5 h-1 bg-[#00f2fe] rounded-full animate-bounce"></span>
          </span>
          <span>SCROLL TO DISENGAGE COMPONENT LOCKS (EXPLODED SCHEMATIC)</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          002 / ABOUT
          ══════════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-32 px-6 md:px-16 border-t border-white/10 relative z-20 bg-[#070709]/95 backdrop-blur-md">
        <div className="flex justify-between items-center mb-16 max-w-4xl">
          <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">002 / ABOUT</span>
          <span className="font-serif italic text-sm text-slate-400">a bit of context</span>
        </div>

        <div className="max-w-3xl space-y-6 animate-up">
          <p className="text-lg text-slate-200 leading-relaxed font-light">
            I'm a Finance major at UConn with a deep pull toward building things that scale. From founding <span className="text-white font-medium">180 Math LLC</span> — serving 300+ students with automated curriculum engines — to leading high-altitude radiation payloads with Civil Air Patrol, I operate at the boundary where quantitative discipline meets hands-on systems engineering.
          </p>
          <p className="text-base text-slate-400 leading-relaxed font-light">
            Whether modeling systematic alpha on tick-level market structures, designing autonomous agent toolchains with MCP, or generating high-fidelity WebGL graphics, the target remains identical: eliminate operational friction, scale genuine value, and build architectures engineered to last.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="border border-white/10 p-6 bg-[#0e1117] rounded-sm relative">
              <BlueprintBrackets />
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight">300+</div>
              <div className="font-mono text-[10px] text-slate-400 tracking-widest mt-2 uppercase">
                STUDENTS REACHED
              </div>
            </div>
            <div className="border border-white/10 p-6 bg-[#0e1117] rounded-sm relative">
              <BlueprintBrackets />
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight">6</div>
              <div className="font-mono text-[10px] text-slate-400 tracking-widest mt-2 uppercase">
                PINNED REPOSITORIES
              </div>
            </div>
            <div className="border border-white/10 p-6 bg-[#0e1117] rounded-sm relative">
              <BlueprintBrackets />
              <div className="text-4xl md:text-5xl font-black text-[#00f2fe] tracking-tight">618</div>
              <div className="font-mono text-[10px] text-slate-400 tracking-widest mt-2 uppercase">
                COMMITS / YEAR
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          003 / SUBSYSTEMS (Exploded 3D Project Bay)
          ══════════════════════════════════════════════════════════════════ */}
      <section
        id="subsystems"
        className="min-h-screen py-32 px-6 md:px-16 border-t border-white/10 relative z-20 pointer-events-none"
      >
        <div className="flex justify-between items-center mb-16 pointer-events-auto max-w-xl">
          <div>
            <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">
              003 / SUBSYSTEMS
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mt-1">
              PROVEN ENGINEERING
            </h2>
          </div>
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hidden sm:inline">
            EXPLODED SPECIFICATION
          </span>
        </div>

        <div className="grid grid-cols-1 gap-12 max-w-xl pointer-events-auto">
          {/* Card 1: 180 Math LLC (Inverted High Contrast) */}
          <div className="p-8 md:p-10 bg-[#f4f4f0] text-[#0a0a0a] border border-white/10 rounded-sm hover:box-glow-cyan transition-all duration-300 relative group overflow-hidden shadow-2xl">
            <BlueprintBrackets className="text-black/30" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f2fe]"></span>
                <span className="font-mono text-[10px] text-slate-800 tracking-widest uppercase font-bold">
                  SUBSYSTEM 01 // ED-TECH ENGINE
                </span>
              </div>
              <span className="font-mono text-xs text-slate-600 font-semibold">2023–PRESENT</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 text-[#0a0a0a]">
              180 MATH LLC
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-6 font-light">
              Founder &amp; Lead Developer. Engineered an educational acceleration platform serving 300+ active students with sub-second parsing, automated assessment engines, interactive problem generation, and payment workflows.
            </p>

            <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase text-black font-semibold mb-6">
              <span className="px-2.5 py-1 bg-black/5 border border-black/15 rounded-sm">Next.js</span>
              <span className="px-2.5 py-1 bg-black/5 border border-black/15 rounded-sm">Supabase</span>
              <span className="px-2.5 py-1 bg-black/5 border border-black/15 rounded-sm">Playwright</span>
              <span className="px-2.5 py-1 bg-black/5 border border-black/15 rounded-sm">Automated Testing</span>
            </div>

            <a
              href="https://180math.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-black hover:text-[#00f2fe] transition-colors"
            >
              <span>ACCESS 180MATH.COM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Quantitative Algorithmic Backtester */}
          <div className="p-8 md:p-10 bg-[#0e1117]/90 border border-white/10 rounded-sm hover:border-[#10b981] transition-all duration-300 relative group overflow-hidden shadow-2xl backdrop-blur-md">
            <BlueprintBrackets />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                <span className="font-mono text-[10px] text-[#10b981] tracking-widest uppercase">
                  SUBSYSTEM 02 // QUANTITATIVE SIGNAL ENGINE
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">FINANCE '30</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-3 group-hover:text-[#10b981] transition-colors">
              ALGORITHMIC BACKTESTER
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              High-frequency quantitative engine modeling VWAP reversion, volatility thresholds, and systematic alpha strategies against historical tick data with sub-millisecond local execution.
            </p>

            <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase text-slate-300 mb-6">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Python</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">OpenBB</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">NumPy / Pandas</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">VWAP Alpha</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Sharpe &amp; Calmar Ratio Optimization // Sub-second Analysis</span>
            </div>
          </div>

          {/* Card 3: CAP Cosmic Radiation Telemetry */}
          <div className="p-8 md:p-10 bg-[#0e1117]/90 border border-white/10 rounded-sm hover:border-[#00f2fe] transition-all duration-300 relative group overflow-hidden shadow-2xl backdrop-blur-md">
            <BlueprintBrackets />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f2fe]"></span>
                <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">
                  SUBSYSTEM 03 // AEROSPACE TELEMETRY
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">NER-CT-071</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-3 group-hover:text-[#00f2fe] transition-colors">
              COSMIC RADIATION PAYLOAD
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              Cadet Chief Master Sgt &amp; Lead Payload Engineer. Directed High Altitude Balloon Challenge telemetry flights, parsing ionizing cosmic radiation flux data up to 100,000 feet altitude across 70+ cadets.
            </p>

            <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase text-slate-300 mb-6">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Atmospheric Sensors</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Radio Signals</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Telemetry</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Cadet Leadership</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Radio className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>Peak Boundary Altitude: 98,420 FT AGL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          004 / PROOF OF WORK (Activity Heatmap)
          ══════════════════════════════════════════════════════════════════ */}
      <section id="proof-of-work" className="py-32 px-6 md:px-16 border-t border-white/10 relative z-20 bg-[#070709]/95 backdrop-blur-md">
        <div className="flex justify-between items-center mb-16 max-w-4xl">
          <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">004 / PROOF OF WORK</span>
          <span className="font-serif italic text-sm text-slate-400">showing up, most days</span>
        </div>

        <div className="animate-up flex flex-col md:flex-row justify-between mb-16 gap-8 max-w-4xl">
          <div>
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-[#00f2fe]" />
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">618</h2>
            </div>
            <p className="font-mono text-xs text-slate-400 tracking-widest mt-2 uppercase">COMMITS / YEAR</p>
          </div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">42</h2>
            <p className="font-mono text-xs text-slate-400 tracking-widest mt-2 uppercase">LONGEST STREAK</p>
          </div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#10b981]">8</h2>
            <p className="font-mono text-xs text-slate-400 tracking-widest mt-2 uppercase">CURRENT STREAK</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <ContributionHeatmap />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          005 / TOOLKIT (Systems Arsenal)
          ══════════════════════════════════════════════════════════════════ */}
      <section id="toolkit" className="py-32 px-6 md:px-16 border-t border-white/10 relative z-20 bg-[#070709]/95 backdrop-blur-md">
        <div className="flex justify-between items-center mb-16 max-w-5xl">
          <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">005 / TOOLKIT</span>
          <span className="font-serif italic text-sm text-slate-400">tools I reach for</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/10 bg-[#0e1117] max-w-5xl animate-up rounded-sm overflow-hidden relative">
          <BlueprintBrackets />
          {[
            {
              title: 'LANGUAGES',
              num: '01',
              desc: 'Core syntaxes for quantitative modeling, systems engineering, and low-latency logic.',
              skills: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C', 'HTML/CSS'],
            },
            {
              title: 'FRONTEND & GRAPHICS',
              num: '02',
              desc: 'Cinematic web interfaces crafted for modularity, physical shaders, and 60fps motion fidelity.',
              skills: ['React 19', 'Next.js', 'Tailwind CSS', 'Three.js / WebGL', 'GSAP', 'Lenis'],
            },
            {
              title: 'AI & AGENTIC SYSTEMS',
              num: '03',
              desc: 'Orchestrating autonomous agents, context retrieval, tool use, and model pipelines.',
              skills: ['Agentic AI', 'MCP Protocols', 'LLMs', 'Gemini API', 'RAG', 'Embeddings'],
            },
            {
              title: 'QUANTITATIVE & DATA',
              num: '04',
              desc: 'High-frequency market models, time-series analysis, and scalable database backends.',
              skills: ['OpenBB', 'VWAP Models', 'Pandas / NumPy', 'Supabase', 'PostgreSQL', 'Redis'],
            },
            {
              title: 'INFRA & PLATFORM',
              num: '05',
              desc: 'Production development lifecycle, containerized services, and CI/CD pipelines.',
              skills: ['Docker', 'Git / GitHub', 'Playwright', 'Linux CLI', 'macOS Terminal'],
            },
            {
              title: 'AUTOMATION & PIPELINES',
              num: '06',
              desc: 'Programmatic video rendering workflows, browser scraping, and external API pipelines.',
              skills: ['Remotion', 'Puppeteer', 'YouTube API', 'Cron Automations'],
            },
          ].map((cat) => (
            <div
              key={cat.num}
              className="p-8 border-b sm:border-r border-white/10 hover:box-glow-cyan transition-all duration-300 relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">{cat.title}</h3>
                <span className="font-mono text-[9px] text-[#00f2fe]">{cat.num}</span>
              </div>
              <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed">
                {cat.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[9px] uppercase px-2.5 py-1 border border-white/15 rounded-sm text-slate-300 hover:border-[#00f2fe] hover:text-[#00f2fe] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          006 / PINNED REPOSITORIES (GitHub Showcase)
          ══════════════════════════════════════════════════════════════════ */}
      <section id="work" className="py-32 px-6 md:px-16 border-t border-white/10 relative z-20 bg-[#070709]/95 backdrop-blur-md">
        <div className="flex justify-between items-center mb-16 max-w-5xl">
          <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">006 / PINNED WORK</span>
          <span className="font-serif italic text-sm text-slate-400">selected repositories</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl animate-up">
          {[
            {
              name: 'antigravity-mobile-ide',
              desc: 'Mobile-first PWA for orchestrating autonomous AI agent workflows and local sandboxes.',
              lang: 'JavaScript',
              color: '#f1e05a',
            },
            {
              name: 'faceless-video-pipeline',
              desc: 'Programmatic video generation pipeline integrating Remotion, text-to-speech, and Gemini API.',
              lang: 'JavaScript',
              color: '#f1e05a',
            },
            {
              name: '180math',
              desc: 'Full-stack educational platform with interactive quiz engines, sub-second evaluation, and payments.',
              lang: 'HTML / TypeScript',
              color: '#3178c6',
            },
            {
              name: 'habit-tracker-pwa',
              desc: 'Schema-driven daily habit tracking with offline local-first sync and calendar analytics.',
              lang: 'TypeScript',
              color: '#3178c6',
            },
            {
              name: 'routine-streak-pwa',
              desc: 'Performance optimizer using bitmask arithmetic for routine state management.',
              lang: 'JavaScript',
              color: '#f1e05a',
            },
            {
              name: 'supercommunicators-app',
              desc: 'NLP-powered communication psychology analyzer identifying conversational alignment patterns.',
              lang: 'Python',
              color: '#3572A5',
            },
          ].map((repo) => (
            <div
              key={repo.name}
              className="border border-white/10 bg-[#0e1117] p-6 hover:box-glow-cyan hover:-translate-y-1 transition-all duration-300 flex flex-col group rounded-sm relative"
            >
              <BlueprintBrackets />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-white/10 rounded-sm flex items-center justify-center shrink-0">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <a
                  href={`https://github.com/rohankosur/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#00f2fe] hover:underline text-sm truncate"
                >
                  {repo.name}
                </a>
                <span className="ml-auto border border-white/20 text-slate-400 text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                  Public
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6 font-light leading-relaxed flex-grow">
                {repo.desc}
              </p>
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 mt-auto">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: repo.color }}
                />
                <span>{repo.lang}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          007 / OFF-SCREEN (Human Element)
          ══════════════════════════════════════════════════════════════════ */}
      <section id="off-screen" className="py-32 px-6 md:px-16 border-t border-white/10 relative z-20 bg-[#070709] overflow-hidden">
        <div className="flex justify-between items-center mb-16 max-w-5xl">
          <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">007 / OFF-SCREEN</span>
          <span className="font-serif italic text-sm text-slate-400">life beyond the editor</span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x w-full max-w-5xl">
          {[
            {
              title: '01/LATE NIGHTS',
              url: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&q=80&w=1200',
              alt: 'Coding setup',
            },
            {
              title: '02/EXPLORATION',
              url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1200',
              alt: 'Climbing',
            },
            {
              title: '03/GAME THEORY',
              url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
              alt: 'Retro tech',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="min-w-[80vw] md:min-w-[30vw] h-[45vh] relative bg-[#111] border border-white/10 shrink-0 snap-center group overflow-hidden rounded-sm"
            >
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest bg-black/70 px-2.5 py-1 backdrop-blur-sm border border-white/10 text-slate-300">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER / CONNECT TERMINAL
          ══════════════════════════════════════════════════════════════════ */}
      <footer className="py-20 px-6 md:px-16 border-t border-white/10 font-mono text-xs text-slate-400 relative z-20 bg-[#070709]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 max-w-5xl">
          <div>
            <div className="flex items-center gap-2 text-white font-bold tracking-widest text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-[#00f2fe]" />
              <span>/SYS/SESSION.NOMINAL</span>
            </div>
            <p className="text-slate-500">
              High-Altitude Atmospheric Terminal v2.4 // Engineered for Rohan Kosur
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <a
              href="mailto:contact@rohankosur.com"
              className="px-6 py-3 rounded-sm bg-[#00f2fe] text-black font-bold tracking-wider hover:bg-[#10b981] transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              ESTABLISH CONNECTION
            </a>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">
              &copy; {CURRENT_YEAR} ROHAN KOSUR.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
