import { useEffect, useRef } from "react";

/**
 * Energy-blade cursor. The blade's tip is the click point; the blade trails
 * behind it and swings with the pointer's velocity, leaving a short motion
 * arc. It flares over anything clickable and throws sparks on click. Only for
 * fine pointers (mouse, trackpad, pen); the native cursor is hidden only while
 * this is active, so the page never loses its cursor if JavaScript fails.
 */

const INTERACTIVE = "a, button, summary, input, select, textarea, label, [role='button'], [tabindex]:not([tabindex='-1'])";
const BLADE = 34;
const HILT = 11;
const REST_ANGLE = Math.PI * 0.3; // blade points down-right from the tip, like an arrow cursor
const ARC_MS = 110;

type Seg = { tx: number; ty: number; bx: number; by: number; t: number };
type Spark = { x: number; y: number; vx: number; vy: number; t: number };

export function Lightsaber() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("saber");

    let w = 0;
    let h = 0;
    let color = "#e0143c";
    let tip: { x: number; y: number } | null = null;
    let lastMove = 0;
    let vx = 0;
    let vy = 0;
    let angle = REST_ANGLE;
    let length = 0; // ignites from 0
    let hover = 0;
    let hoverTarget = 0;
    let visible = false;
    let arc: Seg[] = [];
    let sparks: Spark[] = [];
    let raf = 0;
    let prevT = performance.now();

    const readColor = () => {
      color = getComputedStyle(root).getPropertyValue("--accent").trim() || color;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const line = (x1: number, y1: number, x2: number, y2: number, width: number, style: string, alpha: number, blur = 0) => {
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.strokeStyle = style;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const draw = (now: number): boolean => {
      const dt = Math.min(0.05, (now - prevT) / 1000);
      prevT = now;
      ctx.clearRect(0, 0, w, h);
      if (!tip || !visible) return false;

      // Ease toward targets.
      const targetLen = BLADE + hover * 6;
      length += (targetLen - length) * (reduced ? 1 : Math.min(1, dt * 14));
      hover += (hoverTarget - hover) * (reduced ? 1 : Math.min(1, dt * 12));
      vx *= 0.86;
      vy *= 0.86;
      // The blade trails the motion: moving right swings the base left, and so on.
      const swing = reduced ? 0 : Math.max(-0.9, Math.min(0.9, vx * -0.0016 + vy * 0.0009));
      const targetAngle = REST_ANGLE - swing;
      angle += (targetAngle - angle) * (reduced ? 1 : Math.min(1, dt * 16));

      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const bx = tip.x + ux * length;
      const by = tip.y + uy * length;

      ctx.lineCap = "round";

      // Motion arc: recent blade positions as fading translucent quads.
      if (!reduced) {
        arc.push({ tx: tip.x, ty: tip.y, bx, by, t: now });
        arc = arc.filter((s) => now - s.t < ARC_MS);
        for (let i = 1; i < arc.length; i++) {
          const a = arc[i - 1];
          const b = arc[i];
          const life = 1 - (now - b.t) / ARC_MS;
          ctx.globalAlpha = life * 0.22;
          ctx.fillStyle = color;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.moveTo(a.tx, a.ty);
          ctx.lineTo(a.bx, a.by);
          ctx.lineTo(b.bx, b.by);
          ctx.lineTo(b.tx, b.ty);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Blade: outer glow, colored body, hot white core. A subtle flicker.
      const flicker = reduced ? 1 : 0.9 + Math.random() * 0.1;
      const glow = (0.35 + hover * 0.25) * flicker;
      line(tip.x, tip.y, bx, by, 8 + hover * 3, color, glow, 18);
      line(tip.x, tip.y, bx, by, 4, color, 0.95, 9);
      line(tip.x, tip.y, bx, by, 1.6, "#ffffff", 0.95);

      // Hilt: emitter ring, grip, pommel.
      const hx = bx + ux * HILT;
      const hy = by + uy * HILT;
      ctx.shadowBlur = 0;
      line(bx, by, hx, hy, 4.5, "#9aa1ad", 1);
      line(bx + ux * 3, by + uy * 3, bx + ux * 8, by + uy * 8, 5, "#2a2f38", 1);
      line(bx, by, bx + ux * 1.2, by + uy * 1.2, 5.5, "#c9ced6", 1);

      // Sparks from clicks.
      sparks = sparks.filter((s) => now - s.t < 380);
      for (const s of sparks) {
        const k = (now - s.t) / 380;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 600 * dt;
        line(s.x, s.y, s.x - s.vx * 0.012, s.y - s.vy * 0.012, 1.6, k < 0.3 ? "#ffffff" : color, 1 - k, 8);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Keep animating while moving, settling, flickering on hover, or sparking.
      const settling = Math.abs(targetAngle - angle) > 0.003 || Math.abs(targetLen - length) > 0.3;
      return settling || arc.length > 1 || sparks.length > 0 || hover > 0.02 || now - lastMove < 1200;
    };

    const loop = (now: number) => {
      raf = 0;
      if (draw(now)) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) {
        prevT = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      if (tip && now - lastMove < 100) {
        const dtm = Math.max(1, now - lastMove) / 1000;
        vx = vx * 0.5 + ((e.clientX - tip.x) / dtm) * 0.5;
        vy = vy * 0.5 + ((e.clientY - tip.y) / dtm) * 0.5;
      }
      tip = { x: e.clientX, y: e.clientY };
      lastMove = now;
      visible = true;
      const el = e.target instanceof Element ? e.target : null;
      hoverTarget = el?.closest(INTERACTIVE) ? 1 : 0;
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || reduced) return;
      const now = performance.now();
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 140 + Math.random() * 260;
        sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, t: now });
      }
      kick();
    };
    const onScroll = () => {
      if (!tip || !visible) return;
      const el = document.elementFromPoint(tip.x, tip.y);
      hoverTarget = el?.closest(INTERACTIVE) ? 1 : 0;
      kick();
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        visible = false;
        arc = [];
        kick();
      }
    };
    const onBlur = () => {
      visible = false;
      kick();
    };

    readColor();
    resize();
    const mo = new MutationObserver(() => {
      readColor();
      kick();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("blur", onBlur);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("saber");
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return <canvas ref={ref} className="laser-canvas" aria-hidden="true" />;
}
