import { Link, useLocation } from "react-router-dom";
import { RESUME_HREF, site } from "../data/site";
import { useScrolled } from "../lib/hooks";
import { ThemeToggle } from "./ThemeToggle";

export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 22 22" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="4" cy="4" r="1.6" />
        <circle cx="11" cy="4" r="1.6" />
        <circle cx="18" cy="4" r="1.6" />
        <circle cx="4" cy="11" r="1.6" />
        <circle cx="11" cy="11" r="1.6" />
        <circle cx="4" cy="18" r="1.6" />
      </g>
      <path d="M4 4 18 18M11 11 18 18M4 18h14" stroke="var(--accent)" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="2.6" fill="var(--accent)" />
    </svg>
  );
}

export function Header() {
  const scrolled = useScrolled(24);
  const { pathname } = useLocation();
  // On the home page, before scrolling, the header floats over the space hero.
  const overSpace = pathname === "/" && !scrolled;
  return (
    <header className={`site-header${overSpace ? " over-space force-dark" : ""}`} data-scrolled={scrolled}>
      <div className="wrap">
        <Link to="/" className="brand" aria-label={`${site.name}, home`}>
          <BrandMark />
          <span>{site.shortName}</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link className="nav-link" to="/#work">
            Work
          </Link>
          <Link className="nav-link" to="/#explorer">
            KV explorer
          </Link>
          <Link className="nav-link" to="/#experience">
            Experience
          </Link>
          <Link className="nav-link" to="/#contact">
            Contact
          </Link>
          <ThemeToggle />
          <a className="btn btn-sm btn-solid" href={RESUME_HREF} target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
