import {
  getCatalogueSyncStore,
  runPendingCatalogueSync,
} from "./shopify-catalog-sync-background.js";

export const config = { schedule: "*/15 * * * *" };

export const handler = async () => {
  const buildHookUrl = process.env.NETLIFY_CATALOG_BUILD_HOOK_URL;
  if (!buildHookUrl) {
    console.error("[catalogue-sync-reconcile] Missing Netlify build hook URL");
    return;
  }

  const result = await runPendingCatalogueSync({
    store: getCatalogueSyncStore(),
    buildHookUrl,
    waitForDue: false,
  });
  console.info("[catalogue-sync-reconcile] Reconciliation finished", result);
};
