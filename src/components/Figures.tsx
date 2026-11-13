import type { ReactNode } from "react";
import type { FigId } from "../data/types";
import { keyPrecision, rmsBytes, rmsStep, sinkCountAblation } from "../data/measurements";
import { AsTable, BarChart, LineChart } from "./charts";
import { KVExplorer } from "./KVExplorer";

export function Figure({
  n,
  title,
  caption,
  wide,
  children,
  id,
}: {
  n: number;
  title: string;
  caption?: string;
  wide?: boolean;
  children: ReactNode;
  id?: string;
}) {
  return (
    <figure className={`fig${wide ? " wide" : ""}`} id={id} data-reveal>
      <div className="fig-head">
        <span className="fig-num">Fig. {n}</span>
        <span className="fig-title">{title}</span>
      </div>
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/* ---------------- Fraud: pipeline ---------------- */

function FraudPipeline() {
  const layers = [
    ["CMS-policy rules", "billing that breaks coverage policy"],
    ["Peer baselines", "deviation from similar suppliers"],
    ["Anomaly ensemble", "Isolation Forest · ECOD · kNN"],
    ["Graph referral features", "the referral network around a supplier"],
    ["PU learning", "known fraud vs unlabeled, not vs clean"],
  ];
  return (
    <div className="flow" role="img" aria-label="Claims and supplier data feed five independent signal layers, which combine into one supplier risk ranking; investigators review the top of the ranking.">
      <div className="flow-node">
        <span className="flow-k">Input</span>
        <b>DME claims</b>
        <span>6,500+ suppliers</span>
      </div>
      <div className="flow-arrow" aria-hidden="true" />
      <ol className="flow-stack">
        {layers.map(([t, s], i) => (
          <li key={t}>
            <span className="flow-idx">{i + 1}</span>
            <span>
              <b>{t}</b>
              <span>{s}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="flow-arrow" aria-hidden="true" />
      <div className="flow-node accent">
        <span className="flow-k">Output</span>
        <b>Supplier risk ranking</b>
        <span>explainable per layer</span>
      </div>
      <div className="flow-arrow" aria-hidden="true" />
      <div className="flow-node">
        <span className="flow-k">Use</span>
        <b>Review queue</b>
        <span>top of the list</span>
      </div>
    </div>
  );
}

/* ---------------- Fraud: where validation cases landed ---------------- */

function FraudRank() {
  return (
    <div className="rank">
      <div className="rank-row">
        <div className="rank-label">Whole ranking, 0–100th percentile</div>
        <div className="rank-track" aria-hidden="true">
          <span className="rank-band b2" style={{ width: "3%" }} />
          <span className="rank-band b1" style={{ width: "0.53%" }} />
        </div>
        <div className="rank-scale mono" aria-hidden="true">
          <span>highest risk</span>
          <span>lowest risk</span>
        </div>
      </div>
      <div className="rank-row">
        <div className="rank-label">Zoom: the top 5%</div>
        <div className="rank-track zoom" aria-hidden="true">
          <span className="rank-band b2" style={{ width: "60%" }} />
          <span className="rank-band b1" style={{ width: "10.6%" }} />
          <span className="rank-tick" style={{ left: "10.6%" }} />
          <span className="rank-tick" style={{ left: "60%" }} />
        </div>
        <div className="rank-scale mono" aria-hidden="true">
          <span>0%</span>
          <span style={{ left: "10.6%" }}>0.53%</span>
          <span style={{ left: "60%" }}>3%</span>
          <span>5%</span>
        </div>
      </div>
      <ul className="rank-key">
        <li>
          <i className="b1" />
          <span>
            <b>Top 0.53%</b>: all <b>5 of 5</b> suppliers later excluded for fraud, after the ranking was produced
          </span>
        </li>
        <li>
          <i className="b2" />
          <span>
            <b>Top 3%</b>: held-out confirmed fraud suppliers, <b>median rank 1</b>
          </span>
        </li>
      </ul>
      <p className="sr-only">
        All five suppliers later excluded for fraud fell within the top 0.53% of the ranking. Held-out confirmed fraud suppliers fell within the top 3%, with median rank 1.
      </p>
    </div>
  );
}

/* ---------------- Claims model: gradient sync ---------------- */

function GradSync() {
  const Row = ({ label, covered, tone }: { label: string; covered: number[]; tone: "ok" | "bug" }) => (
    <div className={`gs-row ${tone}`}>
      <div className="gs-label">
        <span className="flow-k">{tone === "ok" ? "Intended" : "Bug"}</span>
        <b>{label}</b>
      </div>
      <div className="gs-ranks">
        {[0, 1].map((r) => (
          <div className="gs-rank" key={r}>
            <span className="gs-r mono">rank {r}</span>
            <div className="gs-mbs">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className={`gs-mb${covered.includes(i) ? " on" : ""}`}>
                  g{i}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="gs-reduce">
          <span className="gs-bracket" style={{ left: `${((covered[0] - 1) / 4) * 100}%`, width: `${(covered.length / 4) * 100}%` }} />
          <span className="mono">
            all-reduce({covered.length === 4 ? "g1 + g2 + g3 + g4" : "g4"}) / ranks
          </span>
        </div>
      </div>
    </div>
  );
  return (
    <div className="gs" role="img" aria-label="Two ranks each run four micro-batches. Intended: the sum of all four micro-batch gradients is averaged across ranks. Bug: only the fourth micro-batch's gradient was averaged across ranks.">
      <Row label="Average the whole accumulated gradient" covered={[1, 2, 3, 4]} tone="ok" />
      <Row label="Only the last micro-batch was synchronised" covered={[4]} tone="bug" />
    </div>
  );
}

/* ---------------- Figures registry ---------------- */

const S1 = "var(--s1)";
const S2 = "var(--s2)";
const S3 = "var(--s3)";

export function renderFigure(id: FigId): ReactNode {
  switch (id) {
    case "kv-explorer":
      return <KVExplorer />;

    case "fraud-pipeline":
      return <FraudPipeline />;

    case "fraud-rank":
      return <FraudRank />;

    case "grad-sync":
      return <GradSync />;

    case "kv-sink-count":
      return (
        <>
          <BarChart
            ariaLabel="Perplexity by number of sink tokens: 0 sinks 313; 1, 2, 4 and 8 sinks all about 23.3."
            axis={{ min: 0, max: 350, ticks: [0, 100, 200, 300], format: (v) => `${v}` }}
            labelWidth={90}
            bars={sinkCountAblation.map(([label, v], i) => ({
              label,
              value: v,
              color: i === 0 ? S3 : S1,
              text: v.toFixed(2),
              note: i === 0 ? "Window only: the first eviction breaks the softmax" : `Full cache on this range: 22.44`,
            }))}
            legend={[
              { label: "No sink (window only)", color: S3 },
              { label: "With sinks", color: S1 },
            ]}
          />
          <AsTable head={["Sinks", "Perplexity, tokens 2K–16K"]} numeric={[1]} rows={sinkCountAblation.map(([l, v]) => [l, v.toFixed(2)])} />
        </>
      );

    case "kv-precision":
      return (
        <>
          <LineChart
            ariaLabel="Perplexity by cache size. fp32 keys improve from 25.6 to 23.2 as the cache grows; bf16 keys get worse, 31.8 at 1,024 and 62.0 at 2,048."
            height={230}
            x={{ min: 200, max: 2600, log: true, ticks: keyPrecision.sizes, format: (v) => v.toLocaleString("en-US"), label: "cache size (tokens)" }}
            y={{ min: 0, max: 70, ticks: [0, 20, 40, 60], format: (v) => `${v}`, label: "perplexity" }}
            series={[
              { id: "bf16", label: "bf16 keys", color: S3, points: keyPrecision.sizes.map((s, i) => [s, keyPrecision.bf16[i]]), endLabel: "bf16 keys", format: (v) => v.toFixed(2) },
              { id: "fp32", label: "fp32 keys", color: S1, points: keyPrecision.sizes.map((s, i) => [s, keyPrecision.fp32[i]]), endLabel: "fp32 keys", format: (v) => v.toFixed(2) },
            ]}
          />
          <AsTable
            head={["Cache size", "bf16 keys", "fp32 keys"]}
            numeric={[1, 2]}
            rows={keyPrecision.sizes.map((s, i) => [s.toLocaleString("en-US"), keyPrecision.bf16[i], keyPrecision.fp32[i]])}
          />
        </>
      );

    case "claims-results":
      return (
        <div className="fig-pair">
          <div>
            <p className="fig-sub">Held-out claims perplexity · lower is better</p>
            <BarChart
              ariaLabel="Held-out claims perplexity: 1.79 before LoRA training, 1.33 after."
              axis={{ min: 0, max: 2, ticks: [0, 0.5, 1, 1.5, 2], format: (v) => `${v}` }}
              labelWidth={110}
              bars={[
                { label: "Before", value: 1.79, color: S2, text: "1.79" },
                { label: "After LoRA", value: 1.33, color: S1, text: "1.33" },
              ]}
            />
          </div>
          <div>
            <p className="fig-sub">12-month CKD progression AUROC · axis starts at 0.5 (chance)</p>
            <BarChart
              ariaLabel="AUROC for 12-month CKD progression: XGBoost 0.645, LoRA claims model 0.674."
              axis={{ min: 0.5, max: 0.7, ticks: [0.5, 0.55, 0.6, 0.65, 0.7], format: (v) => v.toFixed(2) }}
              labelWidth={110}
              bars={[
                { label: "XGBoost", value: 0.645, color: S2, text: "0.645" },
                { label: "LoRA model", value: 0.674, color: S1, text: "0.674" },
              ]}
            />
          </div>
        </div>
      );

    case "capacity":
      return (
        <div className="fig-pair">
          <div>
            <p className="fig-sub">Weekly outreach flags</p>
            <BarChart
              ariaLabel="Weekly outreach flags: about 1,600 with the Youden cut-off, about 300 with the capacity-sized threshold."
              axis={{ min: 0, max: 1800, ticks: [0, 600, 1200, 1800], format: (v) => v.toLocaleString("en-US") }}
              labelWidth={110}
              bars={[
                { label: "Youden cut-off", value: 1600, color: S2, text: "≈1,600" },
                { label: "Capacity-sized", value: 300, color: S1, text: "≈300" },
              ]}
            />
          </div>
          <div>
            <p className="fig-sub">30-day precision, relative to Youden</p>
            <BarChart
              ariaLabel="30-day precision relative to the Youden threshold: 1.0 times for Youden, 2.4 times for the capacity-sized threshold."
              axis={{ min: 0, max: 3, ticks: [0, 1, 2, 3], format: (v) => `${v}×` }}
              labelWidth={110}
              bars={[
                { label: "Youden cut-off", value: 1, color: S2, text: "1.0×" },
                { label: "Capacity-sized", value: 2.4, color: S1, text: "2.4×" },
              ]}
            />
          </div>
        </div>
      );

    case "rms-bytes":
      return (
        <>
          <BarChart
            ariaLabel="Bytes moved per element: eager RMSNorm 36, Triton RMSNorm 4, eager add plus RMSNorm 42, fused Triton add plus RMSNorm 8."
            axis={{ min: 0, max: 45, ticks: [0, 10, 20, 30, 40], format: (v) => `${v} B` }}
            labelWidth={170}
            bars={[
              { label: "Eager RMSNorm", value: 36, color: S2, text: "36 B", note: "6 ops, fp32 intermediates through DRAM" },
              { label: "Triton RMSNorm", value: 4, color: S1, text: "4 B", note: "read 2, write 2" },
              { label: "Eager add + RMSNorm", value: 42, color: S2, text: "42 B" },
              { label: "Fused add + RMSNorm", value: 8, color: S1, text: "8 B", note: "read x and residual once, write h and y" },
            ]}
            legend={[
              { label: "Eager PyTorch", color: S2 },
              { label: "My Triton kernel", color: S1 },
            ]}
          />
          <AsTable
            summary="Eager ops, byte by byte"
            head={["Eager op", "Read (B)", "Write (B)"]}
            numeric={[1, 2]}
            rows={[...rmsBytes.map((r) => [r.op, r.read, r.write || "–"]), ["Total", "", "36 vs 4 ideal"]]}
          />
        </>
      );

    case "rms-step":
      return (
        <>
          <BarChart
            ariaLabel="Training step time: HF 299 ms, PyTorch control 286 ms, Triton RMSNorm 256 ms, Triton RMSNorm plus fused add 261 ms."
            axis={{ min: 0, max: 320, ticks: [0, 100, 200, 300], format: (v) => `${v} ms` }}
            labelWidth={230}
            bars={rmsStep.map(([label, v]) => ({
              label,
              value: v,
              color: label.startsWith("Triton") ? S1 : label.startsWith("HF") ? S2 : S3,
              text: `${v} ms`,
            }))}
            legend={[
              { label: "Stock HF", color: S2 },
              { label: "PyTorch control", color: S3 },
              { label: "Triton", color: S1 },
            ]}
          />
        </>
      );
  }
}
