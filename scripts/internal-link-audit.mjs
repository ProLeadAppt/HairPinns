import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const netlifyConfig = resolve(root, "netlify.toml");
const siteOrigin = "https://hairpinns.com";

if (!existsSync(dist)) {
  console.error("[links] dist/ does not exist. Build and prerender before running the audit.");
  process.exit(1);
}

const walk = (directory) => readdirSync(directory).flatMap((entry) => {
  const absolute = join(directory, entry);
  return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
});

const normalisePath = (value) => {
  const parsed = new URL(value, siteOrigin);
  let pathname = decodeURI(parsed.pathname).replace(/\/{2,}/g, "/");
  if (pathname !== "/") pathname = pathname.replace(/\/$/, "");
  return pathname || "/";
};

const files = walk(dist);
const htmlFiles = files.filter((file) => extname(file).toLowerCase() === ".html");
const routes = new Set();
const staticFiles = new Set();

for (const file of files) {
  const relativePath = relative(dist, file).split(sep).join("/");
  staticFiles.add(`/${relativePath}`);
  if (relativePath === "index.html") routes.add("/");
  else if (relativePath.endsWith("/index.html")) routes.add(`/${relativePath.slice(0, -11)}`);
  else if (relativePath.endsWith(".html")) routes.add(`/${relativePath.slice(0, -5)}`);
}

const redirectSources = new Set();
const rewriteSources = new Set();
if (existsSync(netlifyConfig)) {
  const config = readFileSync(netlifyConfig, "utf8");
  for (const block of config.split("[[redirects]]").slice(1)) {
    const fromMatch = block.match(/^\s*from\s*=\s*"([^"]+)"/m);
    const statusMatch = block.match(/^\s*status\s*=\s*(\d+)/m);
    const status = statusMatch ? Number(statusMatch[1]) : 301;
    const isExactSource = fromMatch
      && !fromMatch[1].includes("*")
      && !fromMatch[1].includes(":");

    if (isExactSource && status >= 300 && status < 400) {
      redirectSources.add(normalisePath(fromMatch[1]));
    } else if (isExactSource && status === 200) {
      rewriteSources.add(normalisePath(fromMatch[1]));
    }
  }
}

const references = new Map();
const hrefPattern = /\bhref=["']([^"']+)["']/gi;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(hrefPattern)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith("#") || /^(mailto:|tel:|javascript:|data:)/i.test(raw)) continue;

    let parsed;
    try {
      parsed = new URL(raw, siteOrigin);
    } catch {
      continue;
    }
    if (parsed.origin !== siteOrigin) continue;

    const pathname = normalisePath(parsed.pathname);
    const sources = references.get(pathname) ?? new Set();
    sources.add(relative(dist, file).split(sep).join("/"));
    references.set(pathname, sources);
  }
}

const unresolved = [];
const indirect = [];
for (const [pathname, sources] of references) {
  const hasStaticFile = staticFiles.has(pathname) || staticFiles.has(`${pathname}/index.html`);
  if (redirectSources.has(pathname)) {
    indirect.push({ pathname, sources: [...sources] });
  } else if (!routes.has(pathname) && !hasStaticFile && !rewriteSources.has(pathname)) {
    unresolved.push({ pathname, sources: [...sources] });
  }
}

const printFindings = (label, findings) => {
  if (findings.length === 0) return;
  console.error(`\n[links] ${label}:`);
  for (const finding of findings.sort((a, b) => a.pathname.localeCompare(b.pathname))) {
    console.error(`  ${finding.pathname}`);
    for (const source of finding.sources.slice(0, 5)) console.error(`    <- ${source}`);
    if (finding.sources.length > 5) console.error(`    <- +${finding.sources.length - 5} more`);
  }
};

printFindings("unresolved internal targets", unresolved);
printFindings("internal links pointing through redirects", indirect);

if (unresolved.length || indirect.length) {
  console.error(`\n[links] Failed: ${unresolved.length} unresolved, ${indirect.length} indirect.`);
  process.exit(1);
}

console.log(`[links] Passed: ${htmlFiles.length} HTML files, ${references.size} unique internal targets, 0 unresolved, 0 indirect.`);
