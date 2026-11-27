// The 26 November 2026 crawl found these three first-party Shopify product
// master images oversized. Keep the original asset and version, but use a
// bounded derivative for SEO image discovery. Visible gallery remains unchanged.
const OVERSIZED_IMAGE_IDS = new Set([
  'D7229097-061F-44DC-B88D-E012559483EB.jpg',
  '8AF44DF6-A833-4960-8B0E-597A4AAA5D75.jpg',
  'C35D48C5-0045-44BB-A832-3D273574ED03.jpg',
]);

export function auditImageUrl(value) {
  if (typeof value !== 'string') return value;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'cdn.shopify.com' ||
        !url.pathname.startsWith('/s/files/1/0691/6079/6341/files/') ||
        !OVERSIZED_IMAGE_IDS.has(url.pathname.split('/').at(-1))) return value;
    const width = Number(url.searchParams.get('width'));
    if (!Number.isFinite(width) || width <= 0 || width > 1200) {
      url.searchParams.set('width', '1200');
    }
    return url.toString();
  } catch {
    return value;
  }
}
