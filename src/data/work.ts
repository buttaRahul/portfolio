import type { CompactItem, Work } from "./types";
import { rmsHeadline, rmsLogits } from "./measurements";

// Employer work (Zynix, Carnot) is described at method level only: what was
// built, how it was validated, the numbers already on the resume. No data,
// schemas or internal names. Open-source work follows the public READMEs.

const fraud: Work = {
  slug: "fraud-detection-without-labels",
  kind: "case",
  org: "Zynix AI",
  period: "2025 – 26",
  area: "Core ML",
  title: "Finding fraud without trusting the labels",
  short: "A fraud and waste ranking for 6,500+ medical-equipment suppliers, designed and built alone and checked against fraud exclusions that came after it.",
  dek: "A fraud and waste detection system for durable-medical-equipment claims across 6,500+ suppliers. I designed and built it alone, and checked it against fraud exclusions that came after it.",
  role: "Sole designer and builder",
  metric: { value: "5 / 5", label: "later fraud exclusions already in the top 0.53% risk tier" },
  checked: "Against fraud exclusions announced after scoring, and against held-out confirmed fraud suppliers",
  glance: [
    { value: "6,500+", label: "suppliers scored" },
    { value: "5 / 5", label: "later fraud exclusions in the top 0.53%" },
    { value: "Top 3%", label: "held-out confirmed fraud; median rank 1" },
  ],
  stack: ["Databricks", "Python", "Clustering", "PU learning", "Outlier detection"],
  sections: [
    {
      id: "problem",
      title: "Problem",
      blocks: [
        {
          t: "p",
          text: "Fraud labels in medical-equipment claims are **rare, late and biased**. A supplier becomes \"fraud\" only when an investigation finishes, often years after the claims, and only the schemes someone looked for get investigated. A classifier trained on those few cases learns what got caught, not what is happening.",
        },
        {
          t: "p",
          text: "The system had to rank suppliers for review without leaning on labels for training, and still produce evidence that the ranking is right.",
        },
        {
          t: "note",
          text: "An un-investigated supplier is **unlabeled**, not clean. Treating the unlabeled majority as negatives is the most common way fraud models quietly learn the wrong thing.",
        },
      ],
    },
    {
      id: "constraints",
      title: "Constraints",
      blocks: [
        {
          t: "ul",
          items: [
            "**No reliable negatives.** Known fraud is a handful of positives against thousands of unlabeled suppliers.",
            "**Only the top of the list matters.** Reviewers can open a small number of cases, so ranking quality at the head is the whole game.",
            "**Every flag has to be explainable** to an investigator in the language of billing policy, not model internals.",
          ],
        },
      ],
    },
    {
      id: "built",
      title: "What I built",
      blocks: [
        {
          t: "p",
          text: "A **multi-layer architecture** on Databricks that produces one supplier-level risk ranking. No single layer decides a flag, and every flag can be traced back to the layers that raised it.",
        },
        {
          t: "ul",
          items: [
            "**Clustering analysis** of supplier behaviour.",
            "**Multivariate outlier detection** for suppliers whose overall pattern is unusual even when no single measure is.",
            "**Positive-unlabeled (PU) learning**: known fraud is positive and everyone else is *unlabeled*, not negative, which is the right assumption for this data.",
            "**Calibration from reviews**: scores are calibrated using the outcomes of reviews of flagged suppliers.",
          ],
        },
        {
          t: "note",
          text: "Exact signals, features and models are Zynix's and stay private.",
        },
      ],
    },
    {
      id: "validation",
      title: "How it was validated",
      blocks: [
        {
          t: "p",
          text: "With almost no labels, the usual train/test split proves little. I used two checks the model could not have fit to.",
        },
        {
          t: "ul",
          items: [
            "**Future exclusions.** 5 suppliers were later excluded for fraud. All 5 were already in the system's **top 0.53%** risk tier.",
            "**Held-out confirmed fraud.** Confirmed fraud suppliers kept out of training ranked in the **top 3%**, with a **median rank of 1**.",
          ],
        },
        {
          t: "note",
          text: "Top 0.53% of 6,500+ suppliers is roughly the top 35.",
        },
        {
          t: "fig",
          fig: "fraud-rank",
          title: "Where the known cases landed in the ranking",
          caption: "Percentile of the supplier ranking (0 = highest risk). Bands show where each validation set landed, as reported. Positions of individual suppliers are not shown.",
          wide: true,
        },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      blocks: [
        {
          t: "ul",
          items: [
            "Five exclusions is a small sample. It is strong evidence about the head of the ranking, not a precision estimate for the whole list.",
            "Because unlabeled is not clean, precision further down the list stays unknown until investigators work through it.",
          ],
        },
      ],
    },
  ],
  links: [],
};

const sinks: Work = {
  slug: "attention-sinks",
  kind: "worklog",
  org: "Open source",
  period: "2026",
  area: "ML systems",
  title: "Attention sinks for Transformers 5",
  short: "A StreamingLLM KV cache with a fused Triton eviction kernel, split-K flash-decoding and CUDA-graph decode. Constant memory, perplexity within 6% of a full cache.",
  dek: "A StreamingLLM KV cache for the Transformers 5 cache API. It keeps 4 sink tokens and a rolling window, re-rotates cached keys on eviction, and adds a fused Triton eviction kernel, a split-K flash-decoding backend and CUDA-graph decode.",
  role: "Author",
  metric: { value: "+6.3%", label: "perplexity vs full cache over 40K tokens, at constant memory" },
  checked: "Paired-bootstrap CIs on PG19, ablations, a second model (Llama-3.2-1B), unit tests against the real model",
  glance: [
    { value: "+6.3%", label: "perplexity vs full cache (95% CI +4.7 to +8.2%)" },
    { value: "14.3×", label: "how much worse a window-only cache of the same size is" },
    { value: "1,378 MiB", label: "flat memory to 65K tokens; full cache OOMs at 50,176" },
  ],
  stack: ["PyTorch", "Transformers 5", "Triton", "CUDA graphs", "Qwen3-0.6B", "Llama-3.2-1B"],
  sections: [
    {
      id: "problem",
      title: "Problem",
      blocks: [
        {
          t: "p",
          text: "A transformer's KV cache grows with every token. For Qwen3-0.6B that is **112 KiB per token**, and on an 8 GB card the full cache runs out of memory at **50,176 tokens**. Keeping only the most recent window fixes memory but breaks the model: from the first eviction, perplexity jumps from about 20 to about 290.",
        },
        {
          t: "p",
          text: "StreamingLLM showed why. Models dump attention mass on the first few tokens, the **attention sinks**, and evicting them breaks the softmax. Keep a few sinks plus a window and the model stays fluent at constant memory. `SinkCache` was removed from core Transformers, so I re-implemented it as a `CacheLayerMixin` subclass that plugs into any full-attention RoPE model without patching it.",
        },
      ],
    },
    {
      id: "explorer",
      title: "Explore the measurements",
      blocks: [
        {
          t: "fig",
          fig: "kv-explorer",
          title: "Full cache vs sink cache, as the context grows",
          caption: "Qwen3-0.6B, bf16, RTX 4060 Laptop 8 GB, PG19 streamed one token at a time. Dots are measured points; lines between them are drawn straight. Latency is summed GPU kernel time per token, both configs eager.",
          wide: true,
        },
      ],
    },
    {
      id: "positions",
      title: "Hard part 1: positions, the bug everyone makes",
      blocks: [
        {
          t: "p",
          text: "To the model, the kept tokens must look like a contiguous sequence `0 … cache_len − 1`. Keys are cached **after** RoPE, which rotates each pair of dimensions by `pos · θᵢ`. Rotations compose by adding angles, so a key rotated at position *p* and then rotated by −Δ is exactly the key at *p* − Δ. When tokens are evicted from the front of the window, every surviving key moves earlier, so it is rotated back by the eviction count. Sinks never move. Values carry no position and are just shifted.",
        },
        {
          t: "p",
          text: "Without this re-rotation the same cache scores a perplexity of **47,642**.",
        },
        {
          t: "p",
          text: "Qwen3 applies `k_norm` before RoPE, so the identity still holds. That is tested, not assumed: `test_qwen3_keys_shift` runs the real model with every position shifted by +3,000 and checks the re-rotated keys at all 28 layers. A second test shows the identity would fail if the norm came after RoPE.",
        },
        {
          t: "note",
          text: "Eviction is deferred to the start of the next `update()`. The current queries were rotated at their old positions, so they must see the old keys there. HF's `DynamicSlidingWindowLayer` makes the same choice.",
        },
      ],
    },
    {
      id: "precision",
      title: "Hard part 2: the bf16 drift I didn't expect",
      blocks: [
        {
          t: "p",
          text: "Every window key is re-rotated **once per step** for its whole life in the window, and in bf16 each re-rotation rounds the stored key again. The error random-walks, roughly √n × 2⁻⁹ after n steps: 1.3% relative key error after 60 re-rotations in bf16, against 9 × 10⁻⁷ in fp32. In perplexity, a *bigger* bf16 cache got *worse*, the opposite of what should happen.",
        },
        {
          t: "fig",
          fig: "kv-precision",
          title: "A bigger cache should never be worse",
          caption: "Perplexity by cache size (4 sinks), keys stored in bf16 vs fp32. With bf16 storage, accumulated rounding from per-step re-rotation overwhelms the extra context.",
        },
        {
          t: "p",
          text: "So v1 stores keys in fp32 (+50% KV memory). That treats the symptom. **v2 removes the cause**: window keys are never touched; only the 4 sinks are rotated each step, from their stored originals, to sit before the window. Eviction becomes one ring-buffer slot overwrite. Logits match v1 to 1 × 10⁻³ in fp32.",
        },
        {
          t: "table",
          head: ["", "v1 (SinkCache)", "v2 (SinkCacheV2)"],
          rows: [
            ["Keys rotated per step", "1,020 per layer", "4 per layer"],
            ["Roundings per window key", "one per step (√n drift in bf16)", "none"],
            ["Key storage", "fp32 (168 MiB / 1,024 tokens)", "bf16 (112 MiB)"],
            ["Eviction", "shift the whole window", "overwrite one ring slot"],
          ],
        },
      ],
    },
    {
      id: "latency",
      title: "Hard part 3: the full cache is copy-bound, not attention-bound",
      blocks: [
        {
          t: "p",
          text: "Decode reads every weight (1.19 GB) and the KV cache once per token, so I expected the full cache to slow down by \"weights + KV\". It slowed down more. HF's `DynamicCache` appends with `torch.cat`, which **reads and rewrites the entire cache every step**, so per-token traffic is weights + 3 × KV.",
        },
        {
          t: "p",
          text: "Predicted slope: 3 × 112 KiB ÷ 220 GB/s = **1.56 µs per extra token**. Measured: (62.2 − 20.8) ms ÷ 31.7K tokens = **1.31 µs**. At 32K, 33.1 ms of the 62.2 ms step is the cache copy and 18.3 ms is attention. An in-place, preallocated cache, which the sink cache uses, removes that copy.",
        },
        {
          t: "note",
          text: "A full sink cache has the same shapes *and* positions every step, so the whole decode step can be captured in **one CUDA graph**: 15.3–15.7 ms/token wall clock at every length. A growing cache can't be captured that way.",
        },
      ],
    },
    {
      id: "validation",
      title: "How it was validated",
      blocks: [
        {
          t: "ul",
          items: [
            "**Paired bootstrap** over 1,024-token blocks for every perplexity gap, with the caveat stated: one book, so neighbouring tokens are not independent.",
            "**Fair range only.** The headline uses the 40K tokens inside Qwen3's trained position range. Past it the full cache degrades and the gap (+0.9%) mostly measures the baseline breaking.",
            "**Second model.** Llama-3.2-1B to 16K tokens: +7.4%, same shape of result.",
            "**Ablations.** One sink token recovers all of the gap (313 → 23.3). A 256-token sink cache beats a 2,048-token window-only cache by 10×.",
            "**Tests.** Triton eviction vs PyTorch is bit-exact on values; CUDA-graph replay is bitwise equal to eager.",
          ],
        },
        {
          t: "fig",
          fig: "kv-sink-count",
          title: "One sink token is enough",
          caption: "Perplexity over tokens 2K–16K by number of sink tokens (window 1,020). The full cache scores 22.44 on this range.",
        },
      ],
    },
    {
      id: "limits",
      title: "What sinks don't fix",
      blocks: [
        {
          t: "p",
          text: "Sinks give stable fluency, not memory. In a 50-turn chat that plants \"my order ID is 4417\" at turn 1, the sink cache still answers fluently at turn 50, but the fact has been evicted: log p(\"4417\") is −13.7, about 1 in 900,000. Evicted content only comes back by re-retrieving it. This run is an illustration (one sample per config). The controlled versions are written but not run yet.",
        },
      ],
    },
  ],
  links: [{ label: "Code and full results", href: "https://github.com/buttaRahul/Attention_sinks" }],
};

const claimsModel: Work = {
  slug: "claims-foundation-model",
  kind: "case",
  org: "Zynix AI",
  period: "2025 – 26",
  area: "Deep learning · Distributed training",
  title: "A claims foundation model, and a gradient bug that hid in data parallelism",
  cardTitle: "A claims foundation model on multi-GPU nodes",
  short: "Qwen3-4B with LoRA on longitudinal Medicare claims, trained on 4-GPU nodes with a data-parallel trainer I built. Beat XGBoost on 12-month CKD progression.",
  dek: "Qwen3-4B fine-tuned with LoRA on longitudinal Medicare claims, trained on 4× L40S and 4× RTX 4090 nodes with a data-parallel trainer I built, including the fix for a gradient-sync bug.",
  role: "Built the trainer and ran the training",
  metric: { value: "0.674", label: "AUROC on 12-month CKD progression, vs 0.645 for XGBoost" },
  checked: "Held-out claims perplexity; downstream CKD-progression AUROC against the production XGBoost baseline",
  glance: [
    { value: "1.79 → 1.33", label: "held-out claims perplexity" },
    { value: "0.674 vs 0.645", label: "CKD progression AUROC, LoRA model vs XGBoost" },
    { value: "2 × 4 GPUs", label: "L40S and RTX 4090 nodes, data-parallel" },
  ],
  stack: ["PyTorch", "LoRA", "Qwen3-4B", "Data-parallel training", "3D parallelism (Picotron)", "XGBoost"],
  sections: [
    {
      id: "problem",
      title: "Problem",
      blocks: [
        {
          t: "p",
          text: "Our risk models see a member as a fixed vector of engineered features. Claims are really a **sequence**: diagnoses, procedures and fills over years, in order. The question was whether a language model trained on longitudinal claims histories learns structure that feature-engineered XGBoost misses, and whether that shows up on a real clinical prediction task.",
        },
      ],
    },
    {
      id: "built",
      title: "What I built",
      blocks: [
        {
          t: "ul",
          items: [
            "**Continued training of Qwen3-4B with LoRA** on longitudinal claims histories.",
            "**A data-parallel LoRA trainer** for two 4-GPU nodes (4× L40S, 4× RTX 4090) with gradient accumulation.",
            "**A 3D-parallel configuration** (Picotron) tested as the path to scale beyond one node's memory.",
            "**Downstream evaluation** on 12-month chronic kidney disease (CKD) progression against the production XGBoost model.",
          ],
        },
      ],
    },
    {
      id: "bug",
      title: "Hard part: a gradient bug that doesn't crash",
      blocks: [
        {
          t: "p",
          text: "With gradient accumulation, each rank runs several micro-batches before an optimizer step, and the gradients must be averaged across ranks over **all** of them. In our trainer, the all-reduce synchronised only the **last** micro-batch. Each step therefore used a fraction of the global batch that was meant to be averaged.",
        },
        {
          t: "fig",
          fig: "grad-sync",
          title: "What the all-reduce covered",
          caption: "Schematic, 4 micro-batches per step. Correct: accumulate locally, then average the accumulated gradient across ranks once. Bug: only the final micro-batch's gradient was averaged across ranks.",
          wide: true,
        },
        {
          t: "p",
          text: "Bugs like this are dangerous because nothing fails. Loss still goes down, every rank still steps, and throughput looks right. You only see it as a model that is worse than it should be. I found and fixed it before the runs whose results are reported here.",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          t: "fig",
          fig: "claims-results",
          title: "Language-model fit and a downstream clinical task",
          caption: "Held-out claims perplexity before and after LoRA training, and AUROC for 12-month CKD progression, XGBoost baseline vs the LoRA model.",
          wide: true,
        },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      blocks: [
        {
          t: "ul",
          items: [
            "The CKD gain (+0.029 AUROC) is real but modest, and it is one task. A 4B model costs far more to serve than XGBoost, so it is worth it only if the representation transfers across many tasks.",
            "Perplexity on claims tells you the model fits the format, not that it is clinically useful. That is why the downstream comparison is the headline.",
          ],
        },
      ],
    },
  ],
  links: [],
};

const clinical: Work = {
  slug: "capacity-sized-risk-models",
  kind: "case",
  org: "Zynix AI",
  period: "2025 – 26",
  area: "Core ML",
  title: "Risk models sized to the care team, not to Youden's J",
  cardTitle: "Risk models sized to the care team",
  short: "30-day admission, ER and readmission models on 1.18M member-months, with thresholds set by how many patients the care team can actually call.",
  dek: "30-day admission, ER and readmission models (XGBoost) on 1.18M member-months of Medicare claims, with thresholds set by how many patients the care team can actually reach each week.",
  role: "Modelling, validation design, threshold policy",
  metric: { value: "2.4×", label: "higher 30-day precision; weekly flags 1,600 → 300" },
  checked: "Patient-disjoint holdout for discrimination; out-of-time fold for the threshold policy",
  glance: [
    { value: "0.79", label: "AUROC, best model, patient-disjoint holdout" },
    { value: "4.5×", label: "AUPRC lift over the base rate" },
    { value: "1,600 → 300", label: "weekly outreach flags, with 2.4× precision" },
  ],
  stack: ["XGBoost", "Databricks", "Calibration", "Out-of-time validation"],
  sections: [
    {
      id: "problem",
      title: "Problem",
      blocks: [
        {
          t: "p",
          text: "A care team can only call so many patients a week. The models' original cut-offs came from **Youden's J**, which balances sensitivity and specificity. For rare events like a 30-day admission, that threshold flags far more people than anyone can call. Most flags go unread, and the ones that are read have low precision.",
        },
      ],
    },
    {
      id: "built",
      title: "What I built",
      blocks: [
        {
          t: "ul",
          items: [
            "**30-day admission, ER-visit and readmission models** (XGBoost) on 1.18M member-months of Medicare claims in Databricks.",
            "**Thresholds sized to capacity**: the cut-off is chosen so the weekly flag count matches what the care team can work, which puts the highest-precision slice of the ranking in front of them.",
            "**Heart-disease stage-progression models** for 98.5K patients (AUROC 0.76–0.80).",
          ],
        },
      ],
    },
    {
      id: "validation",
      title: "How it was validated",
      blocks: [
        {
          t: "ul",
          items: [
            "**Patient-disjoint holdout.** No member appears in both train and test, so the model can't score well by recognising people. AUROC up to **0.79**, AUPRC **4.5×** the base rate.",
            "**Out-of-time fold for the policy.** The capacity-sized threshold was evaluated on a later period than it was set on. 30-day precision rose **2.4×** and weekly flags fell from about **1,600 to 300**.",
          ],
        },
        {
          t: "note",
          text: "AUROC 0.79 is a moderate number. Most of the value here came from **how** the model is used, not from a better model.",
        },
        {
          t: "fig",
          fig: "capacity",
          title: "Same model, different operating point",
          caption: "Weekly outreach flags and relative 30-day precision under the Youden cut-off vs the capacity-sized threshold, on the out-of-time fold. Precision is shown relative to the Youden threshold.",
          wide: true,
        },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      blocks: [
        {
          t: "ul",
          items: [
            "The precision gain is measured on one out-of-time fold. It should be re-checked as the population and care-team capacity change.",
            "A tighter threshold means fewer people reached. That trade-off belongs to the care team, and the model makes it explicit instead of hiding it in a default cut-off.",
          ],
        },
      ],
    },
  ],
  links: [],
};

const rmsnorm: Work = {
  slug: "fused-rmsnorm-triton",
  kind: "worklog",
  org: "Open source",
  period: "2026",
  area: "ML systems · GPU kernels",
  title: "Fused residual-add + RMSNorm in Triton",
  short: "Forward and backward Triton kernels at 85–89% of peak DRAM bandwidth. 5–9× faster than eager PyTorch, tied with torch.compile, closer to fp32 than stock HF.",
  dek: "Forward and backward Triton kernels for RMSNorm, plus a fused variant that does the residual add in the same pass. Tested against an fp32 reference and gradcheck, benchmarked against eager, torch.compile and F.rms_norm, and swapped into Qwen3-0.6B end to end.",
  role: "Author",
  metric: { value: "85–89%", label: "of peak DRAM bandwidth, the same as a plain copy" },
  checked: "fp32 reference + gradcheck; byte-count model that predicts the speedups; end-to-end logits and training in Qwen3-0.6B",
  glance: [
    { value: "85–89%", label: "of 256 GB/s peak; a plain copy reaches 87%" },
    { value: "5–9×", label: "faster than eager on forward; 8–12× fwd + bwd" },
    { value: "98.4%", label: "top-1 agreement with fp32 logits (HF bf16: 98.0%)" },
  ],
  stack: ["Triton", "PyTorch autograd", "torch.compile", "Qwen3-0.6B"],
  sections: [
    {
      id: "why",
      title: "Why RMSNorm is memory-bound",
      blocks: [
        {
          t: "p",
          text: "Per element the forward does about 4 FLOPs and must move 4 bytes (read 2, write 2 in bf16): roughly **1 FLOP per byte**. The RTX 4060 Laptop's ridge point is about 60 FLOP/byte, so RMSNorm sits about 60× below it. The math is free. The only thing that matters is how many bytes cross the DRAM bus, so the yardstick is **% of peak bandwidth**, not FLOP/s.",
        },
        {
          t: "p",
          text: "Counting what eager PyTorch moves per element, with fp32 intermediates round-tripping through memory, gives **36 bytes against an ideal of 4**:",
        },
        {
          t: "fig",
          fig: "rms-bytes",
          title: "Bytes moved per element, eager vs fused",
          caption: "Forward pass, bf16 in and out. Each eager op reads and writes its intermediate through DRAM; the fused kernel reads x once and writes y once.",
          wide: true,
        },
        {
          t: "p",
          text: "That model predicts eager to be **9×** slower; it measures **8.5–8.9×**. The residual add costs another 6 B, so the fused op predicts 42 / 8 = **5.25×**; it measures **5.0–5.3×**. The speedup is fully explained by not round-tripping intermediates.",
        },
      ],
    },
    {
      id: "implementation",
      title: "Implementation",
      blocks: [
        {
          t: "p",
          text: "**Forward.** Each program normalises a tile of whole rows. `BLOCK_N` is the next power of two of the hidden size, with masked loads for sizes like 2560. Short rows are packed several per program so each program keeps enough bytes in flight. Accumulation is in fp32, and `rstd` is stored per row for backward. In the fused variant `h` is rounded to the storage dtype *before* normalising, so the output matches an unfused bf16 add bit for bit.",
        },
        {
          t: "code",
          code: "dx = rstd · (dy·w − x̂ · mean(dy·w · x̂))   [+ dh]\ndw = Σ_rows dy · x̂",
        },
        {
          t: "p",
          text: "**Backward.** `dx` is per row. `dw` is a reduction over rows, done in two stages: 2 × SMs programs each accumulate a partial in registers and write one row of an fp32 buffer, then a small kernel sums the columns. No atomics, so `dw` is deterministic. An fp64 accumulator path lets `torch.autograd.gradcheck` run on the real kernels.",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          t: "table",
          head: ["Op", "Shape", "Pass", "Triton", "% peak", "vs eager", "vs compile", "vs F.rms_norm"],
          rows: rmsHeadline,
          numeric: [3, 4, 5, 6, 7],
          caption: "RTX 4060 Laptop, bf16. \"vs X\" = X's time ÷ Triton's time; above 1 means Triton is faster.",
        },
        {
          t: "p",
          text: "**End to end in Qwen3-0.6B**, all 113 RMSNorm modules swapped. The bf16 variants can't match bit for bit (HF rounds before multiplying by the weight; the kernel rounds once at the end), so the fp32 model is the arbiter. The Triton model is closer to it than stock HF on mean error, KL and top-1 agreement, and slightly further on the single worst logit.",
        },
        {
          t: "table",
          head: ["vs fp32 model", "mean |Δ|", "max |Δ|", "top-1 agree", "KL"],
          rows: rmsLogits,
          numeric: [1, 2, 3, 4],
        },
        {
          t: "p",
          text: "Training for 100 AdamW steps stays within bf16 noise (max |Δloss| 0.0052 vs 0.0061 for a pure-PyTorch control), and step time drops **1.17×**.",
        },
        {
          t: "fig",
          fig: "rms-step",
          title: "Training step time, Qwen3-0.6B",
          caption: "Batch 1 × 512, median of per-round medians over 4 rounds × 40 steps, variant order rotated.",
        },
        {
          t: "note",
          text: "The 1.17× is larger than RMSNorm's share of FLOPs suggests. At 1 × 512 tokens each norm touches 1 MiB, so it is **launch-bound**: eager is 8 kernels forward and 18 backward, about 2,900 launches per step, replaced by about 340.",
        },
      ],
    },
    {
      id: "limits",
      title: "Where it didn't win",
      blocks: [
        {
          t: "ul",
          items: [
            "**It ties torch.compile on the forward.** Inductor generates essentially the same fused reduction and both hit the copy ceiling.",
            "**The backward wins over compile are shape-dependent** (1.15–1.3× at 4096 rows; a tie at ≥ 8192 rows). This is a heuristic gap, not an architectural advantage.",
            "**Small hidden sizes and few rows:** compile is 5–10% faster at hidden 128–1000 and up to 2× at ≤ 256 rows, where per-call overhead dominates.",
            "**End to end** the gain comes from launch overhead at small batch. With bigger batches the matmuls dominate and it will shrink.",
          ],
        },
      ],
    },
  ],
  links: [{ label: "Code, sweeps and raw data", href: "https://github.com/buttaRahul/fused-rmsnorm-triton" }],
};

export const work: Work[] = [fraud, sinks, claimsModel, clinical, rmsnorm];

export function findWork(slug: string | undefined): Work | undefined {
  return work.find((w) => w.slug === slug);
}

export const moreWork: CompactItem[] = [
  {
    title: "On-device voice and vision agent on Jetson AGX Orin",
    stat: "LLaVA-1.5 7B in 4-bit AWQ, on-device",
    org: "Carnot Research",
    year: "2025",
    text: "End to end from flashing the board: faster-whisper ASR, LLaVA-1.5 7B quantised to 4-bit with AWQ, Chatterbox TTS, and an attention-sink KV cache for long sessions.",
  },
  {
    title: "Multilingual graph-neural retrieval (GFM-RAG), 12 Indian languages",
    stat: "Recall@10 59.8% → 77.3%",
    org: "Carnot Research",
    year: "2025",
    text: "Productionised GNN retrieval over a document knowledge graph. Macro Recall@10 59.8% → 77.3% and multi-hop success 52% → 72% vs ColBERTv2.",
  },
  {
    title: "Live cricket event detection with VideoMAE",
    stat: "~74% precision, beat the VLMs",
    org: "VideoVerse",
    year: "2024",
    text: "Fine-tuned VideoMAE in a production ensemble with VLMs serving Disney+ Hotstar; about 74% precision on the 2 priority event classes, where it beat the VLMs. Rare-event imbalance, DeepSpeed mixed precision, Ray on H100s.",
  },
  {
    title: "Keystroke-dynamics fraud features",
    stat: "+12 pts fraud-detection accuracy",
    org: "Dronapay",
    year: "2024",
    text: "Behavioural-biometric features that raised fraud-detection accuracy by 12 points; transaction-delinquency models on a serverless stack.",
  },
  {
    title: "Clinical Triage Navigator",
    stat: "RL environment, asymmetric reward",
    org: "Open source",
    year: "2026",
    text: "OpenEnv reinforcement-learning environment for emergency-department triage, with an asymmetric reward: under-triage costs more than over-triage.",
    href: "https://github.com/buttaRahul/clinical_triage_env",
    linkLabel: "Code",
  },
  {
    title: "Image captioning with visual attention",
    stat: "BLEU-4 23.4 on Flickr8k",
    org: "Open source",
    year: "2024",
    text: "Frozen EfficientNetB0 regions + 2-layer Transformer decoder. BLEU-4 23.4 with beam search on a held-out Flickr8k test set.",
    href: "https://github.com/buttaRahul/Image-Caption-Generation",
    linkLabel: "Code",
  },
];

export const alsoBuilt: CompactItem[] = [
  {
    title: "Multi-client calling agent",
    org: "Zynix AI",
    year: "2026",
    text: "Modular LangGraph architecture with per-client call flows from config; streaming speech enhancement (fine-tuned DeepFilterNet) and two-stage voicemail detection.",
  },
  {
    title: "Sachet disaster-alert chatbot",
    org: "Carnot Research",
    year: "2025",
    text: "Sole developer: QLoRA fine-tuning of Qwen 7B for the citizen chatbot in India's national disaster-alert app.",
  },
  {
    title: "Natural-language fraud rules → JSONLogic",
    org: "Dronapay",
    year: "2024",
    text: "LoRA-tuned Llama 2 7B with retrieval over system metadata: 82% logical and 74% execution accuracy.",
  },
  {
    title: "Enterprise Search",
    org: "Open source",
    year: "2026",
    text: "LangGraph search agent over email, SQL, site and web, with an AST-guarded SQL subgraph, evaluated against a ReAct baseline.",
    href: "https://github.com/buttaRahul/enterprise_serach",
    linkLabel: "Code",
  },
  {
    title: "Indic speech and translation",
    org: "Carnot Research",
    year: "2025",
    text: "Fine-tuned TTS and a neural machine-translation model for a low-resource Indian language for a government client.",
  },
];
