import { isPublicCollectionHandle } from '../src/config/commerceNavigation.data.js';

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
  if (route === '/collections/' || route === '/collections') return true;
  if (route.startsWith('/collections/')) {
    return isPublicCollectionHandle(route.slice('/collections/'.length).replace(/\/$/, ''));
  }
  return true;
};
