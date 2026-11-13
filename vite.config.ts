import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Canonical and og:url must name the origin the page is actually served from.
 * Hard-coding a domain that is not live yet tells crawlers the real content
 * lives somewhere else. Resolution order:
 *
 *   VITE_SITE_ORIGIN            explicit — set this once the domain is live
 *   VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL   Vercel build
 *   URL / DEPLOY_PRIME_URL      Netlify build
 *   http://localhost:5173       local
 */
function resolveSiteOrigin(): string {
  const env = process.env;
  const withProtocol = (value?: string) =>
    value ? (value.startsWith("http") ? value : `https://${value}`) : undefined;

  return (
    withProtocol(env.VITE_SITE_ORIGIN) ??
    withProtocol(env.VERCEL_PROJECT_PRODUCTION_URL) ??
    withProtocol(env.VERCEL_URL) ??
    withProtocol(env.URL) ??
    withProtocol(env.DEPLOY_PRIME_URL) ??
    "http://localhost:5173"
  ).replace(/\/$/, "");
}

function siteOrigin(): Plugin {
  const origin = resolveSiteOrigin();
  return {
    name: "site-origin",
    transformIndexHtml: (html) => html.replaceAll("%SITE_ORIGIN%", origin),
  };
}

export default defineConfig({
  plugins: [react(), siteOrigin()],
  // Same origin the HTML is stamped with, so runtime metadata cannot drift
  // away from <link rel="canonical">.
  define: { __SITE_ORIGIN__: JSON.stringify(resolveSiteOrigin()) },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  // The preview server has its own host allowlist. Without this, a tunnelled
  // host (ngrok / cloudflared) is rejected with "Blocked request".
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
});
