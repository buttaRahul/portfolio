import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Lightsaber } from "./components/Lightsaber";
import { Starfield } from "./components/Starfield";
import { site } from "./data/site";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { WorkPage } from "./pages/WorkPage";

/** Scroll to the hash target after navigation, or to the top for a new page. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (pathname === "/") document.title = `${site.name} — ${site.role}`;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Wait a frame so the target section exists after a route change.
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Starfield />
      <ScrollManager />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<WorkPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Lightsaber />
    </>
  );
}
