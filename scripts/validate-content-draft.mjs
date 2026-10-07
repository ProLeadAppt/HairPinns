import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { articleWordCount } from '../src/lib/articleContent.ts';

/** Editorial gate only: does not register routes, publish, send or activate. */
export function validateContentDraft(draft, inventory = []) {
  const errors = [];
  if (draft.status !== 'draft') errors.push('Status must remain draft');
  if (!Number.isInteger(draft.week) || draft.week < 1 || draft.week > 52) errors.push('Select an owner-supplied week1–52');
  if (!draft.title?.trim() || !draft.seoTitle?.trim()) errors.push('Supply H1 and SEO title');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug || '')) errors.push('Use a short lowercase keyword slug');
  if (inventory.some(p => p.slug === draft.slug)) errors.push('Slug already exists: choose an explicit refresh or a distinct reviewed intent');
  const metadataLength = [...(draft.metaDescription || '')].length;
  if (metadataLength < 140 || metadataLength > 155) errors.push('Metadata must be140–155 characters');
  const body = draft.content || { introduction: '', sections: [] };
  const wordCount = articleWordCount(body);
  if (wordCount < 1200 || wordCount > 1500) errors.push('Article body must be1200–1500 words');
  if (!body.sections?.length || body.sections.some(s => !s.heading?.trim())) errors.push('Provide H2 sections');
  if (!body.sections?.some(s => s.subsections?.length)) errors.push('Provide meaningful H3 subsections');
  if (!body.stylistTip?.trim()) errors.push('Provide a verified Pro Stylist Tip');
  if (!body.sections?.some(s => s.bullets?.length) || !body.sections?.some(s => s.steps?.length)) errors.push('Provide a bullet list and a step-by-step guide');
  if (!draft.booking?.url || !draft.booking?.verifiedAt || !draft.booking?.evidence) errors.push('Verify the actual service and current booking destination');
  if (!draft.products?.length || draft.products.some(p => !/^\d+$/.test(p.variantId || '') || !p.handle || !p.verifiedAt || !p.evidence)) errors.push('Verify exact catalogue handles, sellable variants and supporting evidence');
  if (!draft.factReview?.completed || !draft.overlapReview?.completed) errors.push('Complete factual and intent-overlap review');
  if (draft.activateEmail || draft.discountCode) errors.push('This workflow cannot activate email or create discounts');
  return { valid: errors.length === 0, wordCount, metadataLength, errors };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const file = process.argv[2]; if (!file) throw Error('Usage: node scripts/validate-content-draft.mjs draft.json');
  const result = validateContentDraft(JSON.parse(readFileSync(file, 'utf8')), JSON.parse(readFileSync('docs/content/article-inventory.json', 'utf8')));
  console.log(JSON.stringify(result, null, 2)); if (!result.valid) process.exitCode = 1;
}
