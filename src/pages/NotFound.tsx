import { useEffect } from "react";
import { Link } from "react-router-dom";

export function NotFound() {
  useEffect(() => {
    document.title = "Not found — Rahul Aditya Butta";
  }, []);
  return (
    <main id="main" className="wrap not-found">
      <span className="kicker">404</span>
      <h1 style={{ marginTop: 12 }}>This token was evicted.</h1>
      <p>The page you followed isn't here. The work is.</p>
      <Link className="btn btn-solid" to="/">
        Back to the work
      </Link>
    </main>
  );
}
