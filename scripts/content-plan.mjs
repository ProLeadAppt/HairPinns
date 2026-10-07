import ts from 'typescript';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { articleWordCount } from '../src/lib/articleContent.ts';

// Read TSX literals without executing article modules or importing their assets.
function literal(node) {
  if (!node) return undefined;
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return literal(node.expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(p => [p.name.getText().replace(/^['"]|['"]$/g, ''), literal(p.initializer)]));
  return undefined;
}
const directory = resolve('src/data/blog-posts');
const inventory = readdirSync(directory).filter(f => f.endsWith('.tsx')).map(file => {
  const tree = ts.createSourceFile(file, readFileSync(resolve(directory, file), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let post;
  function visit(node) { if (ts.isVariableDeclaration(node) && node.name.getText() === 'post') post = literal(node.initializer); ts.forEachChild(node, visit); }
  visit(tree);
  return { file: `src/data/blog-posts/${file}`, slug: post?.slug, title: post?.title, seoTitle: post?.seoTitle, excerpt: post?.excerpt, bodyWordCount: post?.content ? articleWordCount(post.content) : null, archived: !!post?.archived, category: post?.category, date: post?.date, serviceCTA: post?.cta?.servicePath, productLinks: post?.content?.productModule?.products?.map(p => p.link) || [], unresolvedMetadata: !post?.slug };
});
const out = resolve('docs/content'); mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, 'article-inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
const briefIndex = process.argv.indexOf('--brief');
if (briefIndex >= 0) {
  const brief = readFileSync(process.argv[briefIndex + 1], 'utf8');
  const tokens = text => new Set(text.toLowerCase().replace(/colour/g, 'color').match(/[a-z]{4,}/g)?.filter(w => !['hair','your','with','what','from','that','when','which','does','best','care','pinns','guide','tips'].includes(w)) || []);
  const plan = [...brief.matchAll(/\*\*Week (\d+):\*\* Title: \*([^*]+)\* \| Target Keyword: `([^`]+)` \| CTA: (.+)/g)].map(match => {
    const week = Number(match[1]); const words = tokens(match[2] + ' ' + match[3]);
    const candidates = inventory.filter(p => !p.archived && p.slug).map(p => { const existing = tokens(p.title + ' ' + p.slug); return { slug: p.slug, title: p.title, overlap: [...words].filter(w => existing.has(w)).length }; }).filter(p => p.overlap >= 2).sort((a,b) => b.overlap-a.overlap).slice(0,3);
    const seasonalWindow = [4,44].includes(week) ? 'June–August (Australian winter)' : [42,43].includes(week) ? 'November–February (Australian summer)' : [46,47].includes(week) ? 'November–December (gift/appointment lead time)' : [48,49,50,52].includes(week) ? 'December–January; review current year and evidence' : 'Evergreen; interleave with seasonal slots';
    const gates = ['Check overlap candidates; refresh an existing article if intent is already covered', 'Verify current product variants and actual service/booking routes before drafting'];
    if ([1,2,4,35].includes(week)) gates.push('Medical/scalp and efficacy review; do not promise growth, shedding prevention, diagnosis or treatment');
    if (/consultation|extensions?|keratin|gloss|density|supplement|scrub|tonic|diffuser|silk|sunscreen|VIP/i.test(match[4])) gates.push('Proposed category/service is unverified; never invent a stock item, consultation or treatment route');
    return { week, title: match[2], keyword: match[3], proposedCTA: match[4], seasonalWindow, overlapCandidates: candidates, gates, status: 'draft-plan-only' };
  });
  if (plan.length !== 52 || new Set(plan.map(p=>p.week)).size !== 52) throw Error('Expected all52 distinct owner-supplied weeks');
  writeFileSync(resolve(out, 'editorial-plan.json'), JSON.stringify(plan, null, 2) + '\n');
}
console.log(`Inventoried ${inventory.length} article modules; ${inventory.filter(p=>p.archived).length} archived; ${inventory.filter(p=>p.unresolvedMetadata).length} unresolved. Plan is draft only.`);
