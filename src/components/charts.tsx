import { useMemo, useState, type ReactNode } from "react";
import { useWidth } from "../lib/hooks";

/* ------------------------------------------------------------------------
   Shared scale helpers
   ------------------------------------------------------------------------ */

export type Axis = {
  min: number;
  max: number;
  ticks: number[];
  format: (v: number) => string;
  log?: boolean;
  label?: string;
};

function scale(axis: Axis, a: number, b: number) {
  if (axis.log) {
    const l0 = Math.log10(axis.min);
    const l1 = Math.log10(axis.max);
    return (v: number) => a + ((Math.log10(Math.max(v, axis.min)) - l0) / (l1 - l0)) * (b - a);
  }
  return (v: number) => a + ((v - axis.min) / (axis.max - axis.min)) * (b - a);
}

export const fmtK = (v: number) => (v >= 1000 ? `${Math.round(v / 1024)}K` : `${v}`);
export const fmtInt = (v: number) => v.toLocaleString("en-US");

/* ------------------------------------------------------------------------
   Line chart: points and/or horizontal step segments, hover crosshair,
   optional controlled cursor, vertical markers.
   ------------------------------------------------------------------------ */

export type LineSeries = {
  id: string;
  label: string;
  color: string;
  points?: [number, number][];
  /** Horizontal segments [x0, x1, y] — for values measured over a range. */
  segments?: [number, number, number][];
  endLabel?: string;
  format: (y: number) => string;
};

type Marker = { x: number; label: string; tone?: "accent" | "muted" };

type LineChartProps = {
  series: LineSeries[];
  x: Axis;
  y: Axis;
  height?: number;
  cursorX?: number | null;
  markers?: Marker[];
  ariaLabel: string;
  legend?: boolean;
  compact?: boolean;
};

export function LineChart({ series, x, y, height = 240, cursorX, markers = [], ariaLabel, legend = true, compact }: LineChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hoverX, setHoverX] = useState<number | null>(null);
  const m = compact
    ? { l: 40, r: 14, t: 10, b: 24 }
    : { l: 46, r: series.some((s) => s.endLabel) ? 104 : 18, t: 12, b: 34 };
  const w = Math.max(width, 200);
  const sx = scale(x, m.l, w - m.r);
  const sy = scale(y, height - m.b, m.t);

  // Every x that has a measurement, for snapping the hover crosshair.
  const xs = useMemo(() => {
    const set = new Set<number>();
    for (const s of series) {
      s.points?.forEach(([px]) => set.add(px));
      s.segments?.forEach(([a, b]) => set.add((a + b) / 2));
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [series]);

  const invertX = (px: number) => {
    const t = (px - m.l) / (w - m.l - m.r);
    return x.min + t * (x.max - x.min);
  };

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    const dx = invertX(e.clientX - rect.left);
    let best = xs[0];
    for (const v of xs) if (Math.abs(v - dx) < Math.abs(best - dx)) best = v;
    setHoverX(best);
  };

  const valueAt = (s: LineSeries, at: number): number | null => {
    const p = s.points?.find(([px]) => px === at);
    if (p) return p[1];
    const seg = s.segments?.find(([a, b]) => at >= a && at <= b);
    return seg ? seg[2] : null;
  };

  const rangeAt = (at: number): string | null => {
    for (const s of series) {
      const seg = s.segments?.find(([a, b]) => at >= a && at <= b);
      if (seg) return `${fmtK(seg[0])}–${fmtK(seg[1])} tokens`;
    }
    return null;
  };

  const tip = hoverX != null && (
    <div className="tooltip" style={{ left: sx(hoverX), top: m.t + 4 }}>
      <div className="tt-head">{rangeAt(hoverX) ?? `${x.format(hoverX)}${x.label ? ` ${x.label}` : ""}`}</div>
      {series.map((s) => {
        const v = valueAt(s, hoverX);
        return (
          <div className="tt-row" key={s.id}>
            <span>
              <i style={{ background: s.color }} />
              {s.label}
            </span>
            <b>{v == null ? "—" : s.format(v)}</b>
          </div>
        );
      })}
    </div>
  );

  const xTickY = height - m.b;

  return (
    <div className="chart" ref={ref}>
      {legend && series.length > 1 && (
        <div className="legend" aria-hidden="true">
          {series.map((s) => (
            <span key={s.id}>
              <i style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <svg width={w} height={height} role="img" aria-label={ariaLabel}>
        <g className="grid">
          {y.ticks.map((t) => (
            <line key={t} x1={m.l} x2={w - m.r} y1={sy(t)} y2={sy(t)} />
          ))}
        </g>
        <line className="baseline" x1={m.l} x2={w - m.r} y1={xTickY} y2={xTickY} />
        {y.ticks.map((t) => (
          <text key={t} x={m.l - 8} y={sy(t)} dy="0.35em" textAnchor="end">
            {y.format(t)}
          </text>
        ))}
        {x.ticks.map((t) => (
          <text key={t} x={sx(t)} y={xTickY + 16} textAnchor="middle">
            {x.format(t)}
          </text>
        ))}
        {!compact && x.label && (
          <text className="axis-label" x={w - m.r} y={xTickY + 30} textAnchor="end">
            {x.label}
          </text>
        )}
        {!compact && y.label && (
          <text className="axis-label" x={m.l} y={m.t - 2} textAnchor="start" dy="-0.2em">
            {y.label}
          </text>
        )}

        {markers.map((mk) => (
          <g key={mk.label}>
            <line
              x1={sx(mk.x)}
              x2={sx(mk.x)}
              y1={m.t}
              y2={xTickY}
              stroke={mk.tone === "accent" ? "var(--accent)" : "var(--rule-strong)"}
              strokeWidth={1}
            />
            <text x={sx(mk.x) + 5} y={m.t + 10} style={{ fill: mk.tone === "accent" ? "var(--accent-text)" : undefined }}>
              {mk.label}
            </text>
          </g>
        ))}

        {series.map((s) => (
          <g key={s.id}>
            {s.segments?.map(([a, b, v], i) => (
              <line key={i} x1={sx(a) + 1} x2={sx(b) - 1} y1={sy(v)} y2={sy(v)} stroke={s.color} strokeWidth={2.5} strokeLinecap="round" />
            ))}
            {s.points && s.points.length > 1 && (
              <polyline className="series-line" stroke={s.color} points={s.points.map(([px, py]) => `${sx(px)},${sy(py)}`).join(" ")} />
            )}
            {s.points?.map(([px, py]) => (
              <circle key={px} className="dot" cx={sx(px)} cy={sy(py)} r={4} fill={s.color} />
            ))}
            {s.endLabel &&
              (() => {
                const last = s.points?.[s.points.length - 1] ?? (s.segments && [s.segments[s.segments.length - 1][1], s.segments[s.segments.length - 1][2]]);
                if (!last) return null;
                return (
                  <text className="end-label" x={sx(last[0]) + 8} y={sy(last[1])} dy="0.35em">
                    {s.endLabel}
                  </text>
                );
              })()}
          </g>
        ))}

        {cursorX != null && (
          <line x1={sx(cursorX)} x2={sx(cursorX)} y1={m.t} y2={xTickY} stroke="var(--ink)" strokeWidth={1.25} />
        )}
        {hoverX != null && <line className="crosshair" x1={sx(hoverX)} x2={sx(hoverX)} y1={m.t} y2={xTickY} />}

        <rect
          x={m.l}
          y={m.t}
          width={Math.max(0, w - m.l - m.r)}
          height={Math.max(0, height - m.t - m.b)}
          fill="transparent"
          onPointerMove={onMove}
          onPointerLeave={() => setHoverX(null)}
        />
      </svg>
      {tip}
    </div>
  );
}

/* ------------------------------------------------------------------------
   Horizontal bar chart
   ------------------------------------------------------------------------ */

export type Bar = { label: string; value: number; color: string; text: string; note?: string };

type BarChartProps = {
  bars: Bar[];
  axis: Axis;
  ariaLabel: string;
  labelWidth?: number;
  legend?: { label: string; color: string }[];
};

function barPath(x0: number, x1: number, y: number, h: number) {
  // Square at the baseline, 4px rounded data end.
  const r = Math.min(4, Math.max(0, x1 - x0), h / 2);
  return `M${x0},${y} H${x1 - r} Q${x1},${y} ${x1},${y + r} V${y + h - r} Q${x1},${y + h} ${x1 - r},${y + h} H${x0} Z`;
}

export function BarChart({ bars, axis, ariaLabel, labelWidth = 150, legend }: BarChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const narrow = width < 520;
  const lw = narrow ? 0 : labelWidth;
  const rowH = narrow ? 50 : 34;
  const barH = 18;
  const m = { l: lw + 8, r: 72, t: 4, b: 24 };
  const w = Math.max(width, 240);
  const h = m.t + bars.length * rowH + m.b;
  const sx = scale(axis, m.l, w - m.r);
  const x0 = sx(axis.min);

  return (
    <div className="chart" ref={ref}>
      {legend && (
        <div className="legend" aria-hidden="true">
          {legend.map((l) => (
            <span key={l.label}>
              <i className="sq" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      )}
      <svg width={w} height={h} role="img" aria-label={ariaLabel}>
        <g className="grid">
          {axis.ticks.map((t) => (
            <line key={t} x1={sx(t)} x2={sx(t)} y1={m.t} y2={h - m.b} />
          ))}
        </g>
        {axis.ticks.map((t) => (
          <text key={t} x={sx(t)} y={h - m.b + 16} textAnchor="middle">
            {axis.format(t)}
          </text>
        ))}
        {bars.map((b, i) => {
          const yTop = m.t + i * rowH + (narrow ? 22 : (rowH - barH) / 2);
          const x1 = Math.max(sx(b.value), x0 + 2);
          return (
            <g
              key={b.label}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              opacity={hover == null || hover === i ? 1 : 0.55}
            >
              <rect x={0} y={m.t + i * rowH} width={w} height={rowH} fill="transparent" />
              <text
                x={narrow ? m.l : lw}
                y={narrow ? m.t + i * rowH + 14 : yTop + barH / 2}
                dy={narrow ? 0 : "0.35em"}
                textAnchor={narrow ? "start" : "end"}
                style={{ fill: "var(--ink-2)", fontSize: 12 }}
              >
                {b.label}
              </text>
              <path d={barPath(x0, x1, yTop, barH)} fill={b.color} />
              <text x={x1 + 8} y={yTop + barH / 2} dy="0.35em" style={{ fill: "var(--ink)", fontSize: 12 }}>
                {b.text}
              </text>
            </g>
          );
        })}
        <line className="baseline" x1={x0} x2={x0} y1={m.t} y2={h - m.b} />
      </svg>
      {hover != null && bars[hover].note && (
        <div className="tooltip" style={{ left: Math.min(sx(bars[hover].value), w - 120), top: m.t + hover * rowH + 6 }}>
          <div className="tt-head">{bars[hover].label}</div>
          <div>{bars[hover].note}</div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------
   Table view toggle (every chart has one)
   ------------------------------------------------------------------------ */

export function AsTable({
  head,
  rows,
  numeric = [],
  summary = "Show as table",
}: {
  head: string[];
  rows: (string | number)[][];
  numeric?: number[];
  summary?: string;
}) {
  return (
    <details className="as-table">
      <summary>{summary}</summary>
      <DataTable head={head} rows={rows} numeric={numeric} />
    </details>
  );
}

export function DataTable({
  head,
  rows,
  numeric = [],
  caption,
}: {
  head: string[];
  rows: (string | number)[][];
  numeric?: number[];
  caption?: ReactNode;
}) {
  return (
    <div className={`table-wrap${head.length > 5 ? " wide" : ""}`}>
      <table className="data">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className={numeric.includes(i) ? "num" : undefined}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => (
                <td key={ci} className={numeric.includes(ci) ? "num" : undefined}>
                  {typeof c === "number" ? c.toLocaleString("en-US") : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <p className="table-caption">{caption}</p>}
    </div>
  );
}
