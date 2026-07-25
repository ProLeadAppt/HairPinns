export const xmlEscape = (value) => {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const normaliseLastmod = (value) => {
  if (!value || typeof value !== 'string') return undefined;

  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    const candidate = `${year}-${month}-${day}`;
    const parsed = new Date(`${candidate}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? undefined : candidate;
  }

  const humanDate = value.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (humanDate) {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december',
    ];
    const monthIndex = months.indexOf(humanDate[1].toLowerCase());
    if (monthIndex < 0) return undefined;
    const candidate = `${humanDate[3]}-${String(monthIndex + 1).padStart(2, '0')}-${String(humanDate[2]).padStart(2, '0')}`;
    const parsed = new Date(`${candidate}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? undefined : candidate;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
};

export const parseBlogFreshness = (source) => {
  const entries = [];
  const pattern = /\bslug:\s*["']([^"']+)["'][\s\S]*?\bdate:\s*["']([^"']+)["']/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    entries.push({ slug: match[1], lastmod: normaliseLastmod(match[2]) });
  }

  return entries;
};

export const renderSitemapUrl = (entry) => {
  const imageBlock = (entry.images || [])
    .slice(0, 5)
    .map(
      (image) => `    <image:image>\n      <image:loc>${xmlEscape(image.url)}</image:loc>${image.altText ? `\n      <image:title>${xmlEscape(image.altText)}</image:title>` : ''}\n    </image:image>`,
    )
    .join('\n');
  const lastmod = normaliseLastmod(entry.lastmod);

  return `  <url>\n    <loc>${xmlEscape(entry.loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>${imageBlock ? `\n${imageBlock}` : ''}\n  </url>`;
};
