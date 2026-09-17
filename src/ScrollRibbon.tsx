import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRibbon() {
  const svgRef = useRef<SVGSVGElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const path3Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const paths = [path1Ref.current, path2Ref.current, path3Ref.current];

    paths.forEach((path) => {
      if (!path) return;
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
          scrub: 2,
        },
      });
    });
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full pointer-events-none z-[1]"
      style={{ height: '100%', minHeight: '100vh' }}
    >
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 0.5, mixBlendMode: 'screen' }}
      >
        <defs>
          <linearGradient id="rg1" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#b026ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#00f3ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#39d353" stopOpacity="0.3" />
          </linearGradient>
          <filter id="rglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b1" />
            <feGaussianBlur stdDeviation="0.5" result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wide glow halo */}
        <path
          ref={path1Ref}
          d="M 12,-5 C 35,15 8,35 50,50 C 92,65 65,80 88,105"
          fill="none"
          stroke="url(#rg1)"
          strokeWidth="6"
          filter="url(#rglow)"
          opacity="0.4"
        />

        {/* Mid stroke */}
        <path
          ref={path2Ref}
          d="M 12,-5 C 35,15 8,35 50,50 C 92,65 65,80 88,105"
          fill="none"
          stroke="url(#rg1)"
          strokeWidth="1.5"
          filter="url(#rglow)"
          opacity="0.7"
        />

        {/* Bright core line */}
        <path
          ref={path3Ref}
          d="M 12,-5 C 35,15 8,35 50,50 C 92,65 65,80 88,105"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.15"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
