import { Link } from "react-router-dom";
import { AttentionField } from "../components/AttentionField";
import { CopyEmail } from "../components/CopyEmail";
import { Figure } from "../components/Figures";
import { KVExplorer } from "../components/KVExplorer";
import { RESUME_HREF, education, experience, proof, publication, site, toolkit } from "../data/site";
import { alsoBuilt, moreWork, work } from "../data/work";
import type { CompactItem } from "../data/types";
import { useReveal } from "../lib/hooks";

function Compact({ items }: { items: CompactItem[] }) {
  return (
    <ul className="compact">
      {items.map((it) => (
        <li key={it.title} data-reveal>
          <span className="c-meta">
            {it.org} · {it.year}
          </span>
          <h3>{it.title}</h3>
          <p>{it.text}</p>
          {it.href && (
            <a className="c-link" href={it.href} target="_blank" rel="noreferrer">
              {it.linkLabel ?? "Link"} ↗
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Home() {
  useReveal("home");

  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <AttentionField />
        <div className="wrap hero-inner">
          <div className="hero-id">
            <span className="name">{site.name}</span>
            <span className="kicker">
              {site.role} · {site.location}
            </span>
          </div>
          <h1 id="hero-title">
            I build ML that holds up in production,{" "}
            <span className="soft">and go down to the kernel when that's what it takes.</span>
          </h1>
          <p className="lede">
            Core ML, deep learning and ML systems: fraud and risk models on Medicare claims, LoRA training across multi-GPU nodes, Triton kernels
            and KV caches. Every project here says how it was checked, and every number comes with its measurement.
          </p>
          <div className="hero-actions">
            <a className="btn btn-solid" href="#work">
              Selected work
            </a>
            <a className="btn" href={RESUME_HREF} target="_blank" rel="noreferrer">
              Resume (PDF)
            </a>
            <a className="btn" href={`mailto:${site.email}`}>
              Email me
            </a>
          </div>

          <div className="proof">
            {proof.map((p) => (
              <Link key={p.slug} to={`/work/${p.slug}`}>
                <span className="value">{p.value}</span>
                <span className="label">{p.label}</span>
                <span className="src">See how it was measured →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section wrap" id="work" aria-labelledby="work-title">
        <div className="section-head">
          <div>
            <h2 id="work-title">Selected work</h2>
            <p>Five projects, each written up with the problem, what I built, how it was validated, and where it falls short.</p>
          </div>
          <span className="kicker">{work.length} case studies</span>
        </div>
        <ol className="work-list">
          {work.map((w, i) => (
            <li className="work-row" key={w.slug} data-reveal>
              <Link to={`/work/${w.slug}`}>
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="meta">
                    <span className="kicker">{w.org}</span>
                    <span className="kicker">{w.period}</span>
                    <span className="kicker">{w.area}</span>
                  </div>
                  <h3>
                    {w.title}
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </h3>
                  <p className="short">{w.short}</p>
                  <p className="checked">
                    <b>Checked</b>
                    {w.checked}
                  </p>
                </div>
                <div className="metric">
                  <span className="value">{w.metric.value}</span>
                  <span className="label">{w.metric.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap" id="explorer" aria-labelledby="explorer-title">
        <div className="section-head">
          <div>
            <h2 id="explorer-title">The memory wall, measured</h2>
            <p>
              Grow the context and watch what a full KV cache costs against my attention-sink cache. Every dot is a measurement from the{" "}
              <Link to="/work/attention-sinks">attention-sinks worklog</Link>.
            </p>
          </div>
          <span className="kicker">Interactive</span>
        </div>
        <Figure
          n={1}
          title="Full cache vs sink cache, as the context grows"
          caption="Qwen3-0.6B, bf16, RTX 4060 Laptop 8 GB, PG19 streamed one token at a time. Lines between measured points are drawn straight; values past the last measurement are marked as not measured."
        >
          <KVExplorer />
        </Figure>
      </section>

      <section className="section wrap" id="more" aria-labelledby="more-title">
        <div className="section-head">
          <div>
            <h2 id="more-title">More work</h2>
            <p>Shorter notes on the rest, with the key number for each.</p>
          </div>
        </div>
        <Compact items={moreWork} />
        <div className="subhead">
          <h3>Also built</h3>
          <p>LLM applications and agents</p>
        </div>
        <Compact items={alsoBuilt} />
      </section>

      <section className="section wrap" id="experience" aria-labelledby="exp-title">
        <div className="section-head">
          <div>
            <h2 id="exp-title">Experience</h2>
          </div>
        </div>
        <ol className="timeline">
          {experience.map((r) => (
            <li key={r.org + r.period} data-reveal>
              <span className="when">{r.period}</span>
              <div>
                <h3>
                  {r.org}
                  {r.orgNote && <span className="org-note"> · {r.orgNote}</span>}
                </h3>
                <span className="title">
                  {r.title} · {r.place}
                </span>
                <p className="sum">{r.summary}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="facts">
          <div className="fact" data-reveal>
            <span className="kicker">Publication</span>
            <h3>
              <a href={publication.href} target="_blank" rel="noreferrer">
                {publication.title}
              </a>
            </h3>
            <p>
              {publication.authors} {publication.venue}
            </p>
            <span className="badge">★ {publication.award}</span>
          </div>
          <div className="fact" data-reveal>
            <span className="kicker">Education</span>
            <h3>{education.school}</h3>
            <p>
              {education.degree} · {education.period}
            </p>
          </div>
        </div>

        <div className="fact" style={{ marginTop: 8 }} data-reveal>
          <span className="kicker">Tools I've used in the work above</span>
          <dl className="toolkit" style={{ marginTop: 12 }}>
            {toolkit.map((t) => (
              <div key={t.area} style={{ display: "contents" }}>
                <dt>{t.area}</dt>
                <dd>{t.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="contact wrap" id="contact" aria-labelledby="contact-title">
        <span className="kicker">Contact</span>
        <h2 id="contact-title" style={{ marginTop: 14 }}>
          Hiring for ML, deep learning or ML systems? Let's talk.
        </h2>
        <p className="lede">I'm looking for Senior / ML Engineer II–III roles. The fastest way to reach me is email.</p>
        <div className="email-row">
          <a className="email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <CopyEmail email={site.email} />
          <a className="btn btn-sm" href={RESUME_HREF} target="_blank" rel="noreferrer">
            Resume (PDF)
          </a>
        </div>
        <div className="link-row">
          {site.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
