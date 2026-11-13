import { useEffect, useRef } from "react";

/**
 * Laser-pointer cursor: a glowing dot with a short fading trail, a ring over
 * anything clickable, and a pulse on click. Only for fine pointers (mouse,
 * trackpad, pen); touch devices keep their default behaviour. The native
 * cursor is hidden only while this component is mounted and active, so the
 * page never loses its cursor if JavaScript fails.
 */

const TRAIL_MS = 160;
const INTERACTIVE = "a, button, summary, input, select, textarea, label, [role='button'], [tabindex]:not([tabindex='-1'])";

type P = { x: number; y: number; t: number };

export function LaserPointer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("laser");

    let w = 0;
    let h = 0;
    let accent = "#e0143c";
    const trail: P[] = [];
    let pos: P | null = null;
    let visible = false;
    let hover = 0; // animated 0..1
    let hoverTarget = 0;
    let pulses: { x: number; y: number; t: number }[] = [];
    let raf = 0;

    const readAccent = () => {
      accent = getComputedStyle(root).getPropertyValue("--accent").trim() || accent;
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

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      if (!pos || !visible) return false;

      // Drop old trail points.
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
      hover += (hoverTarget - hover) * (reduced ? 1 : 0.25);
      pulses = pulses.filter((p) => now - p.t < 420);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;

      // Trail: tapering, fading segments with a soft glow.
      if (!reduced && trail.length > 1) {
        ctx.shadowColor = accent;
        ctx.shadowBlur = 10;
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1];
          const b = trail[i];
          const life = 1 - (now - b.t) / TRAIL_MS;
          if (life <= 0) continue;
          ctx.globalAlpha = life * 0.55;
          ctx.lineWidth = 0.6 + life * 3.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Click pulses.
      for (const p of pulses) {
        const k = (now - p.t) / 420;
        ctx.shadowBlur = 0;
        ctx.globalAlpha = (1 - k) * 0.6;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 + k * 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Hover ring.
      if (hover > 0.02) {
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.55 * hover;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 8 + hover * 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      // The dot: glow, then a hot white core.
      ctx.shadowColor = accent;
      ctx.shadowBlur = 16;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4.5 - hover * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Keep animating while anything is still moving or fading.
      return trail.length > 1 || pulses.length > 0 || Math.abs(hoverTarget - hover) > 0.01;
    };

    const loop = (now: number) => {
      raf = 0;
      if (draw(now)) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      pos = { x: e.clientX, y: e.clientY, t: now };
      trail.push(pos);
      visible = true;
      const el = e.target instanceof Element ? e.target : null;
      hoverTarget = el?.closest(INTERACTIVE) ? 1 : 0;
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || reduced) return;
      pulses.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      kick();
    };
    // Scrolling moves content under a still pointer: re-check what it is over.
    const onScroll = () => {
      if (!pos || !visible) return;
      const el = document.elementFromPoint(pos.x, pos.y);
      const next = el?.closest(INTERACTIVE) ? 1 : 0;
      if (next !== hoverTarget) {
        hoverTarget = next;
        kick();
      }
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        visible = false;
        trail.length = 0;
        kick();
      }
    };
    const onBlur = () => {
      visible = false;
      kick();
    };

    readAccent();
    resize();
    const mo = new MutationObserver(() => {
      readAccent();
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
      root.classList.remove("laser");
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
