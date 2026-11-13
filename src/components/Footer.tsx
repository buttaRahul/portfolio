import { site } from "../data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
      </div>
    </footer>
  );
}
