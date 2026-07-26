import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { validateEntityRegistry } from "./entityRegistry";
import { getPublishableProof, PROOF_REGISTRY, validateProofRegistry } from "./proofRegistry";
import { SERVICE_PRICE_PROOF_ID, serviceDetailData } from "../data/serviceDetails";

const projectRoot = process.cwd();
const sourceRoot = join(projectRoot, "src");

const collectSourceFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) return collectSourceFiles(absolute);
    if (!/\.(ts|tsx)$/.test(entry) || /\.test\.(ts|tsx)$/.test(entry)) return [];
    return [absolute];
  });

const productionFiles = collectSourceFiles(sourceRoot);
const relativePath = (path: string) => relative(projectRoot, path).replaceAll("\\", "/");
const read = (path: string) => readFileSync(path, "utf8");
const productionSources = productionFiles.map((path) => ({
  name: relativePath(path),
  text: read(path),
}));

const findMatches = (
  pattern: RegExp,
  excludedPaths: readonly string[] = [],
): string[] =>
  productionSources.flatMap(({ name, text }) => {
    if (excludedPaths.includes(name)) return [];
    return pattern.test(text) ? [name] : [];
  });

describe("build-time entity and proof parity", () => {
  it("accepts the canonical registries on the current build date", () => {
    expect(validateEntityRegistry()).toEqual([]);
    expect(validateProofRegistry()).toEqual([]);
  });

  it.each([
    ["canonical phone literal outside the entity registry", /(?:0416 037 663|\+61416037663)/],
    ["canonical street literal outside the entity registry", /60 Goorgool (?:Road|Rd)/],
    ["stale g.page short link", /g\.page\/r\//i],
    ["stale latitude", /-34\.(?:0186|0227)/],
    ["stale longitude", /151\.(?:0144|0302|0333|0367)/],
    ["unsupported 762 review aggregate", /\b762\+?\b/],
    ["unsupported Google 4.9 claim", /(?:Google[^\n]{0,50}4\.9|4\.9[^\n]{0,50}Google)/i],
    ["unsupported 53-review aggregate", /53\+?[^\n]{0,20}4\.9/i],
    ["unsupported 20-year claim", /(?:more than |after )?20 years/i],
    ["conflicting 2018 tenure", /(?:since|established|founded|expert care since) 2018/i],
  ])("rejects %s outside the proof registry", (_label, pattern) => {
    expect(
      findMatches(pattern as RegExp, [
        "src/config/entityRegistry.ts",
        "src/config/proofRegistry.ts",
      ]),
    ).toEqual([]);
  });

  it("keeps canonical first-party entity ID literals in one file", () => {
    expect(
      findMatches(/#(?:organization|hairsalon|store|website|jena-pinn|bangor-studio)/, [
        "src/config/entityRegistry.ts",
      ]),
    ).toEqual([]);
  });

  it("keeps HairSalon object construction inside the shared schema module", () => {
    expect(
      findMatches(/["']@type["']\s*:\s*["']HairSalon["']/, [
        "src/lib/schema.ts",
      ]),
    ).toEqual([]);
  });

  it("links every copied service price category to the live Fresha proof", () => {
    const priceProof = PROOF_REGISTRY.find(
      (proof) => proof.id === SERVICE_PRICE_PROOF_ID,
    );

    expect(priceProof).toBeDefined();
    expect(priceProof?.sourceType).toBe("fresha");
    expect(getPublishableProof("2026-07-25")).toContain(priceProof);
    expect(
      serviceDetailData.every(
        (category) => category.priceProofId === SERVICE_PRICE_PROOF_ID,
      ),
    ).toBe(true);
  });

  it("does not restore the retired fabricated review dataset", () => {
    expect(productionFiles.map(relativePath)).not.toContain("src/data/reviews.ts");
    expect(findMatches(/@\/data\/reviews/)).toEqual([]);
  });

  it("keeps the supported Fresha aggregate inside the proof boundary", () => {
    expect(
      findMatches(/5\.0[^\n]{0,40}(?:review|Fresha)|(?:review|Fresha)[^\n]{0,40}5\.0/i, [
        "src/config/proofRegistry.ts",
        "src/lib/venueReviewProof.ts",
      ]),
    ).toEqual([]);
  });
});
