import { useEffect, useRef } from "react";

/**
 * Site-wide deep-space background: a fixed 3D starfield behind every page.
 * Stars fly slowly toward the viewer from a vanishing point that shifts with
 * the pointer (parallax); scrolling briefly speeds them up, and a `hyperspace`
 * window event stretches them into streaks. Paused in background tabs; one
 * static frame under prefers-reduced-motion.
 */

export const HYPERSPACE_EVENT = "hyperspace";

type Star = { x: number; y: number; z: number; pz: number; tint: number };

const IDLE_SPEED = 0.04; // depth units per second
const JUMP_SPEED = 1.6;
const DEPTH = 1;

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let speed = IDLE_SPEED;
    let boost = 0;
    let jumpUntil = 0;
    let raf = 0;
    let last = performance.now();
    let lastScroll = window.scrollY;
    const vp = { x: 0, y: 0 };
    const vpTarget = { x: 0, y: 0 };

    const spawn = (s: Star, far: boolean) => {
      s.x = (Math.random() * 2 - 1) * 1.6;
      s.y = (Math.random() * 2 - 1) * 1.1;
      s.z = far ? DEPTH * (0.6 + Math.random() * 0.4) : Math.random() * DEPTH;
      s.pz = s.z;
      s.tint = Math.random();
    };

    const layout = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Sparse enough that body text stays easy to read on top.
      const count = Math.round(Math.min(700, (w * h) / 2100));
      stars = Array.from({ length: count }, () => {
        const s = { x: 0, y: 0, z: 0, pz: 0, tint: 0 };
        spawn(s, false);
        return s;
      });
      vp.x = vpTarget.x = w * 0.62;
      vp.y = vpTarget.y = h * 0.4;
    };

    const project = (s: Star, z: number) => {
      const f = Math.min(w, h) * 0.55;
      return { x: vp.x + (s.x / z) * f, y: vp.y + (s.y / z) * f };
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const streak = Math.min(1, Math.max(0, (speed - IDLE_SPEED) / (JUMP_SPEED - IDLE_SPEED)));
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed * dt;
        if (s.z <= 0.02) {
          spawn(s, true);
          continue;
        }
        const p = project(s, s.z);
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          spawn(s, true);
          continue;
        }
        const near = 1 - s.z / DEPTH;
        const alpha = Math.min(0.85, 0.12 + near * 0.95);
        const col = s.tint > 0.92 ? "170 200 255" : s.tint < 0.05 ? "255 205 190" : "255 255 255";
        if (streak > 0.04) {
          const q = project(s, Math.min(DEPTH, s.pz + streak * 0.08));
          ctx.strokeStyle = `rgb(${col} / ${alpha})`;
          ctx.lineWidth = 0.6 + near * 1.5;
          ctx.beginPath();
          ctx.moveTo(q.x, q.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgb(${col} / ${alpha})`;
          const r = 0.35 + near * near * 1.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const y = window.scrollY;
      boost = Math.min(0.5, boost + Math.abs(y - lastScroll) * 0.0012);
      lastScroll = y;
      boost *= 0.9;
      const targetSpeed = (now < jumpUntil ? JUMP_SPEED : IDLE_SPEED) + boost;
      speed += (targetSpeed - speed) * (targetSpeed > speed ? 0.1 : 0.05);
      vp.x += (vpTarget.x - vp.x) * 0.05;
      vp.y += (vpTarget.y - vp.y) * 0.05;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      const px = e.clientX / w - 0.5;
      const py = e.clientY / h - 0.5;
      vpTarget.x = w * (0.62 - px * 0.08);
      vpTarget.y = h * (0.4 - py * 0.08);
    };

    const onJump = () => {
      if (reduced) return;
      jumpUntil = performance.now() + 650;
      start();
    };

    const onResize = () => {
      layout();
      if (reduced) draw(0);
    };

    layout();
    if (reduced) draw(0);
    else start();

    const onVis = () => !document.hidden && start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener(HYPERSPACE_EVENT, onJump);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener(HYPERSPACE_EVENT, onJump);
    };
  }, []);

  return <canvas ref={ref} className="space-field" aria-hidden="true" />;
}
