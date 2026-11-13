import { useEffect, useMemo, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { DataTable } from "../components/charts";
import { Figure, renderFigure } from "../components/Figures";
import { site } from "../data/site";
import type { Block } from "../data/types";
import { findWork, work } from "../data/work";
import { useActiveSection, useReveal } from "../lib/hooks";
import { Inline } from "../lib/inline";
import { NotFound } from "./NotFound";

export function WorkPage() {
  const { slug } = useParams();
  const w = findWork(slug);
  useReveal(slug);
  const ids = useMemo(() => w?.sections.map((s) => s.id) ?? [], [w]);
  const active = useActiveSection(ids);

  useEffect(() => {
    if (w) document.title = `${w.title} — ${site.name}`;
  }, [w]);

  if (!w) return <NotFound />;

  const idx = work.indexOf(w);
  const next = work[(idx + 1) % work.length];
  let fig = 0;

  const renderBlock = (b: Block, key: number): ReactNode => {
    switch (b.t) {
      case "p":
        return (
          <p key={key}>
            <Inline text={b.text} />
          </p>
        );
      case "h3":
        return <h3 key={key}>{b.text}</h3>;
      case "ul":
      case "ol": {
        const Tag = b.t;
        return (
          <Tag key={key}>
            {b.items.map((it, i) => (
              <li key={i}>
                <Inline text={it} />
              </li>
            ))}
          </Tag>
        );
      }
      case "note":
        return (
          <aside className="note" key={key}>
            <span className="note-tag">Note</span>
            <Inline text={b.text} />
          </aside>
        );
      case "code":
        return (
          <pre key={key}>
            <code style={{ all: "unset" }}>{b.code}</code>
          </pre>
        );
      case "table":
        return <DataTable key={key} head={b.head} rows={b.rows} numeric={b.numeric} caption={b.caption} />;
      case "fig":
        fig += 1;
        return (
          <Figure key={key} n={fig} title={b.title} caption={b.caption} wide={b.wide}>
            {renderFigure(b.fig)}
          </Figure>
        );
    }
  };

  return (
    <main id="main">
      <header className="case-head wrap">
        <Link to="/#work" className="crumb">
          ← All work
        </Link>
        <div className="meta">
          <span className="kicker">{w.kind === "worklog" ? "Worklog" : "Case study"}</span>
          <span className="kicker">{w.org}</span>
          <span className="kicker">{w.period}</span>
          <span className="kicker">{w.area}</span>
        </div>
        <h1>{w.title}</h1>
        <p className="dek">{w.dek}</p>
        <div className="case-facts">
          <span>
            <b>Role</b>
            {w.role}
          </span>
          <span>
            <b>Stack</b>
            {w.stack.join(" · ")}
          </span>
        </div>
      </header>

      <div className="wrap">
        <div className="glance">
          {w.glance.map((g) => (
            <div key={g.label}>
              <span className="value">{g.value}</span>
              <span className="label">{g.label}</span>
            </div>
          ))}
        </div>

        <div className="case-body">
          <nav className="toc" aria-label="On this page">
            <span className="kicker">On this page</span>
            <ol>
              {w.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="prose" data-kind={w.kind}>
            {w.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`}>
                <h2 id={`h-${s.id}`}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                {s.blocks.map(renderBlock)}
              </section>
            ))}

            <div className="case-links">
              {w.links.map((l) => (
                <a key={l.href} className="btn btn-solid" href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
              {w.links.length === 0 && (
                <p className="table-caption" style={{ margin: 0 }}>
                  Employer work: code and data are private. Happy to go deeper in conversation.
                </p>
              )}
            </div>
          </article>
        </div>

        <nav className="next-case" aria-label="Next case study">
          <Link to={`/work/${next.slug}`}>
            <span>
              <span className="kicker">Next</span>
              <span className="t">{next.title}</span>
            </span>
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
