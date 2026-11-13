import { useEffect, useRef } from "react";

/**
 * "Attention field": a sparse grid of token dots behind the hero. The pointer
 * is the query. Nearby dots draw faint attention lines to it, weighted by a
 * Gaussian of distance, and the first four dots, the sinks in the top-left
 * corner, always take a share. It shows the idea behind attention sinks
 * without needing a caption.
 *
 * Canvas 2D, no dependencies. Paused off-screen and in background tabs;
 * a single static frame under prefers-reduced-motion.
 */

type Dot = { x: number; y: number; sink: boolean };

const SPACING = 30;
const SIGMA = 64;
const RADIUS = 190;
const N_SINK = 4;

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function AttentionField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let colors = { line: "18 19 22", accent: "#e0143c" };
    const q = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let lastPointer = -Infinity;
    let visible = true;
    let raf = 0;
    let t0 = performance.now();

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = {
        line: cs.getPropertyValue("--field-line").trim() || "18 19 22",
        accent: cs.getPropertyValue("--accent").trim() || "#e0143c",
      };
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
      dots = [];
      let i = 0;
      for (let y = SPACING / 2; y < h; y += SPACING) {
        for (let x = SPACING / 2; x < w; x += SPACING) {
          const jx = (rand(i * 2 + 1) - 0.5) * 8;
          const jy = (rand(i * 2 + 2) - 0.5) * 8;
          dots.push({ x: x + jx, y: y + jy, sink: false });
          i++;
        }
      }
      // The first tokens in reading order are the sinks.
      for (let k = 0; k < N_SINK && k < dots.length; k++) dots[k].sink = true;
      if (!q.x && !q.y) {
        q.x = target.x = w * 0.72;
        q.y = target.y = h * 0.42;
      }
    };

    const fadeAt = (x: number) => (w < 760 ? 0.38 : 0.16 + 0.84 * smoothstep(w * 0.3, w * 0.78, x));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pointerActive = performance.now() - lastPointer < 2500;
      const r2 = RADIUS * RADIUS;
      const twoSig2 = 2 * SIGMA * SIGMA;

      // Attention weights: Gaussian on distance for neighbours, plus a fixed logit for sinks.
      let total = 0;
      const weights: number[] = new Array(dots.length).fill(0);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (d.sink) {
          weights[i] = 0.55;
          total += weights[i];
          continue;
        }
        const dx = d.x - q.x;
        const dy = d.y - q.y;
        const dd = dx * dx + dy * dy;
        if (dd < r2) {
          weights[i] = Math.exp(-dd / twoSig2);
          total += weights[i];
        }
      }
      const norm = total > 0 ? 1 / total : 0;

      // Lines first, dots on top.
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const wgt = weights[i];
        if (!wgt) continue;
        const d = dots[i];
        const a = Math.min(1, wgt * norm * 6);
        if (d.sink) {
          ctx.strokeStyle = colors.accent;
          ctx.globalAlpha = 0.05 + a * 0.18;
        } else {
          ctx.strokeStyle = `rgb(${colors.line})`;
          ctx.globalAlpha = a * 0.55 * fadeAt(d.x);
        }
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const wgt = weights[i] * norm;
        if (d.sink) {
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = colors.accent;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        const f = fadeAt(d.x);
        ctx.globalAlpha = (0.2 + Math.min(0.8, wgt * 10)) * f;
        ctx.fillStyle = `rgb(${colors.line})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.15 + Math.min(2.4, wgt * 26), 0, Math.PI * 2);
        ctx.fill();
      }

      // The query itself; with a live pointer the laser cursor is the query.
      if (pointerActive) {
        ctx.globalAlpha = 1;
        return;
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      // Without a recent pointer, the query drifts on a slow Lissajous path.
      if (now - lastPointer > 2500) {
        const t = (now - t0) / 1000;
        target.x = w * (0.66 + 0.2 * Math.sin(t * 0.21));
        target.y = h * (0.45 + 0.28 * Math.sin(t * 0.33 + 1.2));
      }
      const k = now - lastPointer < 2500 ? 0.35 : 0.08;
      q.x += (target.x - q.x) * k;
      q.y += (target.y - q.y) * k;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf) return;
      raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      lastPointer = performance.now();
      start();
    };

    readColors();
    layout();
    draw();

    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(host);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(host);

    const mo = new MutationObserver(() => {
      readColors();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onVis = () => {
      if (!document.hidden) {
        t0 = performance.now() - 1;
        start();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    host.addEventListener("pointermove", onPointer);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />;
}
