const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = process.argv[2];
if (!root) throw new Error('usage: node split_blog_posts.cjs <repo-root>');

const srcPath = path.join(root, 'src/data/blogPosts.ts');
const outDir = path.join(root, 'src/data/blog-posts');
fs.mkdirSync(outDir, { recursive: true });

const sourceText = fs.readFileSync(srcPath, 'utf8');
const sf = ts.createSourceFile(srcPath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const constMap = new Map();
for (const stmt of sf.statements) {
  if (stmt.kind === ts.SyntaxKind.VariableStatement) {
    const vs = stmt;
    if (vs.declarationList.flags !== ts.NodeFlags.Const) continue;
    for (const decl of vs.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
      const init = decl.initializer;
      if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
        constMap.set(decl.name.text, init.getText(sf));
      }
    }
  }
}

let blogArray = null;
for (const stmt of sf.statements) {
  if (ts.isVariableStatement(stmt)) {
    for (const decl of stmt.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === 'blogPosts' && decl.initializer && ts.isArrayLiteralExpression(decl.initializer)) {
        blogArray = decl.initializer;
      }
    }
  }
}
if (!blogArray) throw new Error('Could not find blogPosts array');

function getSlug(obj) {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === 'slug') {
      const init = prop.initializer;
      if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) return init.text;
    }
  }
  throw new Error('Slug not found');
}

function replaceConstants(text) {
  const entries = [...constMap.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [name, value] of entries) {
    text = text.replace(new RegExp('\\b' + name + '\\b', 'g'), value);
  }
  return text;
}

const slugs = [];
for (const element of blogArray.elements) {
  if (!ts.isObjectLiteralExpression(element)) continue;
  const slug = getSlug(element);
  slugs.push(slug);
  let objText = sourceText.slice(element.getStart(sf), element.end);
  objText = replaceConstants(objText);
  const fileContent = `import { BlogPostTemplate } from "@/pages/BlogPost";\n\nconst post = ${objText} as const;\n\nexport default function BlogPostPage() {\n  return <BlogPostTemplate post={post as any} />;\n}\n`;
  fs.writeFileSync(path.join(outDir, `${slug}.tsx`), fileContent);
}

console.log(JSON.stringify({ generated: slugs.length, sample: slugs.slice(0, 5) }, null, 2));
