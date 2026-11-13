export type FigId =
  | "fraud-rank"
  | "kv-explorer"
  | "kv-sink-count"
  | "kv-precision"
  | "grad-sync"
  | "claims-results"
  | "capacity"
  | "rms-bytes"
  | "rms-step";

/**
 * Inline text supports **bold**, `code` and [label](https://…).
 */
export type Block =
  | { t: "p"; text: string }
  | { t: "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; text: string }
  | { t: "code"; code: string }
  | { t: "fig"; fig: FigId; title: string; caption: string; wide?: boolean }
  | { t: "table"; head: string[]; rows: string[][]; numeric?: number[]; caption?: string };

export type Section = { id: string; title: string; blocks: Block[] };

export type Work = {
  slug: string;
  kind: "case" | "worklog";
  org: string;
  period: string;
  area: string;
  title: string;
  /** Shorter title for the home card, if the full one is long. */
  cardTitle?: string;
  /** One line for the home list. */
  short: string;
  dek: string;
  role: string;
  metric: { value: string; label: string };
  checked: string;
  glance: { value: string; label: string }[];
  stack: string[];
  sections: Section[];
  links: { label: string; href: string }[];
};

export type CompactItem = {
  title: string;
  org: string;
  year: string;
  text: string;
  /** One short number or fact shown on the home list. */
  stat?: string;
  href?: string;
  linkLabel?: string;
};
