import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollRibbon: React.FC = () => {
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const path3Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const paths = [path1Ref.current, path2Ref.current, path3Ref.current];
    
    paths.forEach((path) => {
      if (path) {
        const length = path.getTotalLength();
        
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          }
        });
      }
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-60 mix-blend-screen">
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b026ff" />
            <stop offset="40%" stopColor="#00f3ff" />
            <stop offset="100%" stopColor="#39d353" />
          </linearGradient>
          <linearGradient id="ribbonGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f3ff" />
            <stop offset="100%" stopColor="#39d353" />
          </linearGradient>
          <filter id="glowRibbon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" result="blur1" />
            <feGaussianBlur stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Thick blurry background stroke */}
        <path
          ref={path1Ref}
          d="M 100,-100 C 600,200 900,600 200,1100"
          fill="none"
          stroke="url(#ribbonGrad1)"
          strokeWidth="80"
          filter="url(#glowRibbon)"
          opacity="0.3"
        />
        
        {/* Medium semi-transparent stroke */}
        <path
          ref={path2Ref}
          d="M 100,-100 C 600,200 900,600 200,1100"
          fill="none"
          stroke="url(#ribbonGrad1)"
          strokeWidth="20"
          filter="url(#glowRibbon)"
          opacity="0.6"
        />

        {/* Thin bright core stroke */}
        <path
          ref={path3Ref}
          d="M 100,-100 C 600,200 900,600 200,1100"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.9"
        />
        
        {/* Additional intersecting ribbon */}
        <path
          d="M 900,-100 C 200,300 100,700 800,1200"
          fill="none"
          stroke="url(#ribbonGrad2)"
          strokeWidth="40"
          filter="url(#glowRibbon)"
          opacity="0.15"
        />
      </svg>
    </div>
  );
};

export default ScrollRibbon;
