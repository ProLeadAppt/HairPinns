import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import EventEditorial from '@/components/blog/EventEditorial';
const post={title:'Planning your hair for Christmas parties and special events',date:'11 November 2026',readTime:'4 min read',author:'Jena Pinn',image:'/blog-images/event-appointment-jena.webp',imageAlt:'Jena at Hair Pinns',content:{introduction:'First paragraph.\n\nSecond paragraph.',sections:Array.from({length:7},(_,i)=>({heading:`Section ${i+1}`,content:'Read [services](/services/).'}))}};
describe('approved event editorial',()=>{
 const html=renderToStaticMarkup(<MemoryRouter><EventEditorial post={post} seo={<meta name="description" content="Test" />} /></MemoryRouter>);
 it('renders approved heading, genuine logo and all seven article anchors',()=>{expect(html.match(/<h1>/g)).toHaveLength(1);expect(html).toContain(post.title);expect(html).toContain('hair-pinns-logo-full');for(let i=0;i<7;i++){expect(html).toContain(`id="event-section-${i}"`);expect(html).toContain(`href="#event-section-${i}"`);}});
 it('preserves paragraph structure and service links without preview labels',()=>{expect(html).toContain('First paragraph.');expect(html).toContain('Second paragraph.');expect(html).toContain('href="/services/"');expect(html).not.toContain('NOT PUBLISHED');});
 it('includes keyboard skip link and native mobile contents disclosure',()=>{expect(html).toContain('href="#main-content"');expect(html).toContain('<details');expect(html).toContain('aria-label="Article contents"');});
});
