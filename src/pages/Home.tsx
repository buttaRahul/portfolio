import { Link } from "react-router-dom";
import { AttentionField } from "../components/AttentionField";
import { CopyEmail } from "../components/CopyEmail";
import { KVExplorer } from "../components/KVExplorer";
import { RESUME_HREF, education, experience, proof, publication, site } from "../data/site";
import { alsoBuilt, moreWork, work } from "../data/work";
import { useReveal } from "../lib/hooks";

function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <div className="sec-label">
      <span className="sec-n">{n}</span>
      <span className="sec-t">{children}</span>
    </div>
  );
}

export function Home() {
  useReveal("home");

  return (
    <main id="main">
      {/* ---------------- Hero ---------------- */}
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
          <p className="lede">{site.focus}</p>
          <div className="hero-actions">
            <a className="btn btn-solid" href="#work">
              See the work
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
                <span className="value">
                  {p.value}
                  <span className="go" aria-hidden="true">
                    ↗
                  </span>
                </span>
                <span className="label">{p.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 01 Work ---------------- */}
      <section className="band" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <SectionLabel n="01">Selected work</SectionLabel>
          <h2 id="work-title" className="band-title">
            Five projects, each with how it was checked.
          </h2>
          <ul className="cards">
            {work.map((w, i) => (
              <li key={w.slug} className={i === 0 ? "card-wide" : undefined} data-reveal>
                <Link className="card" to={`/work/${w.slug}`}>
                  <span className="card-top">
                    <span className="kicker">{w.org}</span>
                    <span className="tag">{w.area.split(" · ")[0]}</span>
                  </span>
                  <span className="card-title">{w.cardTitle ?? w.title}</span>
                  <span className="card-metric">
                    <span className="value">{w.metric.value}</span>
                    <span className="label">{w.metric.label}</span>
                  </span>
                  {i === 0 && (
                    <span className="card-viz" aria-hidden="true">
                      <span>Supplier ranking · top 5% shown</span>
                      <span className="viz-track">
                        <span className="b2" style={{ width: "60%" }} />
                        <span className="b1" style={{ width: "10.6%" }} />
                      </span>
                      <span className="viz-scale">
                        <span style={{ left: "10.6%" }}>0.53%</span>
                        <span style={{ left: "60%" }}>3%</span>
                        <span style={{ left: "100%" }}>5%</span>
                      </span>
                      <span className="viz-key">
                        <span>
                          <i style={{ background: "var(--s1)" }} />5 / 5 later OIG exclusions
                        </span>
                        <span>
                          <i style={{ background: "repeating-linear-gradient(135deg, var(--s1) 0 2px, transparent 2px 4px)" }} />
                          held-out fraud, median rank 1
                        </span>
                      </span>
                    </span>
                  )}
                  <span className="card-go" aria-hidden="true">
                    {w.kind === "worklog" ? "Read the worklog" : "Read the case study"} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- 02 KV-cache explorer ---------------- */}
      <section className="band band-alt" id="explorer" aria-labelledby="explorer-title">
        <div className="wrap">
          <SectionLabel n="02">KV-cache explorer</SectionLabel>
          <h2 id="explorer-title" className="band-title">
            The memory wall, measured. <span className="soft">Drag the slider.</span>
          </h2>
          <KVExplorer heading />
          <p className="band-foot">
            Every dot is a measurement from my{" "}
            <Link to="/work/attention-sinks">attention-sinks worklog</Link>. Lines between points are straight; anything past the last
            measurement is marked as not measured.
          </p>
        </div>
      </section>

      {/* ---------------- 03 More work ---------------- */}
      <section className="band" id="more" aria-labelledby="more-title">
        <div className="wrap">
          <SectionLabel n="03">More work</SectionLabel>
          <h2 id="more-title" className="sr-only">
            More work
          </h2>
          <ul className="rows">
            {moreWork.map((it) => (
              <li key={it.title} data-reveal>
                <span className="r-title">
                  {it.href ? (
                    <a href={it.href} target="_blank" rel="noreferrer">
                      {it.title} ↗
                    </a>
                  ) : (
                    it.title
                  )}
                </span>
                <span className="r-stat">{it.stat}</span>
                <span className="r-meta mono">
                  {it.org} · {it.year}
                </span>
              </li>
            ))}
          </ul>
          <div className="chips-row">
            <span className="kicker">Also built</span>
            <ul className="chips">
              {alsoBuilt.map((it) => (
                <li key={it.title}>
                  {it.href ? (
                    <a href={it.href} target="_blank" rel="noreferrer" title={it.text}>
                      {it.title}
                    </a>
                  ) : (
                    <span title={it.text}>{it.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- 04 Experience ---------------- */}
      <section className="band band-alt" id="experience" aria-labelledby="exp-title">
        <div className="wrap">
          <SectionLabel n="04">Experience</SectionLabel>
          <h2 id="exp-title" className="sr-only">
            Experience
          </h2>
          <ol className="rows exp">
            {experience.map((r) => (
              <li key={r.org + r.period} data-reveal>
                <span className="r-title">
                  {r.org}
                  {r.orgNote && <span className="org-note"> · {r.orgNote}</span>}
                </span>
                <span className="r-stat">{r.title}</span>
                <span className="r-meta mono">{r.period}</span>
              </li>
            ))}
          </ol>
          <div className="mini-cards">
            <a className="mini-card" href={publication.href} target="_blank" rel="noreferrer" data-reveal>
              <span className="kicker">Publication · {publication.venue.split(",")[0]}</span>
              <span className="mini-title">QueryAssist: verbal specifications to SQL</span>
              <span className="badge">★ {publication.award}</span>
            </a>
            <div className="mini-card" data-reveal>
              <span className="kicker">Education · {education.period}</span>
              <span className="mini-title">IIIT Pune</span>
              <span className="mini-sub">{education.degree}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 05 Contact ---------------- */}
      <section className="band contact" id="contact" aria-labelledby="contact-title">
        <div className="wrap">
          <SectionLabel n="05">Contact</SectionLabel>
          <h2 id="contact-title">Hiring for ML, deep learning or ML systems? Let's talk.</h2>
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
        </div>
      </section>
    </main>
  );
}
