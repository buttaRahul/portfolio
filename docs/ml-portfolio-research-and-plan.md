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

**Implication:** one identity line naming the track. Rahul chose a single
track (core ML + deep learning + ML systems), so a single site without lenses
is enough; AI-engineer work stays as supporting breadth.

### 2.5 Live demos help only when they show the work

Hugging Face Spaces/Gradio demos are a common portfolio element, and HF's own
roles use demo-building as a work sample. [D1–D2] For Rahul, most professional
work is private (Medicare claims, government clients), so a live model demo
of that work is not possible. **The demo that pays off is an interactive
explainer driven by his own measured data** (§4.4), not a chatbot wrapper.

### 2.6 Design research: what looks credible to ML reviewers

- **ML has its own design tradition.** Distill (Olah, Carter) defined it:
  articles judged on "outstanding communication", interactive figures where
  they communicate better than static ones, and design review as part of peer
  review. Anthropic's transformer-circuits.pub continues it with mobile-friendly
  HTML, linkable sections and inline interactive diagrams. Hohman et al.
  (Distill 2020) give the theory behind interactive articles. [G1–G3] To an
  ML reviewer this register reads as "one of us" in a way agency-style
  portfolio design does not.
- **Explorable explanations.** Ciechanowski's essays (sliders + diagrams,
  vanilla JS + inline SVG) and Bret Victor's "Explorable Explanations" show that
  the reader manipulating the real system is the signal. [G4–G5]
- **2026 web trends** (agency blogs, so opinion): type as the primary visual
  in place of hero imagery, interactive data integrated into the page,
  editorial/magazine layouts. "Polished is the new generic" (DesignRush). [G6–G7]
- **Developer sites that work for recruiters** (Brittany Chiang, leerob.io)
  are restrained: clear specialty in the first line, type and projects, no
  effects that delay the content. [G8]

**Synthesis → direction "Figure 1":** a research-note site. Big confident
type for the claim, then *figures* as the main visual content: numbered,
captioned, real data, a few interactive. Margin notes on desktop for caveats
and methodology (Tufte/Distill). Restraint everywhere else. Spectacle comes
only from the figures, and they show Rahul's actual results.

### 2.7 Limits of this research

No source gives a controlled measurement of portfolio style against interview
rate. The recommendations combine hiring-practitioner guidance (Huyen), job
postings, and the earlier UX/hiring research. Statistics from career-blog
aggregators are flagged where used.

## 3 Applying it to Rahul's profile

### 3.1 What is rare about this profile

1. **Production ML with outcomes checked externally.** The fraud system had no
   labels; 5 suppliers were later excluded for fraud, and all 5 were already in its
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

**Decisions (13 Nov 2026):** one site, no lenses. Target: Senior ML Engineer
/ MLE II–III roles in **core ML, deep learning and ML systems**. LLM-app /
agent / RAG-app ("AI engineer") work is kept but moved to the background.
Employer detail is decided per project (below). The KV-cache explorer is the
signature interaction. The design is new, not Ravi's.

On level: about 1.7 years full-time plus internships. The site never claims a
title; it shows senior-level *scope*: sole ownership, system design, validation
design, debugging distributed training. That is what senior screens check.

### 4.1 Information architecture

```
/                 Home (single page: claim, selected work, explorer, more work, experience, contact)
/work/<slug>      Case study or worklog
/resume.pdf       Direct link (header button)
*                 404
```

### 4.2 Homepage, top to bottom

1. **Hero:** name, identity line, three proof metrics (*5 of 5 later
   fraud exclusions already in the top 0.53%*, *perplexity within 6% of full
   cache at constant memory*, *85–89% of peak bandwidth*), **Resume** and
   **Email** buttons. Live "attention field" behind it.
2. **Selected work:** 5 entries, each a summary row (problem, what I built,
   how it was checked, figure thumbnail).
3. **Fig. — KV-cache explorer** inline (§4.4).
4. **More work:** compact one-line list of everything else, core ML / DL
   first, AI-engineer items last.
5. **Experience timeline + publication + education.**
6. **Contact:** email with copy button, LinkedIn, GitHub, Kaggle.

### 4.3 Case studies (first release: 5 deep + compact entries)

| Order | Case | Kind | Employer detail |
|---|---|---|---|
| 1 | Fraud & waste detection without labels | Core ML | Problem, constraints, validation design and results only. Signals and models stay private (Zynix). No supplier data. |
| 2 | Attention-sink KV cache | Systems / worklog | Fully public: README tables and figures |
| 3 | Claims foundation model + multi-GPU LoRA | DL + systems | Engineering-level: the gradient-sync bug and how it was found, perplexity and CKD comparison. No data. |
| 4 | Clinical risk + capacity thresholds | Core ML | Method-level: holdout design, threshold policy, outcome numbers |
| 5 | Fused residual-add + RMSNorm | Systems / worklog | Fully public |

Compact list (one line + key number): Jetson AGX Orin agent (systems), VideoMAE
event detection (DL), multilingual GraphRAG with GNN retrieval (DL), Dronapay
keystroke dynamics (classical), Image captioning, QueryAssist paper, Clinical
Triage RL env. Last, as "Also built": voice agent, Sachet QLoRA chatbot,
NL→JSONLogic, Enterprise Search.

Earlier draft of the case table, kept for figure ideas:

Each uses the same schema: dek, role and timeframe, problem, constraints, what
I built, hard parts, **how it was validated**, metrics, **what didn't work /
limits**, stack, links. Lens-specific dek and metric order.

| Case | Source of truth | Figure |
|---|---|---|
| Fraud & waste detection on DME claims | Resume | Risk-tier ranking strip showing where the 5 later fraud exclusions fell |
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

### 4.5 Visual direction: "Figure 1" (see §2.6)

- **Grammar:** numbered figures with mono captions ("Fig. 2 — Decode latency
  vs context"), axis ticks, confidence bands, margin notes on wide screens.
  Every chart is real data. The accent colour always marks *Rahul's result*;
  baselines are neutral ink.
- **Type:** *Geist* for headings and UI (large, tight, confident), *Geist
  Mono* for numbers, labels and captions, *Source Serif 4* for long-form
  worklog body text (Distill lineage, readable). No Fraunces.
- **Colour:** light = cool off-white paper + near-black ink; dark = graphite +
  warm white. A single vermilion accent, plus one muted blue for a second
  series. Hairline rules and a faint baseline grid.
- **Live background, "attention field":** a sparse field of token dots behind
  the hero. The pointer is the query: nearby dots draw faint attention lines to
  it, and four fixed *sink* dots at the top-left always take a share. It
  explains attention sinks without words. Canvas, ~2 KB, paused off-screen,
  disabled under reduced motion.
- **Motion:** content first, no intro animation; restrained reveal-on-scroll;
  chart lines draw in once; explorer transitions tied to the slider.
- **Theme:** light/dark toggle with a no-flash inline script.

### 4.6 Copy rules

- Lead with the result, then the method. "All 5 suppliers later excluded for fraud
  were already in the top 0.53%", not "Built an anomaly-detection
  ensemble".
- Every number traces to the resume or a README. Nothing rounded up.
- First person, plain, short. No "passionate", no "cutting-edge".
- Name the failure modes. They are a selling point here (§2.2).

### 4.7 Technical approach

- **Rebuild in place** in `~/Dev/per/rahul/portfolio`: Vite + React 19 +
  TypeScript + react-router 7, the same stack as Ravi's site. Remove MUI,
  Bootstrap, react-spring and the other unused dependencies. Old components
  are deleted; history stays in git.
- Written fresh (small, no animation libraries). Only the no-flash theme
  pattern is borrowed from Ravi's site.
- Content lives in typed data files (`src/data/*.ts`). Charts are hand-built
  SVG (no chart library), so they render crisply in both themes.
- SEO/sharing: per-lens `<title>`/description, JSON-LD `Person`, OG image.
- Deploy: `vercel.json` SPA rewrites (keep Netlify `_redirects` too).
- Budgets: < 150 KB JS gzipped, LCP < 2 s on 4G, keyboard and
  screen-reader pass, reduced-motion pass.
- Commits: local only, author `buttaRahul <butta.rahul.aditya@gmail.com>`,
  no AI attribution trailers. You push from your personal machine.

### 4.8 Execution order

1. Scaffold the new stack, design tokens, theme. *(commit)*
2. Data model + all content from the resume and READMEs. *(commit)*
3. Home page: hero + attention field, selected work, more work, experience, contact. *(commit)*
4. Case-study template + 5 deep cases + figures. *(commit)*
5. KV-cache explorer. *(commit)*
6. 404, SEO/OG, deploy config. *(commit)*
8. QA: build, mobile widths, both themes, reduced motion, keyboard, Lighthouse. Fix. *(commit)*

### 4.9 Measuring ROI after launch

Send links with a source tag in applications (`/?src=<company>`). Optional
Vercel Web Analytics tracks resume clicks and email copies as intent signals. The real metric is interview conversations per application
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
- [G1] Distill journal — https://distill.pub/journal/ · Nature on Distill — https://blogs.nature.com/naturejobs/2018/04/16/machine-learning-gets-a-journal-for-interactive-figures/
- [G2] Hohman et al., "Communicating with Interactive Articles", Distill 2020 — https://distill.pub/2020/communicating-with-interactive-articles/
- [G3] Transformer Circuits Thread — https://transformer-circuits.pub · Simon Willison on its format — https://simonwillison.net/b/8598
- [G4] FlowingData on Ciechanowski — https://flowingdata.com/tag/bartosz-ciechanowski
- [G5] Bret Victor, Explorable Explanations — https://worrydream.com/ExplorableExplanations/
- [G6] Line25, Web design trends 2026 — https://line25.com/articles/web-design-trends-2026/
- [G7] DesignRush, "Polished is the new generic" — https://www.designrush.com/trends/design-trends
- [G8] Best developer portfolios and why they work — https://dev.to/jtrevdev/best-developer-portfolio-websites-and-why-they-work-3bdk
