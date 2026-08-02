"use client";
import { useEffect, useRef } from "react";

// One restrained backdrop: slow-drifting gold dust motes on a 2D canvas.
// Sits behind content, pointer-events:none, capped DPR, paused under reduced motion.
export default function GoldDust() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, last = 0;
    type Mote = { x: number; y: number; r: number; a: number; vy: number; vx: number; tw: number };
    let motes: Mote[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const build = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.round((w * h) / 26000));
      motes = Array.from({ length: count }, () => ({
        x: rand(0, w), y: rand(0, h), r: rand(0.5, 2.1),
        a: rand(0.05, 0.5), vy: rand(-6, -2), vx: rand(-2, 2), tw: rand(0, Math.PI * 2),
      }));
    };
    const draw = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016; last = t;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y += m.vy * dt; m.x += m.vx * dt; m.tw += dt * 1.4;
        if (m.y < -4) { m.y = h + 4; m.x = rand(0, w); }
        if (m.x < -4) m.x = w + 4; else if (m.x > w + 4) m.x = -4;
        const alpha = m.a * (0.55 + 0.45 * Math.sin(m.tw));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    build();
    raf = requestAnimationFrame(draw);
    let to: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(to); to = setTimeout(build, 200); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); clearTimeout(to); };
  }, []);
  return <canvas ref={ref} className="gold-dust" aria-hidden="true" />;
}
