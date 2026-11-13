# Rahul Aditya — ML portfolio research and rebuild plan

Date: 13 Nov 2026. Builds on the earlier research done for Ravi's site
(`~/Dev/per/portfolio/docs/portfolio-research-and-blueprint.md`); the general
findings there still hold and are summarised in §1. §2 adds what is specific
to machine-learning hiring, §3 applies it to Rahul's actual profile, §4 is the
plan.

---

## 1 What carries over from the earlier research

These held up for Ravi and apply unchanged:

- **Reviewers need an argument they can inspect, not a gallery.** Each featured
  project answers: what changed, what *you* owned, why that approach, how the
  result was checked (NN/g portfolio survey of 204 hiring reviewers).
- **Three reading depths.** 10-second summary → 1-minute case summary →
  optional deep dive. The first screen and one project must be enough on
  their own.
- **Few, deep case studies beat many cards.** Curated case studies were the
  highest-ROI pattern; "generalist template with many skill badges" was the
  one to avoid.
- **One focused interactive explanation is worth more than ambient spectacle**,
  and it must have a static equivalent.
- **The site is itself evidence of engineering quality**: fast, accessible,
  works on mobile, resume reachable in one click.
- **ROI = qualified conversations per hour invested**, not page views or
  animation engagement.
- **Role lenses instead of two sites.** Ravi's `/backend` and `/android`
  editions share one codebase and one set of case studies, but reorder
  projects, metrics and copy for the role being applied to. This was the answer
  to the "two sites?" question and it transfers directly.

## 2 New research: what moves ML hiring specifically

### 2.1 The strongest signal is past work similar to the job, then public proof of initiative

Chip Huyen (*ML Interviews* book, §2.1.3) ranks past experience similar to the
role as the strongest signal; after that come open-source contributions,
Kaggle placings, papers and "in-depth technical blog posts". In her survey
(n = 2,458, noisy), over 50% of respondents picked GitHub/Kaggle as the signal
they look at. She also cites the 7.4-second first resume scan: *"If you're a great ML
engineer but can't signal to recruiters that you're amazing in those 7.4
seconds, you're out."* [H1]

In her startup-hiring post she says most resumes carry a long skills list and
that this is a poor strategy: she wants to see a skill *used* in the work, plus
initiative and persistence. [H2]

**Implication:** delete the skills-badge wall. Every technology on the page
should appear attached to a result.

### 2.2 Evaluation rigour is the differentiator for ML

Across 2026 ML/AI-engineering hiring guides the recurring theme is: show the
baseline, the validation design, and the failure modes, not just the model
(DataTalks.Club, dataexpert.io, multiple others). One guide claims "has an
eval suite" is the #1 portfolio signal in hiring-manager surveys; I could not
verify the survey, so treat it as directional. [E1–E3]

Metrics need business translation: "AUC 0.91 means little to a hiring manager
on its own" (Jobscan). The same point applies to operating thresholds,
capacity and cost. [E4]

**Implication:** each case study gets an explicit *How it was validated* block
(holdout design, baseline, external check) and a *What didn't work* block.
Rahul's READMEs already do this unusually well ("Where it didn't win",
"what sinks don't fix"), and few portfolios do.

### 2.3 For systems/inference roles, public kernels and inference code are close to a requirement

2026 job posts for inference and GPU-kernel roles (NVIDIA Senior Inference
Engineer, Sciforium GPU Kernel Engineer, RadixArk, OpenAI AMD enablement,
Together AI) list open-source work on Triton, vLLM, FlashInfer or similar
projects as either a "way to stand out" or a minimum requirement. They name
Triton next to CUDA and ask for an understanding of how kernel choices affect
model-level throughput. [J1–J4]

The long-form **worklog** is the established format for this work: Simon
Boehm's CUDA matmul worklog (he is now on Anthropic's performance team), and
the H100 sequels to it. These posts are cited as references for years. [W1–W2]

**Implication:** Rahul's `fused-rmsnorm-triton` and `Attention_sinks` READMEs
are already worklogs, with bandwidth accounting, ablations, CIs and negative
results. Publishing them as on-site technical notes is the cheapest high-signal
move available. The writing exists; it needs a home and good figures.

### 2.4 Specialise the pitch, keep breadth as evidence

2026 hiring commentary consistently reports fragmentation of the "ML Engineer"
title into distinct tracks (applied/LLM, ML infra/inference, research
engineering), with large comp variance between them. Reviewers screen for one
track. [S1–S2] These sources are directional (blogs and aggregators, not
labour-market data).

**Implication:** one identity line, then **role lenses** (the same mechanism
as Ravi's site) so the application link leads with the matching track.

### 2.5 Live demos help only when they show the work

Hugging Face Spaces/Gradio demos are a common portfolio element, and HF's own
roles use demo-building as a work sample. [D1–D2] For Rahul, most professional
work is private (Medicare claims, government clients), so a live model demo
of that work is not possible. **The demo that pays off is an interactive
explainer driven by his own measured data** (§4.4), not a chatbot wrapper.

### 2.6 Limits of this research

No source gives a controlled measurement of portfolio style against interview
rate. The recommendations combine hiring-practitioner guidance (Huyen), job
postings, and the earlier UX/hiring research. Statistics from career-blog
aggregators are flagged where used.

## 3 Applying it to Rahul's profile

### 3.1 What is rare about this profile

1. **Production ML with outcomes checked externally.** The fraud system had no
   labels; HHS-OIG later excluded 5 suppliers, and all 5 were already in its
   top 0.53% risk tier. Few candidates at any level can show an
   out-of-sample check like this. It should be the lead case.
2. **Thresholds set by business constraints.** Replacing Youden cut-offs with
   thresholds sized to care-team capacity cut weekly flags from about 1,600 to
   300 and raised precision 2.4×. This answers the "AUC means nothing to me"
   objection from §2.2.
3. **Goes down the stack when it matters.** Triton kernels at 85–89% of peak
   bandwidth, an attention-sink KV cache with a bf16 drift bug found and fixed,
   a data-parallel gradient-sync bug fixed on 4-GPU nodes, AWQ on a Jetson.
   Applied MLEs rarely have this; systems candidates rarely have production
   applied wins.
4. **Breadth that is real**: LLMs, GraphRAG across 12 languages, speech,
   video, classical ML, and a Best Paper Award.
5. **Honest measurement.** CIs, controls, and "where it didn't win" sections.
   This is the trait §2.2 says reviewers look for.

**Proposed identity line:** *Machine learning engineer. I ship models that
hold up in production, and I go down to the kernel when that's what it
takes.* (Draft; final copy in §4.6.)

### 3.2 Audit of the current site (github.com/buttaRahul/portfolio)

| Keep | Fix |
|---|---|
| Accurate, specific numbers in `resumeData.js` | 25+ equal-weight cards: the strongest work is diluted by student projects |
| Resume PDF, photo, links | Seven category tabs; recruiters don't filter, they skim |
| Publication with Best Paper | MUI + Bootstrap template look from 2023; nothing distinctive |
| Open-source links | Professional work has no story, figures or validation detail |
| | No technical writing, despite READMEs that are excellent writing |
| | LeetCode link: low signal for MLE and competes for attention |
| | No role-specific entry point to send with an application |
| | No OG image/meta, so shared links unfurl poorly |

### 3.3 Level and claims discipline

About 1.7 years full-time (Mar 2025 →) plus four internships. Position as
**ML Engineer** and do not imply "Senior". Every number on the site comes from
the resume or a public README. Employer work is described at the level the
resume already discloses, with abstract diagrams and no internal data.

## 4 Plan

### 4.1 Information architecture

```
/                       → redirects to the default lens (/applied)
/applied                Home, Applied ML & LLMs lens
/systems                Home, ML systems & inference lens
/:lens/work/<slug>      Case study (same content, lens reorders metrics/emphasis)
/:lens/notes/<slug>     Technical notes (worklogs)
/:lens/about            Background, timeline, publication, education
/resume.pdf             Direct link (also header button)
```

Lens = the `?role` mechanism from Ravi's site (`RoleContext`, `withRole`),
renamed. Each application gets a link with the matching lens.

| Lens | Hero emphasis | Featured order |
|---|---|---|
| Applied ML & LLMs | Production models with checked outcomes | Fraud detection → Clinical risk + thresholds → GraphRAG → Claims LLM → Voice agent |
| ML systems & inference | Kernels, KV caches, distributed training | Attention sinks → fused RMSNorm → Claims LLM multi-GPU → Jetson agent → Fraud detection |

### 4.2 Homepage, top to bottom

1. **Hero:** name, identity line, lens switch, three proof metrics chosen per
   lens (e.g. *5/5 later OIG exclusions in top 0.53%*, *1,600 → 300 weekly
   flags*, *89% of peak bandwidth*), plus **Resume** and **Email** buttons.
2. **Selected work:** 4–5 case studies, each a summary card (problem, what I
   built, how it was checked, one figure).
3. **Signature explainer:** the KV-cache explorer (§4.4).
4. **Technical notes:** 2 worklogs.
5. **More work:** compact list of the remaining professional projects and
   the stronger open-source ones (one line each, no cards).
6. **Experience timeline + publication.**
7. **Contact:** email with copy button, LinkedIn, GitHub, Kaggle.

### 4.3 Case studies (first release: 4 deep + compact entries)

Each uses the same schema: dek, role and timeframe, problem, constraints, what
I built, hard parts, **how it was validated**, metrics, **what didn't work /
limits**, stack, links. Lens-specific dek and metric order.

| Case | Source of truth | Figure |
|---|---|---|
| Fraud & waste detection on DME claims | Resume + Rahul to confirm | 5-layer pipeline diagram; risk-tier ranking strip showing where the 5 OIG exclusions fell |
| Clinical risk + capacity thresholds | Resume | Diagram: Youden cut-off vs capacity cut-off (1,600 → 300/wk, 2.4× precision) |
| Attention-sink KV cache | Public README (real tables) | Memory and latency vs context, from the measured tables |
| Fused residual-add + RMSNorm in Triton | Public README (real tables) | Bytes-moved bar (36 B vs 4 B per element); bandwidth vs eager/compile |
| Compact: Claims foundation model, GraphRAG, Jetson agent, voice agent, Sachet, VideoMAE, Dronapay, Enterprise Search, Clinical Triage env, QueryAssist paper | Resume / READMEs | none |

Dropped from the site (kept on GitHub): Fake news, Credit card approval,
Twitter sentiment, virtual mouse, road signs and other coursework.

### 4.4 Signature interaction: KV-cache explorer

A context-length slider (1K → 64K tokens) that plays back **Rahul's measured
numbers** from the Attention_sinks README:

- **Memory:** full cache grows 1,258 → 6,522 MiB, then OOM at 50,176; sinks
  stay flat at ~1,378 MiB.
- **Decode latency:** 20.8 → 62.2 ms/token for the full cache vs 22.5 → 25.1
  for sinks, with the cache-copy share highlighted (33.1 ms at 32K).
- **Quality:** perplexity per range, full vs sinks vs window-only (the 14×
  collapse).
- A token strip shows 4 sink tokens pinned, a sliding window, and evicted
  tokens greying out.

Points between measurements are drawn as interpolated and labelled as such.
Includes a static table equivalent and works with reduced motion. It
demonstrates the skill, uses real data, and ties into the case study.

Optional, second release: **threshold explainer** for the capacity case, using
only the published endpoints (no invented curve).

### 4.5 Visual direction: "Measured"

A look of its own, so it is not a recolour of Ravi's site. The graphic
language is the language of ML work: plots, axes, tick marks, confidence
bands and annotations.

- **Surfaces:** warm paper (light) and graphite (dark), with a toggle. Same
  approach as Ravi's because it tested well, but a different palette and type.
- **Type:** a sharp grotesk for headings (e.g. *Instrument Sans* / *Geist*)
  and a mono for numbers and annotations (*JetBrains Mono*). No Fraunces, so
  the two sites stay distinct.
- **Accent:** one signal colour (e.g. a saturated vermilion or electric teal)
  used for the metric that matters on each chart.
- **Live background: "attention field".** A sparse grid of token dots. The
  pointer acts as a query, and nearby dots draw faint attention lines to it,
  weighted by distance. The first 4 dots are *sinks* and always draw some
  attention. Subtle, on theme, off under `prefers-reduced-motion`. Built on
  Ravi's `LiveField` engine.
- **Motion:** reveal-on-scroll, chart lines that draw in, pointer cursor
  states. Reused from Ravi's `motion/` module and retuned.

### 4.6 Copy rules

- Lead with the result, then the method. "All 5 suppliers the HHS-OIG later
  excluded were already in the top 0.53%", not "Built an anomaly-detection
  ensemble".
- Every number traces to the resume or a README. Nothing rounded up.
- First person, plain, short. No "passionate", no "cutting-edge".
- Name the failure modes. They are a selling point here (§2.2).

### 4.7 Technical approach

- **Rebuild in place** in `~/Dev/per/rahul/portfolio`: Vite + React 19 +
  TypeScript + react-router 7, the same stack as Ravi's site. Remove MUI,
  Bootstrap, react-spring and the other unused dependencies. Old components
  are deleted; history stays in git.
- Port from Ravi's codebase: theme toggle and no-flash script, `RoleContext`
  → `LensContext`, reveal/cursor/smooth-scroll motion, `LiveField` engine. All
  content and design tokens are new.
- Content lives in typed data files (`src/data/*.ts`). Charts are hand-built
  SVG (no chart library), so they render crisply in both themes.
- SEO/sharing: per-lens `<title>`/description, JSON-LD `Person`, OG image.
- Deploy: `vercel.json` SPA rewrites (keep Netlify `_redirects` too).
- Budgets: < 150 KB JS gzipped, LCP < 2 s on 4G, keyboard and
  screen-reader pass, reduced-motion pass.
- Commits: local only, author `buttaRahul <butta.rahul.aditya@gmail.com>`,
  no AI attribution trailers. You push from your personal machine.

### 4.8 Execution order

1. Scaffold the new stack, port engine pieces, add design tokens and theme. *(commit)*
2. Data model + all content from the resume and READMEs. *(commit)*
3. Home page with lenses, hero, selected work, more work, contact. *(commit)*
4. Case-study template + 4 deep cases + figures. *(commit)*
5. KV-cache explorer. *(commit)*
6. Notes: 2 worklogs adapted from the READMEs. *(commit)*
7. About/timeline, 404, SEO/OG, deploy config. *(commit)*
8. QA: build, mobile widths, both themes, reduced motion, keyboard, Lighthouse. Fix. *(commit)*

### 4.9 Measuring ROI after launch

Send lens-specific links in applications (`/applied?src=<company>` style).
Optional Vercel Web Analytics tracks resume clicks and email copies per lens
as intent signals. The real metric is interview conversations per application
batch, compared with applications sent with the resume alone.

## Sources

- [H1] Chip Huyen, *ML Interviews*, §2.1.3 "What signals companies look for" — https://huyenchip.com/ml-interviews-book/contents/2.1.3-what-signals-companies-look-for-in-candidates.html
- [H2] Chip Huyen, "What we look for in a candidate" (2023), via summaries — https://huyenchip.com/2023/01/24/what-we-look-for-in-a-candidate.html
- [E1] DataTalks.Club, ML portfolio projects — https://datatalks.club/podwiki/wiki/machine-learning-portfolio-projects/
- [E2] dataexpert.io, AI engineering portfolios (2026) — https://www.dataexpert.io/blog/ultimate-guide-ai-engineering-portfolios
- [E3] AI Tech Connect, proof-of-work portfolio (2026) — https://aitechconnect-976.pages.dev/tips/ai-engineer-portfolio-proof-of-work-2026
- [E4] Jobscan, ML resume examples — https://www.jobscan.co/resume-examples/computer-engineering/machine-learning-resume
- [J1] NVIDIA, Senior Inference Engineer, GPU Kernel Optimization — https://jobs.anitab.org/companies/nvidia/jobs/87705160-senior-inference-engineer-gpu-kernel-optimization
- [J2] Sciforium, GPU Kernel Engineer — https://jobs.signalfire.com/companies/sciforium/jobs/84066418-gpu-kernel-engineer
- [J3] RadixArk, MTS Developer Technology — https://jobs.accel.com/companies/radixark-2/jobs/87271240-member-of-technical-staff-developer-technology
- [J4] Together AI, LLM Inference Frameworks and Optimization Engineer — https://resumegeni.com/jobs/llm-inference-frameworks-and-optimization-engineer-togetherai-50f860d444
- [W1] Simon Boehm, CUDA matmul worklog (mirror) — https://gwern.net/doc/www/siboehm.com/d4b3e9d6de0655f490fe6369f4d004936248a833.html
- [W2] "Outperforming cuBLAS on H100: a Worklog" — https://cudaforfun.substack.com/p/outperforming-cublas-on-h100-a-worklog
- [S1] Built In, specialization over generalization — https://builtin.com/articles/specialization-over-generalization-tech-careers
- [S2] The New Stack, AI engineering roles emerging — https://thenewstack.io/ai-engineering-roles-emerging/
- [D1] Hugging Face, Senior MLE Voice Agents posting — https://apply.workable.com/huggingface/jobs/view/9E2A4C02C7
- [D2] Towards AI, ML portfolio on HF Spaces — https://towardsai.com/p/l/build-your-machine-learning-portfolio-using-hugging-face-spaces
- Eye-tracking caveats (7.4 s, 2018 Ladders; 11.2 s, 2025 InterviewPal) — https://standout-cv.com/?p=4368 · https://www.interviewpal.com/blog/how-long-recruiters-actually-spend-reading-your-resume-data-study
- Eugene Yan, "Why have a data science portfolio and what it shows" — https://eugeneyan.com/writing/data-science-portfolio-how-why-what/
