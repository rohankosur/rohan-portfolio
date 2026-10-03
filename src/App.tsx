import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Activity, 
  Cpu, 
  Radio, 
  Layers, 
  Terminal as TerminalIcon, 
  ExternalLink, 
  Compass,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import Starfield from './Starfield';
import Experience3D from './Experience3D';

gsap.registerPlugin(ScrollTrigger);

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const CURRENT_YEAR = new Date().getFullYear();

/* ══════════════════════════════════════════════════════════════════════
   PRECISION TELEMETRY HUD
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 max-w-xl text-[9px]">
        <div className="p-2 bg-[#0e1117]/80 border border-white/5 rounded-sm">
          <div className="text-slate-500 uppercase">SYS.PID</div>
          <div className="text-[#00f2fe] font-bold mt-0.5">{pid}</div>
        </div>
        <div className="p-2 bg-[#0e1117]/80 border border-white/5 rounded-sm">
          <div className="text-slate-500 uppercase">MEM.BUFFER</div>
          <div className="text-slate-200 font-bold mt-0.5">{mem}</div>
        </div>
        <div className="p-2 bg-[#0e1117]/80 border border-white/5 rounded-sm">
          <div className="text-slate-500 uppercase">RAD.FLUX</div>
          <div className="text-[#10b981] font-bold mt-0.5">{flux}</div>
        </div>
        <div className="p-2 bg-[#0e1117]/80 border border-white/5 rounded-sm">
          <div className="text-slate-500 uppercase">PEAK.ALT</div>
          <div className="text-white font-bold mt-0.5">{altitude}</div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   CLOCK TICKER COMPONENT (Isolated render)
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
   MAIN PORTFOLIO APPLICATION
   ══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const appContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Smooth Scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 1.5;
      const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      setScrollProgress(progress);
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

  // Custom Cursor for Fine Pointers
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
    };

    const onMouseEnter = () => gsap.to(cursor, { scale: 1.6, borderColor: '#00f2fe', duration: 0.2 });
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

  // GSAP ScrollTrigger Section Transitions
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
      className="relative min-h-screen selection:bg-[#00f2fe] selection:text-black pb-24 overflow-x-hidden bg-[#070709] text-[#e2e8f0]"
    >
      {/* 2D Background Cosmic Particle Canvas */}
      <Starfield />

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
          <span className="text-[#00f2fe] font-mono text-[9px] px-1.5 py-0.5 rounded border border-[#00f2fe]/30 bg-[#00f2fe]/10">
            ATMOSPHERIC TERMINAL
          </span>
        </a>

        <div className="hidden md:flex gap-10 text-slate-400">
          <a href="#subsystems" className="hover:text-[#00f2fe] transition-colors">
            01/SUBSYSTEMS
          </a>
          <a href="#research" className="hover:text-[#00f2fe] transition-colors">
            02/COSMIC RAD
          </a>
          <a href="#arsenal" className="hover:text-[#00f2fe] transition-colors">
            03/ARSENAL
          </a>
          <a href="#contact" className="hover:text-[#00f2fe] transition-colors">
            04/CONNECT
          </a>
        </div>

        <ClockTicker />
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          FIXED 3D HERO CANVAS (Centerpiece with Exploded Transition)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="fixed right-[-15%] md:right-[-2%] top-1/2 -translate-y-1/2 w-[90vw] md:w-[60vw] h-[90vh] pointer-events-auto z-10 cursor-crosshair">
        <Experience3D scrollProgress={scrollProgress} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION (Section 001)
          ══════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="min-h-screen relative pt-36 pb-20 px-6 md:px-16 flex flex-col justify-center z-20 pointer-events-none"
      >
        <div className="max-w-2xl pointer-events-auto">
          <div className="animate-up">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#00f2fe] tracking-[0.25em] uppercase mb-4">
              <Compass className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>AEROSPACE INSTRUMENTATION // QUANTITATIVE ARCHITECTURE</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-white leading-none">
              ROHAN
            </h1>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-white to-[#10b981] leading-none mb-6">
              KOSUR
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-xl">
              Finance student at the <span className="text-white font-medium">University of Connecticut</span> (Class of 2030) building at the nexus of high-frequency quantitative systems, ed-tech scale, and autonomous AI telemetry.
            </p>

            {/* Dynamic Telemetry HUD */}
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

        {/* Scroll Indicator Prompt */}
        <div className="absolute bottom-10 left-6 md:left-16 font-mono text-[9px] tracking-widest text-slate-500 flex items-center gap-3">
          <span className="w-1.5 h-4 border border-slate-600 rounded-full flex justify-center pt-0.5">
            <span className="w-0.5 h-1 bg-[#00f2fe] rounded-full animate-bounce"></span>
          </span>
          <span>SCROLL TO DISENGAGE COMPONENT LOCKS (EXPLODED SCHEMATIC)</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SUBSYSTEM SHOWCASE (Section 002: Exploded Clusters)
          ══════════════════════════════════════════════════════════════════ */}
      <section
        id="subsystems"
        className="min-h-screen py-32 px-6 md:px-16 border-t border-white/10 relative z-20 pointer-events-none"
      >
        <div className="flex justify-between items-center mb-16 pointer-events-auto max-w-xl">
          <div>
            <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">
              01 // DEPLOYED SUBSYSTEMS
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
          {/* Card 1: 180 Math LLC */}
          <div className="p-8 bg-[#0e1117]/90 border border-white/10 rounded-sm hover:border-[#00f2fe] transition-all duration-300 relative group overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f2fe]"></span>
                <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">
                  CLUSTER 01 // ED-TECH ENGINE
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">2023–PRESENT</span>
            </div>

            <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-2 group-hover:text-[#00f2fe] transition-colors">
              180 MATH LLC
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              Founder &amp; Lead Developer. Engineered an educational acceleration platform serving 300+ active students with sub-second question generation, interactive automated assessment workflows, and payment pipelines.
            </p>

            <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase text-slate-300 mb-6">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Next.js</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Supabase</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Playwright</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Data Pipelines</span>
            </div>

            <a
              href="https://180math.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00f2fe] hover:underline"
            >
              <span>ACCESS 180MATH.COM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Quantitative Algorithmic Backtester */}
          <div className="p-8 bg-[#0e1117]/90 border border-white/10 rounded-sm hover:border-[#10b981] transition-all duration-300 relative group overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                <span className="font-mono text-[10px] text-[#10b981] tracking-widest uppercase">
                  CLUSTER 02 // QUANTITATIVE SIGNAL ENGINE
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">FINANCE '30</span>
            </div>

            <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-2 group-hover:text-[#10b981] transition-colors">
              ALGORITHMIC BACKTESTER
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              High-frequency quantitative engine modeling VWAP reversion, volatility thresholds, and systematic alpha strategies against historical tick data with sub-millisecond local execution.
            </p>

            <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase text-slate-300 mb-6">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Python</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">OpenBB</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">NumPy / Pandas</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">VWAP Modeling</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Sharpe &amp; Calmar Ratio Optimization // Sub-second Analysis</span>
            </div>
          </div>

          {/* Card 3: CAP Cosmic Radiation Telemetry */}
          <div className="p-8 bg-[#0e1117]/90 border border-white/10 rounded-sm hover:border-[#00f2fe] transition-all duration-300 relative group overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f2fe]"></span>
                <span className="font-mono text-[10px] text-[#00f2fe] tracking-widest uppercase">
                  CLUSTER 03 // AEROSPACE TELEMETRY
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">NER-CT-071</span>
            </div>

            <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-2 group-hover:text-[#00f2fe] transition-colors">
              COSMIC RADIATION RESEARCH
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              Cadet Chief Master Sgt &amp; Lead Payload Engineer. Directed High Altitude Balloon Challenge telemetry flights, parsing ionizing cosmic radiation flux data up to 100,000 feet altitude across 70+ cadets.
            </p>

            <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase text-slate-300 mb-6">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Telemetry</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Atmospheric Sensors</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Radio Signals</span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">Leadership</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Radio className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>Atmospheric Boundary Penetration: 98,420 FT AGL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SYSTEMS ARSENAL (Section 003)
          ══════════════════════════════════════════════════════════════════ */}
      <section
        id="arsenal"
        className="py-32 px-6 md:px-16 border-t border-white/10 relative z-20 bg-[#070709]/95 backdrop-blur-md"
      >
        <div className="flex justify-between items-center mb-16 max-w-4xl">
          <div>
            <span className="font-mono text-[10px] text-[#10b981] tracking-widest uppercase">
              03 // TECHNICAL ARSENAL
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mt-1">
              ENGINEERED TOOLCHAIN
            </h2>
          </div>
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hidden sm:inline">
            CORE CAPABILITIES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
          {[
            {
              title: 'LANGUAGES',
              icon: <TerminalIcon className="w-4 h-4 text-[#00f2fe]" />,
              items: ['Python', 'C', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS'],
            },
            {
              title: 'QUANT & SYSTEMS',
              icon: <Activity className="w-4 h-4 text-[#10b981]" />,
              items: ['OpenBB', 'VWAP Models', 'Pandas / NumPy', 'Algorithmic Trading', 'Time-Series Analysis'],
            },
            {
              title: 'ARCHITECTURE & WEB',
              icon: <Layers className="w-4 h-4 text-[#00f2fe]" />,
              items: ['React 19', 'Next.js', 'Tailwind CSS', 'Three.js / WebGL', 'Supabase'],
            },
            {
              title: 'INFRA & AUTOMATION',
              icon: <Cpu className="w-4 h-4 text-[#10b981]" />,
              items: ['Docker', 'Git / GitHub', 'Playwright', 'Linux / macOS CLI', 'MCP Protocols'],
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#0e1117] border border-white/10 rounded-sm hover:border-white/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-4 font-mono text-xs font-bold text-white tracking-wider">
                {cat.icon}
                <span>{cat.title}</span>
              </div>
              <ul className="space-y-2 font-mono text-[11px] text-slate-400">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span className="hover:text-[#00f2fe] transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER / CONNECT TERMINAL (Section 004)
          ══════════════════════════════════════════════════════════════════ */}
      <footer
        id="contact"
        className="py-20 px-6 md:px-16 border-t border-white/10 font-mono text-xs text-slate-400 relative z-20 bg-[#070709]"
      >
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
