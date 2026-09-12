import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import process from "node:process";

const root = process.cwd();
const contentRoots = [
  "src/components",
  "src/config",
  "src/data",
  "src/hooks",
  "src/lib",
  "src/pages",
];
const checkedExtensions = new Set([".html", ".md", ".mdx", ".ts", ".tsx"]);
const forbidden = [
  { label: "em dash", pattern: /\u2014/g },
  { label: "HTML em dash", pattern: /&mdash;|&#8212;/gi },
];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else if (checkedExtensions.has(extname(entry.name))) files.push(path);
  }

  return files;
}

const violations = [];

for (const contentRoot of contentRoots) {
  for (const file of await listFiles(join(root, contentRoot))) {
    const source = await readFile(file, "utf8");
    const lines = source.split("\n");

    for (const { label, pattern } of forbidden) {
      lines.forEach((line, index) => {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          violations.push(`${relative(root, file)}:${index + 1}: ${label}`);
        }
      });
    }
  }
}

if (violations.length) {
  console.error("Hair Pinns copy style audit failed:\n");
  console.error(violations.join("\n"));
  console.error("\nUse Jena's natural sentence structure instead. See docs/jena-voice-guide.md.");
  process.exit(1);
}

console.log("Hair Pinns copy style audit passed.");

