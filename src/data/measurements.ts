// Measured numbers copied verbatim from the public READMEs:
//   github.com/buttaRahul/Attention_sinks       (Qwen3-0.6B, bf16, RTX 4060 Laptop 8 GB, PG19)
//   github.com/buttaRahul/fused-rmsnorm-triton  (RTX 4060 Laptop, bf16)
// Nothing here is estimated. Where a figure draws between points it says so.

/** Experiment 2 — memory against length (MiB). Full cache OOMs at 50,176 tokens. */
export const kvMemory = {
  full: [
    [1024, 1258],
    [16384, 2938],
    [32768, 4730],
    [49152, 6522],
  ] as [number, number][],
  fullOomAt: 50176,
  /** Measured slope of the full cache: 112.00 KiB per token. */
  fullKiBPerToken: 112,
  sinks: [
    [1024, 1370],
    [16384, 1378],
    [32768, 1378],
    [49152, 1378],
    [65536, 1378],
  ] as [number, number][],
};

/** Experiment 3 — decode GPU time per token (ms), summed CUDA kernel time, eager. */
export const kvLatency = {
  full: [
    [1024, 20.8],
    [8192, 27.5],
    [16384, 36.8],
    [32768, 62.2],
  ] as [number, number][],
  sinks: [
    [1024, 22.5],
    [32768, 25.1],
  ] as [number, number][],
  /** Breakdown at 32K for the full cache: share spent on torch.cat cache copies. */
  fullCopyMsAt32K: 33.1,
  fullAttnMsAt32K: 18.3,
  graphWallClock: "15.3–15.7 ms/token",
};

/** Experiment 1 — streaming perplexity per token range. Cache size 1,024 for all three. */
export type PplRow = { from: number; to: number; full: number; sinks: number; window: number; delta: string; ci: string };
export const kvPerplexity: PplRow[] = [
  { from: 1024, to: 8192, full: 21.96, sinks: 23.16, window: 293.4, delta: "+5.5%", ci: "+2.6 to +9.2%" },
  { from: 8192, to: 16384, full: 22.61, sinks: 23.11, window: 327.3, delta: "+2.2%", ci: "−0.5 to +5.6%" },
  { from: 16384, to: 32768, full: 19.83, sinks: 21.21, window: 279.8, delta: "+7.0%", ci: "+5.1 to +9.0%" },
  { from: 32768, to: 40960, full: 19.95, sinks: 21.95, window: 306.0, delta: "+10.0%", ci: "+5.4 to +14.7%" },
  { from: 40960, to: 50176, full: 26.65, sinks: 26.89, window: 393.9, delta: "+0.9%", ci: "−5.2 to +9.4%" },
];
export const kvHeadline = { full: 20.78, sinks: 22.09, delta: "+6.3%", ci: "+4.7 to +8.2%", windowX: "14.3×" };

/** Ablation — number of sink tokens (window 1,020), perplexity over tokens 2K–16K. */
export const sinkCountAblation: [string, number][] = [
  ["0 sinks", 312.96],
  ["1 sink", 23.34],
  ["2 sinks", 23.35],
  ["4 sinks", 23.29],
  ["8 sinks", 23.4],
];

/** bf16 vs fp32 key storage under per-step re-rotation (4 sinks), perplexity. */
export const keyPrecision = {
  sizes: [256, 512, 1024, 2048],
  bf16: [25.46, 23.66, 31.81, 62.02],
  fp32: [25.55, 24.17, 23.29, 23.24],
};

/** Fused RMSNorm — bytes moved per element, forward. */
export const rmsBytes: { op: string; read: number; write: number }[] = [
  { op: "x.to(float32)", read: 2, write: 4 },
  { op: ".pow(2)", read: 4, write: 4 },
  { op: ".mean(-1)", read: 4, write: 0 },
  { op: "x * rsqrt(...)", read: 4, write: 4 },
  { op: ".to(bfloat16)", read: 4, write: 2 },
  { op: "weight * x", read: 2, write: 2 },
];

/** Headline table. Times on RTX 4060 Laptop, bf16. */
export const rmsHeadline: string[][] = [
  ["RMSNorm", "4096 × 4096", "fwd", "303 µs", "86%", "8.8×", "1.01×", "1.03×"],
  ["RMSNorm", "4096 × 4096", "fwd+bwd", "777 µs", "84%", "12.2×", "1.30×", "1.49×"],
  ["RMSNorm", "32768 × 4096", "fwd+bwd", "6.09 ms", "86%", "12.3×", "0.98×", "1.51×"],
  ["add + RMSNorm", "4096 × 2560 (Qwen3-4B)", "fwd", "381 µs", "86%", "5.0×", "1.03×", "1.10×"],
  ["add + RMSNorm", "4096 × 2560 (Qwen3-4B)", "fwd+bwd", "774 µs", "85%", "8.2×", "1.14×", "1.54×"],
  ["add + RMSNorm", "4096 × 4096", "fwd", "620 µs", "85%", "5.0×", "0.99×", "1.23×"],
  ["add + RMSNorm", "4096 × 4096", "fwd+bwd", "1.21 ms", "87%", "8.7×", "1.16×", "1.60×"],
];

/** End-to-end Qwen3-0.6B logits vs the fp32 model. */
export const rmsLogits: string[][] = [
  ["HF bf16", "0.065", "1.13", "98.0%", "1.13e-3"],
  ["Triton bf16", "0.059", "1.82", "98.4%", "9.2e-4"],
];

/** End-to-end step time, 100 AdamW steps, batch 1 × 512. */
export const rmsStep: [string, number][] = [
  ["HF", 299],
  ["Control (PyTorch, kernel numerics)", 286],
  ["Triton RMSNorm", 256],
  ["Triton RMSNorm + fused add", 261],
];
