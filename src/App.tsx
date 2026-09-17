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
    // Custom Cursor
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (cursor && dot) {
      const onMouseMove = (e: MouseEvent) => {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15,
          ease: 'power2.out',
        });
        gsap.to(dot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0,
        });
      };
      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    }
  }, []);

  useEffect(() => {
    // Scroll Animations
    const elements = gsap.utils.toArray('.animate-up');
    elements.forEach((el: any) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[var(--color-neon-purple)] selection:text-white pb-20">
      <Starfield />
      
      {/* Custom Cursor */}
      <div ref={cursorDotRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 glow-cyan"></div>
      <div ref={cursorRef} className="fixed top-0 left-0 w-8 h-8 border border-[var(--color-neon-cyan)] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40 font-mono-tech text-[10px] tracking-[0.2em] text-gray-400 border-b border-white/5 backdrop-blur-md">
        <div className="text-white font-sans text-sm tracking-normal font-bold">Rohan Kosur<span className="text-[var(--color-neon-purple)]">.</span></div>
        <div className="hidden md:flex gap-12">
          <a href="#projects" className="hover:text-white transition-colors">PROJECTS</a>
          <a href="#core" className="hover:text-white transition-colors">CORE</a>
          <a href="#timeline" className="hover:text-white transition-colors">TIMELINE</a>
          <a href="#comm" className="hover:text-white transition-colors">COMM</a>
        </div>
        <div className="flex gap-4 items-center">
          <span>TICK {time}</span>
        </div>
      </nav>

      {/* Top Ticker */}
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
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-32 overflow-hidden">
        {/* Complex 3D Parallax Graphic */}
        <div className="absolute right-[-20%] md:right-[-10%] top-1/4 md:top-1/2 md:-translate-y-1/2 w-[800px] h-[800px] pointer-events-auto opacity-90 z-0 cursor-crosshair">
          <Hero3DCore />
        </div>

        <div className="z-10 animate-up">
          <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase mb-0">
            ROHAN
          </h1>
          <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase text-outline mb-12">
            KOSUR
          </h1>
          
          <div className="max-w-xl border-l border-[var(--color-neon-cyan)]/30 pl-6 relative">
            <div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] glow-cyan"></div>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300">
              architecting resilient infrastructure and <span className="font-calligraphy text-[var(--color-neon-cyan)] glow-cyan">deploying</span> full-stack analytical engines for modern finance.
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-6 md:left-20 font-mono-tech text-[9px] tracking-widest text-gray-500 flex flex-col gap-1">
          <span>STATUS: ACTIVE [UCONN SCHOOL OF BUSINESS]</span>
          <span>INIT: 180 MATH LLC [FOUNDER]</span>
        </div>
      </section>

      {/* About Section */}
      <section id="core" className="py-32 px-6 md:px-20 relative border-t border-white/5">
        <div className="absolute top-0 left-20 w-px h-16 bg-[var(--color-neon-purple)]/50"></div>
        <div className="flex justify-between font-mono-tech text-[10px] tracking-[0.2em] text-gray-500 mb-20 uppercase">
          <span>MODULE: CORE</span>
          <span>/IDENTITY</span>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-8 animate-up">
            <h2 className="text-3xl md:text-5xl font-calligraphy leading-tight text-gray-300">
              Quantitative finance student and full-stack engineer. I engineer solutions spanning <span className="font-sans font-bold text-white tracking-tight">high-performance backends, autonomous workflows,</span> and <span className="font-sans font-bold text-white tracking-tight">interactive client interfaces</span>. My focus is on absolute <span className="text-[var(--color-neon-purple)] glow-purple">reliability</span>, minimizing operational risk, and optimizing logic.
            </h2>
          </div>
          <div className="md:col-span-4 border border-white/10 p-2 relative animate-up group">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-neon-cyan)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[var(--color-neon-purple)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800" alt="Code terminal" className="w-full h-auto grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="mt-4 flex justify-between font-mono-tech text-[8px] tracking-widest text-gray-500">
              <span>IMG_REF_01</span>
              <span>GEO: CT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experience / Works Transition */}
      <section id="timeline" className="py-32 px-6 md:px-20 border-t border-white/5 relative">
        <div className="grid md:grid-cols-2 gap-20 items-end">
          <div className="font-mono-tech text-[10px] uppercase tracking-widest text-gray-400 space-y-6">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>CURRENT</span>
              <span className="text-white">Finance @ UConn</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>ARCHIVE</span>
              <span className="text-white text-right">Founder @ 180 Math LLC<br/>Cadet Chief Master Sgt @ CAP</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>STACK</span>
              <span className="text-[var(--color-neon-cyan)] text-right">React, Next.js, Python, Playwright<br/>Risk Management, Modeling</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>TARGET</span>
              <span className="text-[var(--color-neon-purple)]">Summer / Fall 2027 Co-op</span>
            </div>
          </div>

          <div className="animate-up">
            <h2 className="text-[10vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase">
              DEPLOYED
            </h2>
            <div className="relative">
              <h2 className="text-[10vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase text-outline">
                SYSTEMS
              </h2>
              <span className="absolute top-0 right-0 md:-right-10 text-[var(--color-neon-cyan)] font-mono-tech text-sm glow-cyan">(02)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section id="projects" className="px-6 md:px-20 pb-32">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Project 1 */}
          <div className="border border-white/10 bg-[#0a0a0a] p-8 group hover:border-[var(--color-neon-cyan)]/50 transition-colors relative overflow-hidden animate-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-cyan)]/5 blur-[80px]"></div>
            <div className="flex justify-between font-mono-tech text-[9px] tracking-widest text-gray-500 mb-12 uppercase">
              <span>ID_01 / WORKFLOW</span>
              <span>2024</span>
            </div>
            
            <div className="h-48 flex items-center justify-center mb-12 relative w-full pointer-events-auto">
               <Mini3DNode color="#00f3ff" />
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-[var(--color-neon-cyan)] transition-colors">Habit Tracking PWA</h3>
            <p className="text-sm text-gray-400 font-calligraphy mb-8">Progressive Web App with custom schemas and automated daily logging pipelines.</p>
            
            <div className="flex gap-3 font-mono-tech text-[9px] tracking-wider">
              <span className="border border-white/20 px-2 py-1 rounded-sm">React</span>
              <span className="border border-white/20 px-2 py-1 rounded-sm">PWA</span>
              <span className="border border-white/20 px-2 py-1 rounded-sm text-[var(--color-neon-cyan)] border-[var(--color-neon-cyan)]/30">Automation</span>
            </div>
          </div>

          {/* Project 2 */}
          <div className="border border-white/10 bg-[#0a0a0a] p-8 group hover:border-[var(--color-neon-purple)]/50 transition-colors relative overflow-hidden animate-up md:mt-24">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--color-neon-purple)]/5 blur-[80px]"></div>
            <div className="flex justify-between font-mono-tech text-[9px] tracking-widest text-gray-500 mb-12 uppercase">
              <span>ID_02 / COMPUTE</span>
              <span>2023</span>
            </div>
            
            <div className="h-48 flex items-center justify-center mb-12 relative w-full pointer-events-auto">
               <Mini3DNode color="#b026ff" />
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-[var(--color-neon-purple)] transition-colors">TI-84 Toolchain</h3>
            <p className="text-sm text-gray-400 font-calligraphy mb-8">Custom C and Python infrastructure for advanced statistical processing deployed on embedded hardware.</p>
            
            <div className="flex gap-3 font-mono-tech text-[9px] tracking-wider">
              <span className="border border-white/20 px-2 py-1 rounded-sm">C</span>
              <span className="border border-white/20 px-2 py-1 rounded-sm">Python</span>
              <span className="border border-white/20 px-2 py-1 rounded-sm text-[var(--color-neon-purple)] border-[var(--color-neon-purple)]/30">Statistics</span>
            </div>
          </div>

        </div>
      </section>

      {/* Terminal Easter Egg */}
      <section id="comm" className="py-20 px-6 md:px-20 border-t border-white/10 font-mono-tech text-xs text-gray-500 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <p className="text-white mb-2 font-bold tracking-widest text-sm">/SYS/LOCAL/LOGS/OFF_DUTY.TXT</p>
          <p>→ Bouldering @ UConn Rec</p>
          <p>→ Digital Audio Production (Logic Pro)</p>
          <p>→ No-Stakes Poker Strategy</p>
        </div>
        <div className="mt-8 md:mt-0 text-right">
          <a href="mailto:contact@rohankosur.com" className="text-[var(--color-neon-cyan)] hover:text-white transition-colors underline decoration-[var(--color-neon-cyan)]/30 underline-offset-4">ESTABLISH CONNECTION</a>
          <p className="mt-4 opacity-30 text-[8px] uppercase">© {new Date().getFullYear()} ROHAN KOSUR. SYSTEM SECURE.</p>
        </div>
      </section>

      {/* Global CSS for Marquee inline definition to ensure it works */}
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
