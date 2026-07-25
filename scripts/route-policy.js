export const RETIRED_BLOG_SLUGS = new Set([
  'christmas-gift-packs-at-hair-pinns',
]);

export const NON_INDEXABLE_ROUTES = new Set([
  '/404',
  '/search',
]);

export const isIndexableRoute = (route) => {
  if (NON_INDEXABLE_ROUTES.has(route)) return false;
  if (route.startsWith('/blog/')) {
    return !RETIRED_BLOG_SLUGS.has(route.slice('/blog/'.length));
  }
  return true;
};
