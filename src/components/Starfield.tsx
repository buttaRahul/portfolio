import { useEffect, useRef } from "react";

/**
 * Deep-space starfield behind the hero. Stars fly slowly toward the viewer
 * from a vanishing point that shifts with the pointer (parallax). A
 * `hyperspace` window event ramps the speed up so stars stretch into streaks,
 * then eases back. Canvas 2D, paused off-screen and in background tabs; a
 * single static frame under prefers-reduced-motion.
 */

export const HYPERSPACE_EVENT = "hyperspace";

type Star = { x: number; y: number; z: number; pz: number; tint: number };

const IDLE_SPEED = 0.045; // depth units per second
const JUMP_SPEED = 1.6;
const DEPTH = 1;

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let speed = IDLE_SPEED;
    let jumpUntil = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();
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
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(900, (w * h) / 1500));
      stars = Array.from({ length: count }, () => {
        const s = { x: 0, y: 0, z: 0, pz: 0, tint: 0 };
        spawn(s, false);
        return s;
      });
      vp.x = vpTarget.x = w * 0.66;
      vp.y = vpTarget.y = h * 0.42;
    };

    const project = (s: Star, z: number) => {
      const f = Math.min(w, h) * 0.55;
      return { x: vp.x + (s.x / z) * f, y: vp.y + (s.y / z) * f };
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const streak = Math.min(1, (speed - IDLE_SPEED) / (JUMP_SPEED - IDLE_SPEED));
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
        const alpha = Math.min(1, 0.15 + near * 1.1);
        // Mostly white, a few blue-ish and warm stars.
        const col = s.tint > 0.92 ? "170 200 255" : s.tint < 0.05 ? "255 205 190" : "255 255 255";
        if (streak > 0.05) {
          const q = project(s, Math.min(DEPTH, s.pz + streak * 0.08));
          ctx.strokeStyle = `rgb(${col} / ${alpha})`;
          ctx.lineWidth = 0.6 + near * 1.6;
          ctx.beginPath();
          ctx.moveTo(q.x, q.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgb(${col} / ${alpha})`;
          const r = 0.35 + near * near * 1.7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const targetSpeed = now < jumpUntil ? JUMP_SPEED : IDLE_SPEED;
      speed += (targetSpeed - speed) * (targetSpeed > speed ? 0.08 : 0.04);
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
      const rect = host.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      // Parallax: the vanishing point drifts against the pointer.
      vpTarget.x = w * (0.66 - px * 0.08);
      vpTarget.y = h * (0.42 - py * 0.08);
    };

    const onJump = () => {
      if (reduced) return;
      jumpUntil = performance.now() + 650;
      start();
    };

    layout();
    if (reduced) draw(0);
    else start();

    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) draw(0);
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);
    host.addEventListener("pointermove", onPointer);
    window.addEventListener(HYPERSPACE_EVENT, onJump);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onPointer);
      window.removeEventListener(HYPERSPACE_EVENT, onJump);
    };
  }, []);

  return <canvas ref={ref} className="hero-field" aria-hidden="true" />;
}
