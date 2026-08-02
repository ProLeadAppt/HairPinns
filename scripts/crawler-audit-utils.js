import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const resolveScriptRoot = (metaUrl) => resolve(fileURLToPath(new URL('..', metaUrl)));

const decodeEntities = (value) =>
  String(value ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const getAttribute = (tag, name) =>
  tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'))?.[2];

const getMeta = (html, key, value) => {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((candidate) => getAttribute(candidate, key)?.toLowerCase() === value.toLowerCase());
  return decodeEntities(tag ? getAttribute(tag, 'content') : '');
};

const normalisePath = (value) => {
  try {
    const url = new URL(value, 'https://hairpinns.com/');
    if (url.origin !== 'https://hairpinns.com') return null;
    const path = url.pathname || '/';
    return path === '/' || path.endsWith('/') ? path : `${path}/`;
  } catch {
    return null;
  }
};

const flattenSchema = (value, nodes = []) => {
  if (Array.isArray(value)) {
    value.forEach((child) => flattenSchema(child, nodes));
  } else if (value && typeof value === 'object') {
    nodes.push(value);
    Object.values(value).forEach((child) => flattenSchema(child, nodes));
  }
  return nodes;
};

export const extractPageSignals = (html, route) => {
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const description = getMeta(html, 'name', 'description');
  const robots = getMeta(html, 'name', 'robots').toLowerCase();
  const canonicalTag = (html.match(/<link\b[^>]*>/gi) || []).find(
    (tag) => getAttribute(tag, 'rel')?.toLowerCase() === 'canonical',
  );
  const canonical = canonicalTag ? getAttribute(canonicalTag, 'href') ?? '' : '';
  const links = (html.match(/<a\b[^>]*>/gi) || [])
    .map((tag) => getAttribute(tag, 'href'))
    .filter(Boolean);
  const schemas = [];
  const scriptPattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptPattern.exec(html)) !== null) {
    try {
      schemas.push(JSON.parse(scriptMatch[1]));
    } catch {
      schemas.push({ __parseError: true });
    }
  }
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const text = decodeEntities(
    body
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  );

  return {
    route: normalisePath(route) ?? route,
    title,
    description,
    canonical,
    links,
    schemas,
    h1Count: (body.match(/<h1\b/gi) || []).length,
    noIndex: robots.includes('noindex'),
    text,
  };
};

const shingles = (value, size = 3) => {
  const words = decodeEntities(value).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (words.length === 0) return new Set();
  if (words.length < size) return new Set([words.join(' ')]);
  return new Set(words.slice(0, words.length - size + 1).map((_, index) => words.slice(index, index + size).join(' ')));
};

const similarityFromSets = (a, b) => {
  if (a.size === 0 && b.size === 0) return 1;
  const intersection = [...a].filter((value) => b.has(value)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
};

export const textSimilarity = (left, right) => similarityFromSets(shingles(left), shingles(right));

const family = (route) => route.split('/').filter(Boolean)[0] ?? 'home';

export const auditDocuments = (documents, { similarityThreshold = 0.98 } = {}) => {
  const errors = [];
  const warnings = [];
  const pages = documents.map(({ route, html }) => extractPageSignals(html, route));
  const canonicalOwners = new Map();
  const routeSet = new Set(pages.map((page) => page.route));
  const incoming = new Map(pages.map((page) => [page.route, 0]));
  const forbiddenTypes = new Set(['QAPage', 'SpeakableSpecification', 'Article']);

  for (const page of pages) {
    if (page.noIndex) continue;
    if (!page.title) errors.push(`${page.route}: missing title`);
    if (page.title.length > 60) errors.push(`${page.route}: title exceeds 60 characters`);
    if (!page.description) errors.push(`${page.route}: missing meta description`);
    if (page.description.length > 160) errors.push(`${page.route}: meta description exceeds 160 characters`);
    if (page.description.length < 90) errors.push(`${page.route}: short meta description (${page.description.length})`);
    if (page.h1Count !== 1) errors.push(`${page.route}: expected one h1, found ${page.h1Count}`);
    if (!page.canonical) {
      errors.push(`${page.route}: missing canonical`);
    } else if (canonicalOwners.has(page.canonical)) {
      errors.push(`${page.route}: duplicate canonical ${page.canonical} also used by ${canonicalOwners.get(page.canonical)}`);
    } else {
      canonicalOwners.set(page.canonical, page.route);
    }

    if (page.schemas.length !== 1) {
      errors.push(`${page.route}: expected one JSON-LD document, found ${page.schemas.length}`);
    } else {
      const schema = page.schemas[0];
      if (schema.__parseError) errors.push(`${page.route}: invalid JSON-LD`);
      if (schema['@context'] !== 'https://schema.org' || !Array.isArray(schema['@graph'])) {
        errors.push(`${page.route}: JSON-LD is not one connected @graph`);
      }
      const nodes = flattenSchema(schema);
      const graphIds = (schema['@graph'] || []).map((node) => node?.['@id']).filter(Boolean);
      const duplicateIds = graphIds.filter((id, index) => graphIds.indexOf(id) !== index);
      if (duplicateIds.length > 0) errors.push(`${page.route}: duplicate schema @id ${duplicateIds[0]}`);
      for (const node of nodes) {
        if (node !== schema && Object.prototype.hasOwnProperty.call(node, '@context')) {
          errors.push(`${page.route}: nested @context inside JSON-LD graph`);
        }
        const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
        for (const type of types.filter(Boolean)) {
          if (forbiddenTypes.has(type)) errors.push(`${page.route}: forbidden schema type ${type}`);
          if (type === 'FAQPage' && (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0)) {
            errors.push(`${page.route}: empty FAQPage mainEntity`);
          }
        }
      }
    }

    for (const href of page.links) {
      const linkedRoute = normalisePath(href);
      if (linkedRoute && routeSet.has(linkedRoute) && linkedRoute !== page.route) {
        incoming.set(linkedRoute, (incoming.get(linkedRoute) ?? 0) + 1);
      }
    }
  }

  for (const page of pages) {
    if (!page.noIndex && page.route !== '/' && (incoming.get(page.route) ?? 0) === 0) {
      errors.push(`orphan route ${page.route}`);
    }
  }

  const pageShingles = pages.map((page) => shingles(page.text));
  for (let left = 0; left < pages.length; left += 1) {
    for (let right = left + 1; right < pages.length; right += 1) {
      const a = pages[left];
      const b = pages[right];
      if (a.noIndex || b.noIndex || family(a.route) !== family(b.route)) continue;
      if (a.text.length < 300 || b.text.length < 300) continue;
      const similarity = similarityFromSets(pageShingles[left], pageShingles[right]);
      if (similarity >= similarityThreshold) {
        warnings.push(`near-duplicate content ${a.route} ↔ ${b.route} (${similarity.toFixed(3)})`);
      }
    }
  }

  return { errors, warnings, pages };
};
