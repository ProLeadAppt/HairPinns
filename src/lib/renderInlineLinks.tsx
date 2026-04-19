import { Link } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * Render prose that may contain simple [text](/path) markdown links as React nodes.
 * Internal paths (starting with /) become React Router Links. External URLs become
 * anchor tags with rel="noopener noreferrer" and target="_blank".
 * Non-link text is returned as plain strings.
 */
export function renderInlineLinks(text: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let keyCounter = 0;

  for (const match of text.matchAll(pattern)) {
    const [full, label, href] = match;
    const matchStart = match.index ?? 0;

    if (matchStart > lastIndex) {
      nodes.push(text.slice(lastIndex, matchStart));
    }

    if (href.startsWith("/")) {
      nodes.push(
        <Link key={keyCounter++} to={href} className="text-brand-600 underline hover:text-brand-700">
          {label}
        </Link>
      );
    } else {
      nodes.push(
        <a
          key={keyCounter++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline hover:text-brand-700"
        >
          {label}
        </a>
      );
    }

    lastIndex = matchStart + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
