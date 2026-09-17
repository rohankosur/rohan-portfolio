import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRibbon() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('path');
    
    if (paths) {
      paths.forEach((path, i) => {
        const len = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1 + (i * 0.2), // Parallax draw speed per path
          },
        });
      });
      
      // Color shift animation
      gsap.to(svgRef.current, {
        filter: "hue-rotate(360deg)",
        ease: "none",
        duration: 15,
        repeat: -1
      });
    }
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full pointer-events-none z-0"
      style={{ height: '100%', minHeight: '100vh', opacity: 0.6 }}
    >
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ mixBlendMode: 'screen' }}
      >
        <defs>
          <linearGradient id="rg1" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#00ffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="rg2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.6" />
          </linearGradient>
          <filter id="rglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="b1" />
            <feGaussianBlur stdDeviation="0.5" result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background thick glows */}
        <path d="M 0,-10 C 70,20 -20,40 60,60 C 120,80 20,95 110,110" fill="none" stroke="url(#rg1)" strokeWidth="6" filter="url(#rglow)" opacity="0.3" />
        <path d="M 100,-10 C -20,20 120,50 40,70 C -40,90 80,100 -10,110" fill="none" stroke="url(#rg2)" strokeWidth="5" filter="url(#rglow)" opacity="0.3" />
        
        {/* Core mid-strokes */}
        <path d="M 0,-10 C 70,20 -20,40 60,60 C 120,80 20,95 110,110" fill="none" stroke="url(#rg1)" strokeWidth="1" filter="url(#rglow)" opacity="0.8" />
        <path d="M 100,-10 C -20,20 120,50 40,70 C -40,90 80,100 -10,110" fill="none" stroke="url(#rg2)" strokeWidth="1" filter="url(#rglow)" opacity="0.8" />
        
        {/* Intense white cores */}
        <path d="M 0,-10 C 70,20 -20,40 60,60 C 120,80 20,95 110,110" fill="none" stroke="#ffffff" strokeWidth="0.15" opacity="0.9" />
        <path d="M 100,-10 C -20,20 120,50 40,70 C -40,90 80,100 -10,110" fill="none" stroke="#ffffff" strokeWidth="0.15" opacity="0.9" />
      </svg>
    </div>
  );
}
