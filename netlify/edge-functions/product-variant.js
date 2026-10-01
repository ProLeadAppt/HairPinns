import manifest from '../../shared/productVariantSnapshots.generated.js';
import { variantSnapshotTarget } from '../../shared/productVariantSnapshots.js';

export default function productVariant(request) {
  const url = new URL(request.url);
  const target = variantSnapshotTarget(url, manifest, request.method);
  if (!target) return;
  url.pathname = target;
  url.search = '';
  // Same-site rewrite retains the visitor's variant and marketing URL.
  return url;
}

// Netlify's manifest validator does not accept HEAD in its method enum.
// The handler gates GET/HEAD itself and leaves every other method untouched.
export const config = { path: '/products/*' };
