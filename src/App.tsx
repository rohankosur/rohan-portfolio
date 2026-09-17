import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Starfield from './Starfield';
import Hero3DCore from './Hero3DCore';
import Mini3DNode from './Mini3DNode';
import ScrollRibbon from './ScrollRibbon';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
    };

    const onMouseEnter = () => gsap.to(cursor, { scale: 1.5, opacity: 0.8, duration: 0.2 });
    const onMouseLeave = () => gsap.to(cursor, { scale: 1, opacity: 0.5, duration: 0.2 });

    window.addEventListener('mousemove', onMouseMove);

    const interactables = document.querySelectorAll('a, button, .group');
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

  useEffect(() => {
    const elements = gsap.utils.toArray<HTMLElement>('.animate-up');
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[var(--color-neon-purple)] selection:text-white pb-20 overflow-x-hidden bg-[var(--color-dark)] text-[var(--color-off-white)]">
      {/* Background layers */}
      <Starfield />
      <ScrollRibbon />

      {/* Custom Cursor */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 dot-glow-cyan"
      />
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-[var(--color-neon-cyan)] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-50"
      />

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40 font-mono text-[10px] tracking-[0.2em] text-gray-400 border-b border-white/5 backdrop-blur-md bg-[var(--color-dark)]/80">
        <a href="#hero" className="text-white text-sm font-bold tracking-normal font-sans group">
          Rohan Kosur<span className="text-[var(--color-neon-cyan)]">.</span>
        </a>
        <div className="hidden md:flex gap-12">
          <a href="#work" className="hover:text-[var(--color-neon-cyan)] transition-colors">
            WORK
          </a>
          <a href="#about" className="hover:text-[var(--color-neon-cyan)] transition-colors">
            ABOUT
          </a>
          <a href="#toolkit" className="hover:text-[var(--color-neon-cyan)] transition-colors">
            TOOLKIT
          </a>
          <a href="#experience" className="hover:text-[var(--color-neon-cyan)] transition-colors">
            EXPERIENCE
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-cyan)] animate-pulse dot-glow-cyan"></span>
          <span>TICK {time}</span>
        </div>
      </nav>

      {/* Marquee Ticker */}
      <div className="fixed top-[65px] left-0 w-full border-b border-white/5 py-2 overflow-hidden flex gap-8 font-mono text-[8px] uppercase tracking-widest text-gray-500 z-30 bg-[var(--color-dark)]/90 backdrop-blur-sm whitespace-nowrap pointer-events-none">
        <div className="animate-[marquee_25s_linear_infinite] flex gap-12">
          <span><span className="text-[var(--color-neon-purple)]">●</span> QUANTITATIVE FINANCE</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> AGENTIC SYSTEMS</span>
          <span><span className="text-[var(--color-neon-purple)]">●</span> FULL-STACK ARCHITECTURE</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> UCONN SCHOOL OF BUSINESS</span>
          <span><span className="text-[var(--color-neon-purple)]">●</span> 180 MATH LLC</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> HIGH-FREQUENCY LOGIC</span>
          <span><span className="text-[var(--color-neon-purple)]">●</span> QUANTITATIVE FINANCE</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> AGENTIC SYSTEMS</span>
          <span><span className="text-[var(--color-neon-purple)]">●</span> FULL-STACK ARCHITECTURE</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> UCONN SCHOOL OF BUSINESS</span>
          <span><span className="text-[var(--color-neon-purple)]">●</span> 180 MATH LLC</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> HIGH-FREQUENCY LOGIC</span>
        </div>
      </div>

      {/* Section 001 / HERO */}
      <section id="hero" className="min-h-screen relative py-32 px-6 md:px-20 border-t border-white/5 flex flex-col justify-center">
        {/* Hero3DCore right-positioned */}
        <div className="absolute right-[-25%] md:right-[-5%] top-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] pointer-events-auto z-0 cursor-crosshair">
          <Hero3DCore />
        </div>

        {/* z-10 Content */}
        <div className="z-10 animate-up relative max-w-3xl">
          <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase text-white mb-0">
            ROHAN
          </h1>
          <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase text-outline-cyan mb-10">
            KOSUR
          </h1>

          <div className="border-l-2 border-[var(--color-neon-cyan)] pl-6 py-1 relative">
            <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-200">
              Finance student &amp; full-stack developer building at the intersection of{' '}
              <span className="font-calligraphy text-[var(--color-neon-cyan)] glow-cyan">
                systems and strategy
              </span>
            </p>
          </div>
        </div>

        {/* Floating Data Feed */}
        <div className="absolute top-1/3 right-8 md:right-24 hidden md:flex flex-col gap-1 font-mono text-[9px] text-[var(--color-neon-purple)] opacity-75 border-l border-[var(--color-neon-purple)]/50 pl-3 z-10">
          <span className="animate-pulse">SYS.ONLINE // PID 4092</span>
          <span>UPTIME: 99.97%</span>
          <span>MEM: 0x4F9A</span>
        </div>

        {/* Bottom Status Indicators */}
        <div className="absolute bottom-10 left-6 md:left-20 font-mono text-[9px] tracking-widest text-gray-400 flex flex-col gap-2 z-10">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full dot-glow-cyan"></span>
            STATUS: ACTIVE [UCONN SCHOOL OF BUSINESS]
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--color-neon-purple)] rounded-full dot-glow-purple"></span>
            BUILDING: 180 MATH LLC
          </span>
        </div>
      </section>

      {/* Section 002 / ABOUT */}
      <section id="about" className="py-32 px-6 md:px-20 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <span className="section-label">002 / ABOUT</span>
          <span className="section-accent">a bit of context</span>
        </div>

        <div className="max-w-3xl space-y-6 animate-up">
          <p className="text-lg text-gray-300 leading-relaxed">
            I'm a Finance major at UConn with a deep pull toward building things that work. From founding 180 Math LLC — scaling an ed-tech platform to 300+ students — to orchestrating autonomous AI agent pipelines, I operate at the boundary where quantitative thinking meets hands-on engineering.
          </p>
          <p className="text-base text-gray-400 leading-relaxed font-light">
            Whether developing high-frequency habit algorithms, full-stack web architectures, or exploring autonomous agent toolchains, my focus remains constant: eliminate friction, scale impact, and build systems engineered to last.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="border border-white/10 p-6 bg-[var(--color-surface)]">
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight">300+</div>
              <div className="font-mono text-[10px] text-gray-400 tracking-widest mt-2 uppercase">
                STUDENTS REACHED
              </div>
            </div>
            <div className="border border-white/10 p-6 bg-[var(--color-surface)]">
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight">6</div>
              <div className="font-mono text-[10px] text-gray-400 tracking-widest mt-2 uppercase">
                PINNED REPOS
              </div>
            </div>
            <div className="border border-white/10 p-6 bg-[var(--color-surface)]">
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight">618</div>
              <div className="font-mono text-[10px] text-gray-400 tracking-widest mt-2 uppercase">
                COMMITS/YR
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 003 / PROOF_OF_WORK */}
      <section id="proof-of-work" className="py-32 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-center mb-16 px-6 md:px-20">
          <span className="section-label">003 / PROOF_OF_WORK</span>
          <span className="section-accent">showing up, most days</span>
        </div>

        <div className="animate-up flex flex-col md:flex-row justify-between mb-16 gap-8 px-6 md:px-20">
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">618</h2>
            <p className="font-mono text-xs text-gray-400 tracking-widest mt-2 uppercase">COMMITS/YR</p>
          </div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">42</h2>
            <p className="font-mono text-xs text-gray-400 tracking-widest mt-2 uppercase">LONGEST STREAK</p>
          </div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">8</h2>
            <p className="font-mono text-xs text-gray-400 tracking-widest mt-2 uppercase">CURRENT STREAK</p>
          </div>
        </div>

        {/* GitHub contribution heatmap grid */}
        <div className="w-full overflow-x-auto pb-4 opacity-100 animate-up">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1 w-max">
            {Array.from({ length: 364 }).map((_, i) => {
              const val = (Math.sin(i * 0.37) * 0.4 + Math.sin(i * 1.83) * 0.3 + Math.cos(i * 0.08) * 0.3 + 1) / 2;
              let bg = 'rgba(255,255,255,0.05)';
              let shadow = 'none';
              if (val > 0.85) { bg = 'var(--color-neon-cyan)'; shadow = '0 0 10px var(--color-neon-cyan)'; }
              else if (val > 0.65) { bg = 'var(--color-neon-purple)'; shadow = '0 0 10px var(--color-neon-purple)'; }
              else if (val > 0.45) { bg = 'rgba(255, 0, 255, 0.4)'; }
              else if (val > 0.25) { bg = 'rgba(0, 255, 255, 0.15)'; }

              return (
                <div
                  key={i}
                  className="w-3 h-3 rounded-[2px] transition-all duration-200 hover:scale-125 hover:z-10 relative cursor-none"
                  style={{ backgroundColor: bg, boxShadow: shadow }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 004 / TOOLKIT */}
      <section id="toolkit" className="py-32 px-6 md:px-20 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <span className="section-label">004 / TOOLKIT</span>
          <span className="section-accent">tools I reach for</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 bg-[var(--color-surface)] animate-up">
          {/* Languages */}
          <div className="p-8 border-b md:border-r border-white/10 group relative overflow-hidden hover:box-glow-cyan transition-all duration-300">
            <div className="absolute -right-8 -top-8 w-28 h-28 opacity-15 pointer-events-none">
              <Mini3DNode color="#00f3ff" />
            </div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Languages</h3>
              <span className="font-mono text-[9px] text-[var(--color-neon-cyan)]">01</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6 relative z-10 leading-relaxed">
              Core syntaxes for modeling, architecture, and systems engineering.
            </p>
            <div className="flex flex-wrap gap-2 relative z-10">
              {['Python', 'TypeScript', 'JavaScript', 'SQL', 'HTML', 'CSS', 'C'].map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Frontend */}
          <div className="p-8 border-b md:border-r border-white/10 group relative overflow-hidden hover:box-glow-cyan transition-all duration-300">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Frontend</h3>
              <span className="font-mono text-[9px] text-[var(--color-neon-cyan)]">02</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6 relative z-10 leading-relaxed">
              Responsive web interfaces crafted for speed, modularity, and motion fidelity.
            </p>
            <div className="flex flex-wrap gap-2 relative z-10">
              {['React', 'Next.js', 'Tailwind CSS', 'GSAP'].map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI / ML */}
          <div className="p-8 border-b border-white/10 group relative overflow-hidden hover:box-glow-cyan transition-all duration-300">
            <div className="absolute -right-8 -top-8 w-28 h-28 opacity-15 pointer-events-none">
              <Mini3DNode color="#b026ff" />
            </div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">AI / ML</h3>
              <span className="font-mono text-[9px] text-[var(--color-neon-cyan)]">03</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6 relative z-10 leading-relaxed">
              Orchestrating autonomous agents, context retrieval, and model integrations.
            </p>
            <div className="flex flex-wrap gap-2 relative z-10">
              {['Agentic AI', 'MCP', 'LLMs', 'Gemini', 'RAG', 'Embeddings'].map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Data */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-white/10 group relative overflow-hidden hover:box-glow-cyan transition-all duration-300">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Data</h3>
              <span className="font-mono text-[9px] text-[var(--color-neon-cyan)]">04</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6 relative z-10 leading-relaxed">
              Persistent relational databases, caching layers, and scalable cloud backends.
            </p>
            <div className="flex flex-wrap gap-2 relative z-10">
              {['Supabase', 'PostgreSQL', 'MongoDB', 'Redis'].map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-white/10 group relative overflow-hidden hover:box-glow-cyan transition-all duration-300">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Platform</h3>
              <span className="font-mono text-[9px] text-[var(--color-neon-cyan)]">05</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6 relative z-10 leading-relaxed">
              Production development lifecycle, automated testing, and CI/CD pipelines.
            </p>
            <div className="flex flex-wrap gap-2 relative z-10">
              {['Git', 'GitHub', 'Playwright', 'CI/CD'].map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Automation */}
          <div className="p-8 group relative overflow-hidden hover:box-glow-cyan transition-all duration-300">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Automation</h3>
              <span className="font-mono text-[9px] text-[var(--color-neon-cyan)]">06</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6 relative z-10 leading-relaxed">
              Programmatic rendering workflows, browser scraping, and external API pipelines.
            </p>
            <div className="flex flex-wrap gap-2 relative z-10">
              {['Remotion', 'YouTube API', 'Puppeteer'].map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 005 / EXPERIENCE */}
      <section id="experience" className="py-32 px-6 md:px-20 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <span className="section-label">005 / EXPERIENCE</span>
          <span className="section-accent">the route so far</span>
        </div>

        <div className="space-y-8 animate-up">
          {/* Card 1: 180 MATH LLC */}
          <div className="w-full bg-[#f4f4f0] text-[#0a0a0a] rounded-sm p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] to-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="max-w-2xl z-10">
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 text-[#0a0a0a]">
                180 MATH LLC
              </h3>
              <p className="font-calligraphy text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                Scaled an online math resource platform to 300+ students. Built automated workflows using Playwright and orchestrated data pipelines.
              </p>
              <div className="flex items-center gap-4 font-mono text-[9px] tracking-widest uppercase text-gray-800">
                <span className="font-bold">FOUNDER &amp; LEAD DEVELOPER</span>
                <span className="text-gray-400">|</span>
                <span>Storrs, CT</span>
              </div>
            </div>
            <div className="z-10 flex flex-col items-start md:items-end gap-6 shrink-0">
              <span className="text-3xl md:text-4xl font-bold text-[#0a0a0a] tracking-tight">
                2023–Present
              </span>
              <div className="flex flex-wrap gap-2 font-mono text-[8px] uppercase">
                <span className="border border-black/25 px-3 py-1 rounded-sm text-black font-semibold">
                  Next.js
                </span>
                <span className="border border-black/25 px-3 py-1 rounded-sm text-black font-semibold">
                  Supabase
                </span>
                <span className="border border-black/25 px-3 py-1 rounded-sm text-black font-semibold">
                  Playwright
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: CIVIL AIR PATROL */}
          <div className="w-full bg-[var(--color-surface)] border border-white/10 text-white rounded-sm p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-purple)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="max-w-2xl z-10">
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 text-white">
                CIVIL AIR PATROL
              </h3>
              <p className="font-calligraphy text-base md:text-lg text-gray-400 mb-6 leading-relaxed">
                Led a team of 70+ cadets and directed the High Altitude Balloon Challenge research team, analyzing high-altitude telemetry data.
              </p>
              <div className="flex items-center gap-4 font-mono text-[9px] tracking-widest uppercase">
                <span className="font-bold text-[var(--color-neon-purple)]">
                  CADET CHIEF MASTER SGT
                </span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">NER-CT-071</span>
              </div>
            </div>
            <div className="z-10 flex flex-col items-start md:items-end gap-6 shrink-0">
              <span className="text-3xl md:text-4xl font-bold text-[var(--color-neon-purple)] tracking-tight">
                2020–2024
              </span>
              <div className="flex flex-wrap gap-2 font-mono text-[8px] uppercase">
                <span className="border border-white/20 px-3 py-1 rounded-sm text-gray-300">
                  Leadership
                </span>
                <span className="border border-white/20 px-3 py-1 rounded-sm text-gray-300">
                  Research
                </span>
                <span className="border border-white/20 px-3 py-1 rounded-sm text-gray-300">
                  Telemetry
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 006 / WORK */}
      <section id="work" className="py-32 px-6 md:px-20 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <span className="section-label">006 / WORK</span>
          <span className="section-accent">pinned repositories</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-up">
          {[
            {
              name: 'antigravity-mobile-ide',
              desc: 'Mobile-first PWA for orchestrating autonomous AI agent workflows',
              lang: 'JavaScript',
              color: '#f1e05a',
            },
            {
              name: 'faceless-video-pipeline',
              desc: 'Programmatic video generation pipeline with Remotion and Gemini API',
              lang: 'JavaScript',
              color: '#f1e05a',
            },
            {
              name: '180math',
              desc: 'Full-stack educational platform with interactive quiz engines and payments',
              lang: 'HTML',
              color: '#e34c26',
            },
            {
              name: 'habit-tracker-pwa',
              desc: 'Schema-driven daily habit tracking with offline sync',
              lang: 'TypeScript',
              color: '#3178c6',
            },
            {
              name: 'routine-streak-pwa',
              desc: 'Performance optimizer using bitmask arithmetic for routine tracking',
              lang: 'JavaScript',
              color: '#f1e05a',
            },
            {
              name: 'supercommunicators-app',
              desc: 'NLP-powered communication psychology analyzer',
              lang: 'Python',
              color: '#3572A5',
            },
          ].map((repo) => (
            <div
              key={repo.name}
              className="border border-white/10 bg-[var(--color-surface)] p-6 hover:box-glow-cyan transition-all duration-300 flex flex-col group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-white/10 rounded-sm flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                    />
                  </svg>
                </div>
                <a
                  href={`https://github.com/rohankosur/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--color-neon-cyan)] hover:underline text-sm truncate"
                >
                  {repo.name}
                </a>
                <span className="ml-auto border border-white/20 text-gray-400 text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                  Public
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-6 font-calligraphy flex-grow leading-relaxed">
                {repo.desc}
              </p>
              <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400 mt-auto">
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

      {/* Section 007 / OFF-SCREEN */}
      <section id="off-screen" className="py-32 px-6 md:px-20 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="px-6 md:px-20 flex justify-between items-center mb-16">
          <span className="section-label">007 / OFF-SCREEN</span>
          <span className="section-accent">life beyond the editor</span>
        </div>

        <div className="flex gap-6 px-6 md:px-20 overflow-x-auto pb-8 snap-x w-full">
          {/* Item 1 */}
          <div className="min-w-[80vw] md:min-w-[40vw] h-[50vh] relative bg-[#111] border border-white/10 shrink-0 snap-center group overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&q=80&w=1200"
              alt="Coding setup"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest bg-black/60 px-2.5 py-1 backdrop-blur-sm border border-white/10 text-gray-300">
              01/LATE NIGHTS
            </div>
          </div>

          {/* Item 2 */}
          <div className="min-w-[80vw] md:min-w-[40vw] h-[50vh] relative bg-[#111] border border-white/10 shrink-0 snap-center group overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1200"
              alt="Climbing"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest bg-black/60 px-2.5 py-1 backdrop-blur-sm border border-white/10 text-gray-300">
              02/EXPLORATION
            </div>
          </div>

          {/* Item 3 */}
          <div className="min-w-[80vw] md:min-w-[40vw] h-[50vh] relative bg-[#111] border border-white/10 shrink-0 snap-center group overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200"
              alt="Retro tech"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest bg-black/60 px-2.5 py-1 backdrop-blur-sm border border-white/10 text-gray-300">
              03/GAME THEORY
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-20 border-t border-white/10 font-mono text-xs text-gray-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <p className="text-white mb-2 font-bold tracking-widest text-sm">/SYS/LOGS/SESSION.END</p>
          <p className="text-gray-400">All systems nominal.</p>
        </div>
        <div className="md:text-right">
          <a
            href="mailto:contact@rohankosur.com"
            className="text-[var(--color-neon-cyan)] hover:text-white transition-colors underline decoration-[var(--color-neon-cyan)]/40 underline-offset-4 tracking-wider text-sm font-semibold"
          >
            ESTABLISH CONNECTION
          </a>
          <p className="mt-4 text-[9px] uppercase tracking-widest text-gray-600">
            &copy; {new Date().getFullYear()} ROHAN KOSUR.
          </p>
        </div>
      </footer>

      {/* Global CSS for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default App;
