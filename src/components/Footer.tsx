import { site } from "../data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Every number on this site comes from the resume or a public README. Charts are drawn from the measured values.</span>
      </div>
    </footer>
  );
}
