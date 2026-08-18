import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "src/assets/images/hair-pinns-app-icon-master.png");
const outputDirectory = path.join(root, "public/icons");

const pngTargets = [
  ["hair-pinns-16.png", 16],
  ["hair-pinns-32.png", 32],
  ["hair-pinns-180.png", 180],
  ["hair-pinns-192.png", 192],
  ["hair-pinns-512.png", 512],
  ["hair-pinns-maskable-512.png", 512],
];

await mkdir(outputDirectory, { recursive: true });

for (const [filename, size] of pngTargets) {
  await sharp(source)
    .resize(size, size, { fit: "cover", kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: size <= 32 })
    .toFile(path.join(outputDirectory, filename));
}

// Keep /favicon.ico valid for browsers and crawlers that request it without
// consulting the document head. ICO supports PNG payloads, so the crisp 32px
// derivative can be embedded without another encoder dependency.
const faviconPng = await readFile(path.join(outputDirectory, "hair-pinns-32.png"));
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(32, 6);
icoHeader.writeUInt8(32, 7);
icoHeader.writeUInt8(0, 8);
icoHeader.writeUInt8(0, 9);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile(path.join(root, "public/favicon.ico"), Buffer.concat([icoHeader, faviconPng]));

console.log(`Generated ${pngTargets.length} Hair Pinns icon assets and favicon.ico.`);
