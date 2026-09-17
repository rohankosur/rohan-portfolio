import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Starfield from './Starfield';
import Hero3DCore from './Hero3DCore';
import Mini3DNode from './Mini3DNode';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (cursor && dot) {
      const onMouseMove = (e: MouseEvent) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
        gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
      };
      
      const onMouseEnter = () => gsap.to(cursor, { scale: 1.5, opacity: 0.8, duration: 0.2 });
      const onMouseLeave = () => gsap.to(cursor, { scale: 1, opacity: 0.5, duration: 0.2 });

      window.addEventListener('mousemove', onMouseMove);
      
      // Attach hover listeners to interactable elements
      const interactables = document.querySelectorAll('a, button, .group');
      interactables.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        interactables.forEach(el => {
          el.removeEventListener('mouseenter', onMouseEnter);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      };
    }
  }, []);

  useEffect(() => {
    const elements = gsap.utils.toArray('.animate-up');
    elements.forEach((el: any) => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[var(--color-neon-purple)] selection:text-white pb-20 overflow-x-hidden">
      <Starfield />
      
      {/* Custom Cursor */}
      <div ref={cursorDotRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 glow-cyan"></div>
      <div ref={cursorRef} className="fixed top-0 left-0 w-8 h-8 border border-[var(--color-neon-cyan)] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40 font-mono-tech text-[10px] tracking-[0.2em] text-gray-400 border-b border-white/5 backdrop-blur-md">
        <div className="text-white font-sans text-sm tracking-normal font-bold">Rohan Kosur<span className="text-[var(--color-neon-purple)]">.</span></div>
        <div className="hidden md:flex gap-12">
          <a href="#metrics" className="hover:text-white transition-colors">METRICS</a>
          <a href="#toolkit" className="hover:text-white transition-colors">TOOLKIT</a>
          <a href="#experience" className="hover:text-white transition-colors">EXPERIENCE</a>
          <a href="#projects" className="hover:text-white transition-colors">PROJECTS</a>
        </div>
        <div className="flex gap-4 items-center">
          <span>TICK {time}</span>
        </div>
      </nav>

      {/* Top Ticker Marquee */}
      <div className="fixed top-[65px] left-0 w-full border-b border-white/5 py-2 overflow-hidden flex gap-8 font-mono-tech text-[8px] uppercase tracking-widest text-gray-500 z-30 bg-[var(--color-dark)]/80 backdrop-blur-sm whitespace-nowrap">
        <div className="animate-[marquee_20s_linear_infinite] flex gap-12">
          <span><span className="text-[var(--color-neon-purple)]">●</span> ALGORITHMIC RISK ASSESSMENT</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> SYSTEM ARCHITECTURE</span>
          <span><span className="text-[var(--color-neon-purple)]">●</span> DATA-DRIVEN STRATEGY</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> UCONN FINANCE</span>
          
          <span><span className="text-[var(--color-neon-purple)]">●</span> ALGORITHMIC RISK ASSESSMENT</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> SYSTEM ARCHITECTURE</span>
          <span><span className="text-[var(--color-neon-purple)]">●</span> DATA-DRIVEN STRATEGY</span>
          <span><span className="text-[var(--color-neon-cyan)]">●</span> UCONN FINANCE</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-32">
        {/* HUD Corner Accents */}
        <div className="absolute top-24 left-6 w-4 h-4 border-t-2 border-l-2 border-[var(--color-neon-cyan)] opacity-50"></div>
        <div className="absolute top-24 right-6 w-4 h-4 border-t-2 border-r-2 border-[var(--color-neon-cyan)] opacity-50"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-[var(--color-neon-cyan)] opacity-50"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-[var(--color-neon-cyan)] opacity-50"></div>

        {/* 3D Core */}
        <div className="absolute right-[-30%] md:right-[-5%] top-1/4 md:top-1/2 md:-translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] pointer-events-auto opacity-90 z-0 cursor-crosshair">
          <Hero3DCore />
        </div>

        {/* Left Side Content */}
        <div className="z-10 animate-up relative">
          <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase mb-0 text-white glow-cyan">ROHAN</h1>
          <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase text-outline-neon mb-12">KOSUR</h1>
          
          <div className="max-w-xl border-l border-[var(--color-neon-cyan)]/50 pl-6 relative">
            <div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] glow-cyan animate-ping"></div>
            <div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] glow-cyan"></div>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-200">
              architecting resilient infrastructure and <span className="font-calligraphy text-[var(--color-neon-cyan)] glow-cyan">deploying</span> full-stack analytical engines.
            </p>
          </div>
        </div>

        {/* Floating Data Feed */}
        <div className="absolute top-1/3 left-2/3 hidden md:flex flex-col gap-1 font-mono-tech text-[8px] text-[var(--color-neon-purple)] opacity-70 border-l border-[var(--color-neon-purple)]/50 pl-2">
          <span className="animate-pulse">SYS.CORE.ACTIVE // RUNNING</span>
          <span>LATENCY: 12ms</span>
          <span>MEM: 0x4F9A</span>
          <div className="h-px w-16 bg-[var(--color-neon-purple)]/50 mt-1"></div>
        </div>

        {/* Bottom Micro Copy */}
        <div className="absolute bottom-10 left-12 md:left-24 font-mono-tech text-[9px] tracking-widest text-gray-400 flex flex-col gap-2">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full glow-cyan"></span>
            STATUS: ACTIVE [UCONN SCHOOL OF BUSINESS]
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--color-neon-purple)] rounded-full glow-purple"></span>
            INIT: 180 MATH LLC [FOUNDER]
          </span>
        </div>
      </section>

      {/* Proof of Work (GitHub Stats) */}
      <section id="metrics" className="py-32 px-6 md:px-20 border-t border-white/5 relative">
        <div className="flex justify-between font-mono-tech text-[10px] tracking-[0.2em] text-gray-500 mb-16 uppercase">
          <span>002 / PROOF_OF_WORK</span>
          <span className="font-calligraphy text-gray-400 lowercase tracking-normal text-sm">showing up, most days</span>
        </div>

        <div className="animate-up flex flex-col md:flex-row justify-between mb-16 gap-8">
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">618</h2>
            <p className="font-mono-tech text-xs text-gray-500 tracking-widest mt-2">COMMITS / YR</p>
          </div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">42</h2>
            <p className="font-mono-tech text-xs text-gray-500 tracking-widest mt-2">LONGEST STREAK</p>
          </div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">8</h2>
            <p className="font-mono-tech text-xs text-gray-500 tracking-widest mt-2">CURRENT STREAK</p>
          </div>
        </div>

        {/* GitHub Graph Simulation */}
        <div className="w-full overflow-x-auto pb-4 opacity-80 animate-up">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 w-max">
            {Array.from({ length: 364 }).map((_, i) => {
              const intensity = Math.random();
              let color = "bg-[#161b22]"; // Empty
              if (intensity > 0.95) color = "bg-[#39d353] glow-cyan"; // High
              else if (intensity > 0.8) color = "bg-[#26a641]"; // Med
              else if (intensity > 0.6) color = "bg-[#006d32]"; // Low
              else if (intensity > 0.4) color = "bg-[#0e4429]"; // Very low
              return <div key={i} className={`w-3.5 h-3.5 rounded-[2px] ${color} transition-colors duration-300 hover:bg-white`}></div>;
            })}
          </div>
        </div>
      </section>

      {/* Toolkit Section */}
      <section id="toolkit" className="py-32 px-6 md:px-20 border-t border-white/5 relative">
        <div className="flex justify-between font-mono-tech text-[10px] tracking-[0.2em] text-gray-500 mb-16 uppercase">
          <span>003 / TOOLKIT</span>
          <span className="font-calligraphy text-gray-400 lowercase tracking-normal text-sm">tools I reach for</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/10 bg-[#0a0a0a] animate-up">
          
          <div className="p-8 border-b md:border-r md:border-b-0 lg:border-b border-white/10 group relative overflow-hidden hover:box-glow-purple transition-all duration-300 hover:z-20">
            <div className="absolute -right-10 -top-10 w-32 h-32 opacity-20 pointer-events-none"><Mini3DNode color="#00f3ff"/></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-2xl font-black uppercase">Languages</h3>
              <span className="font-mono-tech text-[9px] text-[var(--color-neon-purple)]">01</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6 relative z-10">What I reach for when building apps, services, and modeling workflows.</p>
            <div className="flex flex-wrap gap-2 font-mono-tech text-[8px] uppercase tracking-wider relative z-10">
              {['Python', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'C'].map(t => (
                <span key={t} className="border border-white/20 px-2 py-1 rounded-sm">{t}</span>
              ))}
            </div>
          </div>

          <div className="p-8 border-b lg:border-r border-white/10 group relative overflow-hidden hover:box-glow-purple transition-all duration-300 hover:z-20">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 opacity-20 pointer-events-none"><Mini3DNode color="#b026ff"/></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-2xl font-black uppercase">Frontend</h3>
              <span className="font-mono-tech text-[9px] text-[var(--color-neon-purple)]">02</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6 relative z-10">Product interfaces with clean component structure and fast iteration.</p>
            <div className="flex flex-wrap gap-2 font-mono-tech text-[8px] uppercase tracking-wider relative z-10">
              {['React', 'Next.js', 'Tailwind CSS'].map(t => (
                <span key={t} className="border border-white/20 px-2 py-1 rounded-sm">{t}</span>
              ))}
            </div>
          </div>

          <div className="p-8 border-b md:border-r lg:border-r-0 lg:border-b border-white/10 group">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black uppercase">AI / Agents</h3>
              <span className="font-mono-tech text-[9px] text-[var(--color-neon-purple)]">03</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6">Orchestrating autonomous workflows and applied AI systems.</p>
            <div className="flex flex-wrap gap-2 font-mono-tech text-[8px] uppercase tracking-wider">
              {['Agentic AI', 'MCP', 'LLMs', 'Gemini', 'RAG'].map(t => (
                <span key={t} className="border border-white/20 px-2 py-1 rounded-sm">{t}</span>
              ))}
            </div>
          </div>

          <div className="p-8 border-b md:border-b-0 md:border-r lg:border-b-0 border-white/10 group">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black uppercase">Platform</h3>
              <span className="font-mono-tech text-[9px] text-[var(--color-neon-purple)]">04</span>
            </div>
            <p className="text-xs text-gray-400 font-calligraphy mb-6">The daily workflow around code quality, deployment, and delivery.</p>
            <div className="flex flex-wrap gap-2 font-mono-tech text-[8px] uppercase tracking-wider">
              {['Git', 'GitHub', 'Supabase', 'Playwright'].map(t => (
                <span key={t} className="border border-white/20 px-2 py-1 rounded-sm">{t}</span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 px-6 md:px-20 border-t border-white/5 relative">
        <div className="flex justify-between font-mono-tech text-[10px] tracking-[0.2em] text-gray-500 mb-16 uppercase">
          <span>004 / EXPERIENCE</span>
          <span className="font-calligraphy text-gray-400 lowercase tracking-normal text-sm">the route so far</span>
        </div>

        <div className="space-y-8 animate-up">
          
          <div className="w-full bg-[#f4f4f0] text-[#0a0a0a] rounded-sm p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group">
            <div className="max-w-2xl z-10">
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">180 MATH LLC</h3>
              <p className="font-calligraphy text-lg text-gray-700 mb-6">Scaled an online math resource platform to 300+ students. Built automated workflows using Playwright and orchestrated data pipelines.</p>
              <div className="flex items-center gap-4 font-mono-tech text-[9px] tracking-widest uppercase">
                <span className="font-bold">Founder & Lead Developer</span>
                <span className="text-gray-400">|</span>
                <span>Storrs, CT</span>
              </div>
            </div>
            <div className="z-10 flex flex-col items-end gap-6 shrink-0">
              <span className="text-3xl md:text-4xl font-bold text-[#0a0a0a]">2023–Present</span>
              <div className="flex gap-2 font-mono-tech text-[8px] uppercase">
                <span className="border border-black/20 px-3 py-1.5 rounded-full">Next.js</span>
                <span className="border border-black/20 px-3 py-1.5 rounded-full">Supabase</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#0d0d0d] border border-white/10 text-white rounded-sm p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-purple)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="max-w-2xl z-10">
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">CIVIL AIR PATROL</h3>
              <p className="font-calligraphy text-lg text-gray-400 mb-6">Led a team of 70+ cadets and directed the High Altitude Balloon Challenge research team, analyzing high-altitude telemetry data.</p>
              <div className="flex items-center gap-4 font-mono-tech text-[9px] tracking-widest uppercase">
                <span className="font-bold text-[var(--color-neon-purple)]">Cadet Chief Master Sgt</span>
                <span className="text-gray-600">|</span>
                <span>NER-CT-071</span>
              </div>
            </div>
            <div className="z-10 flex flex-col items-end gap-6 shrink-0">
              <span className="text-3xl md:text-4xl font-bold text-[var(--color-neon-purple)]">2020–2024</span>
              <div className="flex gap-2 font-mono-tech text-[8px] uppercase">
                <span className="border border-white/20 px-3 py-1.5 rounded-full">Leadership</span>
                <span className="border border-white/20 px-3 py-1.5 rounded-full">Research</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Projects Gallery */}
      <section id="projects" className="py-32 px-6 md:px-20 border-t border-white/5">
        <div className="flex justify-between font-mono-tech text-[10px] tracking-[0.2em] text-gray-500 mb-16 uppercase">
          <span>005 / DEPLOYED_SYSTEMS</span>
          <span className="font-calligraphy text-gray-400 lowercase tracking-normal text-sm">pinned repositories</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-up">
          
          {[
            { name: "antigravity-mobile-ide", desc: "Mobile-first PWA client engineered for orchestrating autonomous AI agent developer workflows.", tags: ["JavaScript"], color: "#f1e05a" },
            { name: "faceless-video-pipeline", desc: "Autonomous video generation and scheduling pipeline integrating Remotion, Gemini API, and YouTube Data.", tags: ["JavaScript"], color: "#f1e05a" },
            { name: "180math", desc: "Full-stack educational platform featuring interactive engines and integrated payment flows.", tags: ["HTML"], color: "#e34c26" },
            { name: "habit-tracker-pwa", desc: "Customizable PWA with schema-driven daily tracking, client-side data persistence, and offline sync.", tags: ["TypeScript"], color: "#3178c6" },
            { name: "routine-streak-pwa", desc: "High-contrast performance optimizer tracking routines via bitmask arithmetic and low-latency calendar.", tags: ["JavaScript"], color: "#f1e05a" },
            { name: "supercommunicators-app", desc: "Python app analyzing communication psychology and conversation dynamics using NLP.", tags: ["Python"], color: "#3572A5" }
          ].map((repo, i) => (
            <div key={i} className="border border-white/10 bg-[#0a0a0a] p-6 hover:box-glow-cyan transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-white/10 rounded-sm flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>
                </div>
                <a href="#" className="font-bold text-[var(--color-neon-cyan)] hover:underline text-sm">{repo.name}</a>
                <span className="ml-auto border border-white/20 text-gray-400 text-[9px] px-1.5 py-0.5 rounded-full font-mono">Public</span>
              </div>
              <p className="text-xs text-gray-400 mb-6 font-calligraphy flex-grow">{repo.desc}</p>
              <div className="flex items-center gap-4 font-mono-tech text-[10px] text-gray-500">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: repo.color}}></div>{repo.tags[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Off-Screen Gallery */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="px-6 md:px-20 flex justify-between font-mono-tech text-[10px] tracking-[0.2em] text-gray-500 mb-16 uppercase">
          <span>006 / OFF-SCREEN</span>
          <span className="font-calligraphy text-gray-400 lowercase tracking-normal text-sm">life beyond the editor</span>
        </div>

        <div className="flex gap-6 px-6 md:px-20 overflow-x-auto pb-8 snap-x w-full">
          {/* Gallery Item 1 */}
          <div className="min-w-[80vw] md:min-w-[40vw] h-[50vh] relative bg-[#111] border border-white/10 shrink-0 snap-center group">
            <img src="https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&q=80&w=1200" alt="Coding" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 left-4 font-mono-tech text-[9px] uppercase tracking-widest bg-black/50 px-2 py-1 backdrop-blur-sm">01 / LOGIC PRO</div>
          </div>
          {/* Gallery Item 2 */}
          <div className="min-w-[80vw] md:min-w-[40vw] h-[50vh] relative bg-[#111] border border-white/10 shrink-0 snap-center group">
            <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1200" alt="Bouldering" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 left-4 font-mono-tech text-[9px] uppercase tracking-widest bg-black/50 px-2 py-1 backdrop-blur-sm">02 / BOULDERING</div>
          </div>
          {/* Gallery Item 3 */}
          <div className="min-w-[80vw] md:min-w-[40vw] h-[50vh] relative bg-[#111] border border-white/10 shrink-0 snap-center group">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" alt="Poker" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 left-4 font-mono-tech text-[9px] uppercase tracking-widest bg-black/50 px-2 py-1 backdrop-blur-sm">03 / GAME THEORY</div>
          </div>
        </div>
      </section>

      {/* Terminal Easter Egg / Footer */}
      <footer className="py-20 px-6 md:px-20 border-t border-white/10 font-mono-tech text-xs text-gray-500 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <p className="text-white mb-2 font-bold tracking-widest text-sm">/SYS/LOCAL/LOGS/INIT.TXT</p>
          <p>SYSTEM READY.</p>
        </div>
        <div className="mt-8 md:mt-0 text-right">
          <a href="mailto:contact@rohankosur.com" className="text-[var(--color-neon-cyan)] hover:text-white transition-colors underline decoration-[var(--color-neon-cyan)]/30 underline-offset-4">ESTABLISH CONNECTION</a>
          <p className="mt-4 opacity-30 text-[8px] uppercase">© {new Date().getFullYear()} ROHAN KOSUR.</p>
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
