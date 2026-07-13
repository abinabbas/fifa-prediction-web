"use client";

import { useEffect, useRef } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;       // current rotation degrees
  rotSpeed: number;  // degrees per frame
  alpha: number;     // 0→1→0 fade
  life: number;      // frames elapsed
  maxLife: number;   // total frames before removal
}

const BALL_EMOJI = "⚽";
const FONT_BASE  = 28; // px — rendered size of emoji

function makeBall(W: number, H: number): Ball {
  const fromLeft = Math.random() > 0.5;
  const r        = FONT_BASE / 2;
  const speed    = 3.5 + Math.random() * 3;
  const angle    = (Math.random() * 40 - 20) * (Math.PI / 180); // ±20° off horizontal

  return {
    x:        fromLeft ? -r * 2 : W + r * 2,
    y:        H * (0.1 + Math.random() * 0.8),
    vx:       fromLeft ? speed * Math.cos(angle) : -speed * Math.cos(angle),
    vy:       speed * Math.sin(angle),
    r,
    rot:      Math.random() * 360,
    rotSpeed: (fromLeft ? 4 : -4) + (Math.random() * 4 - 2),
    alpha:    0,
    life:     0,
    maxLife:  90 + Math.floor(Math.random() * 60), // 1.5–2.5s at 60fps
  };
}

export function FootballAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef  = useRef<Ball[]>([]);
  const frameRef  = useRef<number>(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── resize handler ── */
    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* ── spawn on scroll ── */
    function onScroll() {
      const dy = Math.abs(window.scrollY - lastScrollY.current);
      lastScrollY.current = window.scrollY;
      if (dy > 40 && ballsRef.current.length < 6) {
        ballsRef.current.push(makeBall(canvas!.width, canvas!.height));
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── spawn randomly every 3–6s ── */
    let autoTimer: ReturnType<typeof setTimeout>;
    function scheduleAuto() {
      autoTimer = setTimeout(() => {
        if (ballsRef.current.length < 5) {
          ballsRef.current.push(makeBall(canvas!.width, canvas!.height));
        }
        scheduleAuto();
      }, 3000 + Math.random() * 3000);
    }
    scheduleAuto();

    /* ── spawn one immediately on mount ── */
    setTimeout(() => {
      ballsRef.current.push(makeBall(canvas!.width, canvas!.height));
    }, 600);

    /* ── draw loop ── */
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width;
      const H = canvas.height;

      ballsRef.current = ballsRef.current.filter((b) => b.life < b.maxLife);

      for (const b of ballsRef.current) {
        b.life++;
        b.x  += b.vx;
        b.y  += b.vy;
        b.rot += b.rotSpeed;

        /* bounce off top/bottom */
        if (b.y - b.r < 0)  { b.y = b.r;      b.vy = Math.abs(b.vy); }
        if (b.y + b.r > H)  { b.y = H - b.r;  b.vy = -Math.abs(b.vy); }

        /* fade in first 15 frames, fade out last 20 */
        const fadeIn  = Math.min(b.life / 15, 1);
        const fadeOut = Math.min((b.maxLife - b.life) / 20, 1);
        b.alpha = fadeIn * fadeOut;

        ctx.save();
        ctx.globalAlpha = b.alpha * 0.82;
        ctx.translate(b.x, b.y);
        ctx.rotate((b.rot * Math.PI) / 180);
        ctx.font        = `${FONT_BASE * 2}px serif`;
        ctx.textAlign   = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(BALL_EMOJI, 0, 0);
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(draw);
    }
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(autoTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
