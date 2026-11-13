import { useEffect, useRef, useState } from "react";
import { kvLatency, kvMemory, kvPerplexity } from "../data/measurements";
import { AsTable, fmtInt, fmtK, LineChart } from "./charts";

const MIN = 1024;
const MAX = 65536;
const STEP = 1024;
const N_SINK = 4;
const CACHE = 1024;

type Reading = { value: number | null; status: "measured" | "interpolated" | "oom" | "none" };

/** Linear interpolation strictly inside the measured range; never extrapolates. */
function read(points: [number, number][], t: number, oomAt?: number): Reading {
  if (oomAt != null && t >= oomAt) return { value: null, status: "oom" };
  const exact = points.find(([x]) => x === t);
  if (exact) return { value: exact[1], status: "measured" };
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    if (t > x0 && t < x1) return { value: y0 + ((t - x0) / (x1 - x0)) * (y1 - y0), status: "interpolated" };
  }
  return { value: null, status: "none" };
}

/** Full cache memory between the last measurement and OOM follows the measured 112 KiB/token slope. */
function readFullMemory(t: number): Reading {
  if (t >= kvMemory.fullOomAt) return { value: null, status: "oom" };
  const last = kvMemory.full[kvMemory.full.length - 1];
  if (t > last[0]) return { value: last[1] + ((t - last[0]) * kvMemory.fullKiBPerToken) / 1024, status: "interpolated" };
  return read(kvMemory.full, t);
}

function pplRow(t: number) {
  return kvPerplexity.find((r) => t >= r.from && t < r.to) ?? null;
}

const SINKS = "var(--s1)";
const FULL = "var(--s2)";
const WINDOW = "var(--s3)";

function Value({ r, fmt }: { r: Reading; fmt: (v: number) => string }) {
  if (r.status === "oom") return <span className="v oom">out of memory</span>;
  if (r.value == null) return <span className="v na">not measured</span>;
  return <span className="v">{fmt(r.value)}</span>;
}

function statusText(...rs: Reading[]) {
  if (rs.some((r) => r.status === "interpolated")) return "Between measured points (straight line).";
  if (rs.every((r) => r.status === "measured")) return "Measured at this length.";
  return "";
}

export function KVExplorer({ heading = false }: { heading?: boolean }) {
  const [t, setT] = useState(16384);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let cur = t >= MAX ? MIN : t;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      cur = Math.min(MAX, cur + (dt / 3200) * (MAX - MIN));
      setT(Math.round(cur / STEP) * STEP);
      if (cur >= MAX) {
        setPlaying(false);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const memFull = readFullMemory(t);
  const memSink = read(kvMemory.sinks, t);
  const latFull = read(kvLatency.full, t, kvMemory.fullOomAt);
  const latSink = read(kvLatency.sinks, t);
  const row = pplRow(t);
  const pplFull: Reading = t >= kvMemory.fullOomAt ? { value: null, status: "oom" } : row ? { value: row.full, status: "measured" } : { value: null, status: "none" };
  const pplSink: Reading = row ? { value: row.sinks, status: "measured" } : { value: null, status: "none" };

  const evicted = Math.max(0, t - CACHE);
  const window = Math.min(t, CACHE) - N_SINK;
  const fill = ((t - MIN) / (MAX - MIN)) * 100;
  const pct = (v: number) => `${((v - MIN) / (MAX - MIN)) * 100}%`;

  const xAxis = { min: 0, max: MAX, ticks: [0, 16384, 32768, 49152, 65536], format: fmtK };
  const oomMarker = [{ x: kvMemory.fullOomAt, label: "OOM", tone: "accent" as const }];

  return (
    <div className="explorer">
      {heading && (
        <div className="ex-head">
          <div>
            <span className="kicker">Interactive · measured data</span>
            <h3>KV-cache explorer</h3>
            <p>Grow the context. Watch what a full cache costs against my attention-sink cache.</p>
          </div>
          <span className="ex-setup mono">Qwen3-0.6B · bf16 · RTX 4060 Laptop 8 GB · PG19</span>
        </div>
      )}
      <div className="ex-controls">
        <button
          type="button"
          className="play"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play: grow the context to 64K tokens"}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <rect x="3" y="2" width="3.5" height="12" rx="1" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5v11a.5.5 0 0 0 .77.42l8.5-5.5a.5.5 0 0 0 0-.84l-8.5-5.5A.5.5 0 0 0 4 2.5Z" />
            </svg>
          )}
        </button>
        <div className="ex-slider-wrap">
          <div className="ex-slider-label">
            <label htmlFor="kv-t" className="tokens">
              {fmtInt(t)}
              <small>tokens of context</small>
            </label>
            <span className="kicker">drag or use ← →</span>
          </div>
          <input
            id="kv-t"
            className="ex-range"
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={t}
            style={{ ["--fill" as string]: `${fill}%` }}
            onChange={(e) => {
              setPlaying(false);
              setT(Number(e.target.value));
            }}
            aria-valuetext={`${fmtInt(t)} tokens`}
          />
          <div className="ex-ticks" aria-hidden="true">
            {[1024, 16384, 32768, 65536].map((v) => (
              <span key={v} style={{ left: pct(v) }}>
                {fmtK(v)}
              </span>
            ))}
            <span className="oom" style={{ left: pct(kvMemory.fullOomAt) }}>
              ▲ <span className="long">full cache </span>OOM
            </span>
          </div>
        </div>
      </div>

      <div className="ex-strip">
        <div className="strip-label">
          <span>What the sink cache keeps</span>
          <span className="mono">
            {N_SINK} sinks + {fmtInt(window)} window{evicted > 0 ? ` · ${fmtInt(evicted)} evicted` : ""}
          </span>
        </div>
        <div className="bar" aria-hidden="true">
          <span className="seg-sink" style={{ flex: "0 0 8px" }} />
          {evicted > 0 && <span className="seg-evicted" style={{ flexGrow: evicted, minWidth: 3 }} />}
          <span className="seg-window" style={{ flexGrow: Math.max(window, 1), minWidth: 6 }} />
        </div>
        <div className="strip-keys">
          <span>
            <i style={{ background: "var(--s1)" }} />
            sink tokens, kept forever
          </span>
          <span>
            <i style={{ background: "repeating-linear-gradient(135deg, var(--rule-strong) 0 2px, transparent 2px 4px)" }} />
            evicted
          </span>
          <span>
            <i style={{ background: "repeating-linear-gradient(90deg, var(--s1) 0 2px, transparent 2px 4px)" }} />
            rolling window
          </span>
        </div>
      </div>

      <div className="legend" style={{ marginTop: 24, marginBottom: 0 }} aria-hidden="true">
        <span>
          <i style={{ background: FULL }} />
          Full cache
        </span>
        <span>
          <i style={{ background: SINKS }} />4 sinks + 1,020 window
        </span>
        <span>
          <i style={{ background: WINDOW }} />
          Window only (1,024)
        </span>
      </div>

      <div className="ex-panels">
        <div className="ex-panel">
          <h4>
            GPU memory<span className="unit">MiB</span>
          </h4>
          <div className="ex-readout">
            <div>
              <span className="who">
                <i style={{ background: FULL }} />
                Full
              </span>
              <Value r={memFull} fmt={(v) => fmtInt(Math.round(v))} />
            </div>
            <div>
              <span className="who">
                <i style={{ background: SINKS }} />
                Sinks
              </span>
              <Value r={memSink} fmt={(v) => fmtInt(Math.round(v))} />
            </div>
          </div>
          <p className="hint">{memFull.status === "oom" ? "The full cache grows 112 KiB per token and runs out of memory on the 8 GB card at 50,176 tokens." : statusText(memFull, memSink)}</p>
          <LineChart
            compact
            legend={false}
            height={170}
            ariaLabel="GPU memory against context length: full cache rises linearly to 6,522 MiB at 49K tokens then runs out of memory; sink cache stays at about 1,378 MiB."
            cursorX={t}
            markers={oomMarker}
            x={xAxis}
            y={{ min: 0, max: 7000, ticks: [0, 2000, 4000, 6000], format: (v) => (v ? `${v / 1000}K` : "0") }}
            series={[
              { id: "full", label: "Full cache", color: FULL, points: kvMemory.full, format: (v) => `${fmtInt(v)} MiB` },
              { id: "sinks", label: "Sinks", color: SINKS, points: kvMemory.sinks, format: (v) => `${fmtInt(v)} MiB` },
            ]}
          />
        </div>

        <div className="ex-panel">
          <h4>
            Decode time<span className="unit">GPU ms / token</span>
          </h4>
          <div className="ex-readout">
            <div>
              <span className="who">
                <i style={{ background: FULL }} />
                Full
              </span>
              <Value r={latFull} fmt={(v) => v.toFixed(1)} />
            </div>
            <div>
              <span className="who">
                <i style={{ background: SINKS }} />
                Sinks
              </span>
              <Value r={latSink} fmt={(v) => v.toFixed(1)} />
            </div>
          </div>
          <p className="hint">
            {t > 32768
              ? "Latency was measured up to 32K tokens."
              : t >= 24576 && latFull.value
                ? `Over half the full-cache step at 32K is torch.cat rewriting the cache (${kvLatency.fullCopyMsAt32K} ms), not attention.`
                : statusText(latFull, latSink)}
          </p>
          <LineChart
            compact
            legend={false}
            height={170}
            ariaLabel="Decode GPU time per token: full cache rises from 20.8 to 62.2 ms between 1K and 32K tokens; sink cache stays between 22.5 and 25.1 ms."
            cursorX={t}
            markers={oomMarker}
            x={xAxis}
            y={{ min: 0, max: 70, ticks: [0, 20, 40, 60], format: (v) => `${v}` }}
            series={[
              { id: "full", label: "Full cache", color: FULL, points: kvLatency.full, format: (v) => `${v} ms` },
              { id: "sinks", label: "Sinks", color: SINKS, points: kvLatency.sinks, format: (v) => `${v} ms` },
            ]}
          />
        </div>

        <div className="ex-panel">
          <h4>
            Perplexity<span className="unit">lower is better · log scale</span>
          </h4>
          <div className="ex-readout">
            <div>
              <span className="who">
                <i style={{ background: FULL }} />
                Full
              </span>
              <Value r={pplFull} fmt={(v) => v.toFixed(2)} />
            </div>
            <div>
              <span className="who">
                <i style={{ background: SINKS }} />
                Sinks
              </span>
              <Value r={pplSink} fmt={(v) => v.toFixed(2)} />
            </div>
          </div>
          <p className="hint">
            {row
              ? `${fmtK(row.from)}–${fmtK(row.to)}: sinks ${row.delta} vs full (95% CI ${row.ci}). Window-only: ${row.window}.${row.from >= 40960 ? " Past Qwen3's trained range the full cache degrades." : ""}`
              : "The perplexity run ended at 50K tokens."}
          </p>
          <LineChart
            compact
            legend={false}
            height={170}
            ariaLabel="Perplexity by token range on a log scale: full cache about 20 to 27, sink cache about 21 to 27, window-only about 280 to 394."
            cursorX={t}
            markers={oomMarker}
            x={xAxis}
            y={{ min: 15, max: 500, log: true, ticks: [20, 50, 100, 200, 400], format: (v) => `${v}` }}
            series={[
              { id: "full", label: "Full cache", color: FULL, segments: kvPerplexity.map((r) => [r.from, r.to, r.full]), format: (v) => v.toFixed(2) },
              { id: "sinks", label: "Sinks", color: SINKS, segments: kvPerplexity.map((r) => [r.from, r.to, r.sinks]), format: (v) => v.toFixed(2) },
              { id: "window", label: "Window only", color: WINDOW, segments: kvPerplexity.map((r) => [r.from, r.to, r.window]), format: (v) => v.toFixed(1) },
            ]}
          />
        </div>
      </div>

      <AsTable
        summary="Perplexity as a table"
        head={["Range (tokens)", "Full", "Sinks", "Window only", "Sinks vs full", "95% CI"]}
        numeric={[1, 2, 3]}
        rows={kvPerplexity.map((r) => [`${fmtInt(r.from)}–${fmtInt(r.to)}`, r.full, r.sinks, r.window, r.delta, r.ci])}
      />
      <AsTable
        summary="Memory and decode time as a table"
        head={["Tokens", "Full cache memory (MiB)", "Sink cache memory (MiB)", "Full decode (ms)", "Sink decode (ms)"]}
        numeric={[1, 2, 3, 4]}
        rows={[
          ["1,024", 1258, 1370, "20.8", "22.5"],
          ["8,192", "—", "—", "27.5", "—"],
          ["16,384", 2938, 1378, "36.8", "—"],
          ["32,768", 4730, 1378, "62.2", "25.1"],
          ["49,152", 6522, 1378, "—", "—"],
          ["50,176", "OOM", 1378, "OOM", "—"],
        ]}
      />
    </div>
  );
}
