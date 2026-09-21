import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real entry point while controlling network completion and DOM mounting.
const source = process.env.STARTUP_BASELINE
  ? execFileSync('git', ['show', 'origin/main:src/main.tsx'], { encoding: 'utf8' })
  : readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source
  .replace(/^import .*;\n/gm, '')
  .replaceAll('import.meta.env.DEV', 'false')
  .replace('import.meta.glob("/src/data/blog-posts/*.tsx")', 'postLoaders')
  .replace('import("./pages/BlogPost")', 'routePromise'),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React, jsxFactory: 'renderElement' } }).outputText;
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
function start(pathname = '/blog/example/', prerendered = true) {
  const route = deferred(), post = deferred();
  const result = { mounts: 0, articleLoads: 0, unrelatedLoads: 0 };
  const root = { hasChildNodes: () => prerendered };
  vm.runInNewContext(code, {
    navigator: {}, window: { location: { pathname } },
    document: { getElementById: () => root }, console,
    createRoot: () => { result.mounts++; return { render() {} }; },
    App: {}, renderElement() {}, routePromise: route.promise,
    postLoaders: {
      '/src/data/blog-posts/example.tsx': () => { result.articleLoads++; return post.promise; },
      '/src/data/blog-posts/unrelated.tsx': () => { result.unrelatedLoads++; return Promise.resolve(); },
    },
  });
  return { result, route, post };
}
const flush = () => new Promise(resolve => setImmediate(resolve));
describe('initial blog startup', () => {
  it('preserves prerendered content until both required chunks arrive', async () => {
    const { result, route, post } = start();
    expect(result.mounts).toBe(0);
    route.resolve(); await flush(); expect(result.mounts).toBe(0);
    post.resolve(); await flush(); expect(result.mounts).toBe(1);
    expect(result.articleLoads).toBe(1); expect(result.unrelatedLoads).toBe(0);
  });
  it('hands chunk failures back to the existing route error handling', async () => {
    const { result, route, post } = start();
    expect(result.mounts).toBe(0);
    route.reject(new Error('chunk unavailable')); post.resolve(); await flush();
    expect(result.mounts).toBe(1);
  });
  it.each(['/products/example/', '/blog/', '/blog/missing/'])('mounts other routes immediately: %s', pathname => {
    const { result } = start(pathname); expect(result.mounts).toBe(1); expect(result.articleLoads).toBe(0);
  });
  it('mounts an empty development shell immediately', () => {
    const { result } = start('/blog/example/', false); expect(result.mounts).toBe(1);
  });
});
