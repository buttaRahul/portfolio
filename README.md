# Rahul Aditya Butta — portfolio

Personal site: core ML, deep learning and ML systems work, written up as case
studies and worklogs with measured results. Includes an interactive KV-cache
explorer driven by the measurements in
[Attention_sinks](https://github.com/buttaRahul/Attention_sinks).

Research and design rationale: [`docs/ml-portfolio-research-and-plan.md`](docs/ml-portfolio-research-and-plan.md).

## Run

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve dist/ on http://localhost:4173
```

Node 20+.

## Edit content

All copy and numbers live in typed data files; components don't hold content.

| File | What it holds |
|---|---|
| `src/data/site.ts` | name, links, hero proof metrics, experience, publication, toolkit |
| `src/data/work.ts` | the five case studies / worklogs, "More work", "Also built" |
| `src/data/measurements.ts` | measured tables behind every chart (copied from public READMEs) |

Rule: every number must trace to the resume PDF (`public/assets/resume/`) or a
public README. Charts draw straight lines between measured points and mark
anything past the last measurement as not measured.

Case-study body text supports `**bold**`, `*italic*`, `` `code` `` and `[label](url)`.
Figures are referenced by id (`src/data/types.ts` → `FigId`) and rendered in
`src/components/Figures.tsx`.

## Deploy

Vercel: import the repo; `vercel.json` sets the build and SPA rewrites.
Netlify: `public/_redirects` handles SPA routing.

Set `VITE_SITE_ORIGIN` (for example `https://rahul-aditya.vercel.app`) once the
domain is known, so canonical and Open Graph URLs point at it. On Vercel and
Netlify the build falls back to the platform's URL automatically.

The share image `public/og.png` is generated from `scripts/og.html` with
`scripts/make-og.sh` (needs Google Chrome).
