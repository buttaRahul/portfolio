import { useEffect, useRef } from "react";

/**
 * Site-wide deep-space background: a fixed 3D starfield behind every page.
 * Stars fly slowly toward the viewer from a vanishing point that shifts with
 * the pointer (parallax), speeds up while scrolling, dims behind the text column; a `hyperspace`
 * window event stretches them into streaks. Paused in background tabs; one
 * static frame under prefers-reduced-motion.
 */

export const HYPERSPACE_EVENT = "hyperspace";

type Star = { x: number; y: number; z: number; pz: number; tint: number; /** 0..1: low values are hidden behind text */ keep: number };

const IDLE_SPEED = 0.03; // depth units per second: slow enough not to pull the eye
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
    let jumpUntil = 0;
    let boost = 0;
    let lastScroll = window.scrollY;
    let raf = 0;
    let last = performance.now();
    // The text column (from the first .wrap) gets a calm zone with dimmed stars.
    let colL = 0;
    let colR = 0;
    const vp = { x: 0, y: 0 };
    // Dark: white stars with a few blue and warm ones. Light: ink particles with blue and crimson.
    let palette = { base: "255 255 255", cool: "170 200 255", warm: "255 205 190", gain: 1 };
    const readTheme = () => {
      const light = document.documentElement.dataset.theme === "light";
      palette = light
        ? { base: "20 28 45", cool: "47 98 217", warm: "224 20 60", gain: 0.55 }
        : { base: "255 255 255", cool: "170 200 255", warm: "255 205 190", gain: 1 };
    };
    const vpTarget = { x: 0, y: 0 };

    const spawn = (s: Star, far: boolean) => {
      s.x = (Math.random() * 2 - 1) * 1.6;
      s.y = (Math.random() * 2 - 1) * 1.1;
      s.z = far ? DEPTH * (0.6 + Math.random() * 0.4) : Math.random() * DEPTH;
      s.pz = s.z;
      s.tint = Math.random();
      s.keep = Math.random();
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
      const count = Math.round(Math.min(600, (w * h) / 2400));
      const wrap = document.querySelector(".wrap");
      const rect = wrap?.getBoundingClientRect();
      colL = rect ? rect.left : w * 0.12;
      colR = rect ? rect.right : w * 0.88;
      stars = Array.from({ length: count }, () => {
        const s = { x: 0, y: 0, z: 0, pz: 0, tint: 0, keep: 0 };
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
      // Near full strength over the hero; calmer once the reader is in the content.
      const calmMin = window.scrollY < h * 0.6 ? 0.85 : 0.6;
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
        // Dim stars that pass behind the text column, with soft 80px edges.
        const edge = Math.min(p.x - colL, colR - p.x);
        // Behind the text column only about a third of the stars are drawn
        // (more over the hero), fading in toward the column edges.
        const inside = edge <= 0 ? 0 : Math.min(1, edge / 80);
        const share = window.scrollY < h * 0.6 ? 0.5 : 0.33;
        if (inside > 0 && s.keep > share + (1 - share) * (1 - inside)) continue;
        const calm = edge <= 0 ? 1 : edge >= 80 ? calmMin : 1 - (edge / 80) * (1 - calmMin);
        const alpha = Math.min(0.8, 0.12 + near * 0.85) * calm * palette.gain;
        const col = s.tint > 0.92 ? palette.cool : s.tint < 0.05 ? palette.warm : palette.base;
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
          const r = 0.35 + near * near * 1.3;
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
      // Scrolling flies the ship forward: speed rises with scroll velocity, then eases off.
      const y = window.scrollY;
      boost = Math.min(0.42, boost + Math.abs(y - lastScroll) * 0.001);
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

    readTheme();
    layout();
    if (reduced) draw(0);
    else start();
    const mo = new MutationObserver(() => {
      readTheme();
      if (reduced) draw(0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onVis = () => !document.hidden && start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener(HYPERSPACE_EVENT, onJump);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener(HYPERSPACE_EVENT, onJump);
    };
  }, []);

  return <canvas ref={ref} className="space-field" aria-hidden="true" />;
}
