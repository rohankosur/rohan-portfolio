import React, { useEffect, useRef } from 'react';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Stars
    const stars: { x: number; y: number; size: number; alpha: number; speed: number; color: string }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5,
        alpha: Math.random(),
        speed: Math.random() * 0.05,
        color: Math.random() > 0.5 ? '0, 229, 255' : '255, 0, 255' // Cyberpunk cyan or magenta
      });
    }

    // Shooting stars
    const shootingStars: { x: number; y: number; length: number; speed: number; angle: number; active: boolean; life: number; color: string }[] = [];
    const spawnShootingStar = () => {
      // Increased frequency slightly
      if (Math.random() > 0.90 && shootingStars.filter(s => s.active).length < 3) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          length: 80 + Math.random() * 150,
          speed: 20 + Math.random() * 15,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1), // roughly 45 degrees downwards
          active: true,
          life: 1.0,
          color: Math.random() > 0.5 ? '0, 229, 255' : '255, 0, 255' // Cyberpunk cyan or magenta
        });
      }
    };

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw static/twinkling stars
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed *= -1;
        
        // Core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        ctx.fill();

        // Fake glow (much faster than shadowBlur)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha * 0.2})`;
        ctx.fill();
      });

      // Handle shooting stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (!ss.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
        
        // Outer glow (faked)
        ctx.strokeStyle = `rgba(${ss.color}, ${ss.life * 0.2})`;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Core streak
        const gradient = ctx.createLinearGradient(ss.x, ss.y, ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
        gradient.addColorStop(0, `rgba(${ss.color}, ${ss.life})`);
        gradient.addColorStop(1, `rgba(${ss.color}, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.015; // Fade out

        if (ss.life <= 0 || ss.x > width || ss.y > height) {
          ss.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default Starfield;
