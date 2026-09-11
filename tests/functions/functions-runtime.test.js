import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const importInNodeRuntime = (fileName, exportName = "handler") => {
  const moduleUrl = new URL(`../../netlify/functions/${fileName}`, import.meta.url).href;
  return execFileSync(
    process.execPath,
    ["--input-type=module", "--eval", `const mod = await import(${JSON.stringify(moduleUrl)}); if (typeof mod[${JSON.stringify(exportName)}] !== "function") process.exit(2);`],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
};

describe("Netlify function runtime contract", () => {
  it("loads checkout in an untransformed Node ES-module runtime", () => {
    expect(() => importInNodeRuntime("checkout.js")).not.toThrow();
  });

  it("loads IndexNow in an untransformed Node ES-module runtime", () => {
    expect(() => importInNodeRuntime("indexnow.js")).not.toThrow();
  });

  it("loads the health check in an untransformed Node ES-module runtime", () => {
    expect(() => importInNodeRuntime("test.js")).not.toThrow();
  });

  it("loads the GHL capture relay in an untransformed Node ES-module runtime", () => {
    expect(() => importInNodeRuntime("ghl-capture.js", "default")).not.toThrow();
  });

  it("loads the Shopify catalogue sync background function in Node", () => {
    expect(() => importInNodeRuntime("shopify-catalog-sync-background.js")).not.toThrow();
  });
});
