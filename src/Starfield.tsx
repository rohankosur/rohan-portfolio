import React, { useEffect, useRef } from 'react';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Stars
    const stars: { x: number; y: number; size: number; alpha: number; speed: number; color: string }[] = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: (Math.random() * 0.04 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        color: Math.random() > 0.4 ? '0, 229, 255' : '255, 0, 127' // Cyberpunk cyan or hot pink
      });
    }

    // Shooting stars
    const shootingStars: { x: number; y: number; length: number; speed: number; angle: number; active: boolean; life: number; color: string }[] = [];
    const spawnShootingStar = () => {
      if (Math.random() > 0.92 && shootingStars.filter(s => s.active).length < 3) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          length: 90 + Math.random() * 160,
          speed: 22 + Math.random() * 16,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
          active: true,
          life: 1.0,
          color: Math.random() > 0.4 ? '0, 229, 255' : '255, 0, 127'
        });
      }
    };

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw static/twinkling stars
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1) {
          star.alpha = 1;
          star.speed = -Math.abs(star.speed);
        } else if (star.alpha < 0.15) {
          star.alpha = 0.15;
          star.speed = Math.abs(star.speed);
        }
        
        // Star Core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        ctx.fill();

        // Star Glow halo
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha * 0.25})`;
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

        const endX = ss.x - Math.cos(ss.angle) * ss.length;
        const endY = ss.y - Math.sin(ss.angle) * ss.length;

        // Outer glow
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(${ss.color}, ${ss.life * 0.25})`;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Core streak
        const gradient = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
        gradient.addColorStop(0.2, `rgba(${ss.color}, ${ss.life * 0.9})`);
        gradient.addColorStop(1, `rgba(${ss.color}, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.016;

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
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
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
