import { Fragment, type ReactNode } from "react";

// Tiny inline formatter for content strings: **bold**, *italic*, `code`, [label](href).
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g;

export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  const out: ReactNode[] = parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (m) {
        const external = /^https?:/.test(m[2]);
        return (
          <a key={i} href={m[2]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {m[1]}
          </a>
        );
      }
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
  return <>{out}</>;
}
