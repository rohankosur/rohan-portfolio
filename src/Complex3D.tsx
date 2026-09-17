import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Complex3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth) - 0.5; // -0.5 to 0.5
      const yPos = (clientY / window.innerHeight) - 0.5;

      // Animate layers at different rates and axes based on cursor position
      gsap.to('.layer-1', { rotationY: xPos * 30, rotationX: -yPos * 30, duration: 1, ease: 'power2.out' });
      gsap.to('.layer-2', { rotationY: xPos * 60, rotationX: -yPos * 60, x: xPos * 40, y: yPos * 40, duration: 1.5, ease: 'power2.out' });
      gsap.to('.layer-3', { rotationY: xPos * -45, rotationX: yPos * -45, x: xPos * -30, y: yPos * -30, duration: 2, ease: 'power2.out' });
      gsap.to('.layer-4', { rotationZ: xPos * 90, rotationX: yPos * 90, duration: 2.5, ease: 'power2.out' });
      gsap.to('.layer-5', { x: xPos * 80, y: yPos * 80, duration: 0.8, ease: 'back.out(1.7)' });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative perspective-[1200px]">
      <div className="relative w-80 h-80 preserve-3d">
        
        {/* Layer 1: Outer glowing ring */}
        <div className="layer-1 absolute inset-[-10%] border-2 border-[var(--color-neon-purple)]/30 rounded-full shadow-[0_0_40px_rgba(176,38,255,0.2)]"></div>
        
        {/* Layer 2: Intersecting dashed geometry */}
        <div className="layer-2 absolute inset-0 border border-[var(--color-neon-cyan)]/50 rounded-full border-dashed shadow-[0_0_20px_rgba(0,243,255,0.3)] flex items-center justify-center">
            <div className="w-full h-full animate-[spin_15s_linear_infinite] border-t-2 border-b-2 border-[var(--color-neon-cyan)] rounded-full opacity-60"></div>
        </div>

        {/* Layer 3: Central polyhedrons & core */}
        <div className="layer-3 absolute inset-10 bg-gradient-to-tr from-[var(--color-neon-purple)]/20 to-[var(--color-neon-cyan)]/20 rounded-lg blur-md rotate-45 mix-blend-screen"></div>
        <div className="layer-3 absolute inset-16 border border-white/40 rounded-sm rotate-45 flex items-center justify-center backdrop-blur-sm shadow-inner">
            <div className="absolute inset-2 border border-[var(--color-neon-cyan)]/40 -rotate-45"></div>
            <div className="w-3 h-3 bg-white rounded-full glow-cyan animate-pulse shadow-[0_0_15px_#fff]"></div>
        </div>

        {/* Layer 4: Orbital tracker lines */}
        <div className="layer-4 absolute inset-[-30%] border border-white/5 rounded-full flex items-center justify-center">
            <div className="absolute top-0 w-4 h-4 bg-[var(--color-neon-cyan)] rounded-full glow-cyan shadow-[0_0_20px_var(--color-neon-cyan)]"></div>
            <div className="absolute bottom-1/4 -left-2 w-2 h-2 bg-[var(--color-neon-purple)] rounded-full glow-purple"></div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-neon-cyan)]/30 to-transparent absolute"></div>
            <div className="h-full w-px bg-gradient-to-b from-transparent via-[var(--color-neon-purple)]/30 to-transparent absolute"></div>
        </div>

        {/* Layer 5: Floating HUD elements */}
        <div className="layer-5 absolute -right-20 top-10 flex flex-col gap-1 font-mono-tech text-[8px] text-[var(--color-neon-cyan)] opacity-70">
            <span>SYS.CORE.ACTIVE</span>
            <span>T={'{'}XYZ_992{'}'}</span>
            <div className="h-px w-12 bg-[var(--color-neon-cyan)]/50 mt-1"></div>
        </div>

      </div>
    </div>
  );
};

export default Complex3D;
