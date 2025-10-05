# Internal Linking Map & Breadcrumb Implementation

## Link Map Checklist

```
[Home] ✓
  ├─ Services#colour/#smoothing/#cuts ✓
  ├─ Collections#featured ✓
  └─ Blog (latest 3) ✓

[Services] ✓
  ├─ Suburb: Menai, Illawong (rotate) ✓
  └─ Consult banner ✓

[Blog Post: Frizz-Free Plan] ✓
  ├─ PDP: Frizz control pack ✓
  └─ Collection: Treatments ✓

[Blog Post: Blonde Care 101] ✓
  ├─ PDP: Blonde Pack ✓
  └─ Collection: Hair Care ✓

[Blog Post: Keratin vs Smoothing] ✓
  ├─ PDP: Smoothing treatment products ✓
  └─ Collection: Treatments ✓

[PDP: Hydrate & Restore] ✓
  └─ Blog: Frizz-Free Plan ✓

[PDP: Blonde Brilliance] ✓
  └─ Blog: Blonde Care 101 ✓

[PDP: Smoothing Products] ✓
  └─ Blog: Keratin vs Smoothing ✓

[Suburb: Menai] ✓
  ├─ Services ✓
  ├─ Suburb: Illawong ✓
  └─ Suburb: Alfords Point ✓

[Suburb: Illawong] ✓
  ├─ Services ✓
  ├─ Suburb: Menai ✓
  └─ Suburb: Bangor ✓

[Collections] ✓
  └─ Breadcrumbs ✓

[All Pages] ✓
  └─ Breadcrumb navigation ✓
```

## Breadcrumb Structure

### Home Page
- No breadcrumbs (root page)

### Services Page
```
Home > Services
```

### Blog Post
```
Home > Blog > [Post Title]
```

### Product Detail Page (PDP)
```
Home > Collections > [Collection Name] > [Product Name]
```

### Collection Detail Page
```
Home > Collections > [Collection Name]
```

### Suburb Page
```
Home > Areas We Serve > [Suburb Name]
```

## Internal Linking Strategy

### From Home Page
1. **Service Anchors**: Links to `/services#colour`, `/services#smoothing`, `/services#cuts`
2. **Featured Collection**: Link to `/collections/christmas-gift-packs`
3. **Latest Blog Posts**: Links to 3 most recent blog posts

### From Services Page
1. **Nearby Suburbs**: Links to 2 nearby suburb pages (Menai, Illawong)
2. **Consult Banner**: CTA to book consultation on Fresha
3. **Service Anchors**: Each service has an ID for deep linking

### From Blog Posts
1. **Primary Product**: Link to most relevant PDP in ProductModule
2. **Secondary Product/Collection**: Link to relevant collection
3. **Related Posts**: Cross-link to related blog content

### From Product Detail Pages (PDP)
1. **How to Use Section**: Link to relevant blog tutorial
2. **Related Products**: Cross-sell to complementary products
3. **Collection Link**: Back to parent collection

### From Suburb Pages
1. **Services Link**: Link to main services page
2. **Nearby Suburbs**: Links to 2-3 nearby suburb pages
3. **Home Link**: Return to homepage

## SEO Benefits

- **Crawlability**: Clear hierarchical structure helps search engines understand site architecture
- **Link Equity Distribution**: Internal links pass authority to important pages
- **User Experience**: Breadcrumbs reduce bounce rate by providing clear navigation
- **Reduced Orphan Pages**: Every page is reachable within 3 clicks from home
- **Contextual Relevance**: Links placed within content (not just navigation) provide topical signals

## Implementation Files

### Components
- `src/components/Breadcrumbs.tsx` - Reusable breadcrumb component
- `src/components/ui/breadcrumb.tsx` - Base shadcn breadcrumb primitives

### Pages with Breadcrumbs
- `src/pages/Services.tsx`
- `src/pages/BlogPost.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/CollectionDetail.tsx`
- `src/pages/SuburbPage.tsx`

### Internal Linking Enhancements
- Home: Links to service anchors and featured collection
- Services: Links to nearby suburbs + consult banner
- Blog posts: Links to related PDPs/collections via ProductModule
- PDPs: Links to blog tutorials in "How to Use" section
- Suburb pages: Links to services + nearby suburbs

## Schema Implementation

All breadcrumb navigation includes structured data via `generateBreadcrumbSchema()` from `src/lib/schema.ts`.

Example:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://hairpinns.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://hairpinns.com/services"
    }
  ]
}
```

## Maintenance

### Adding New Pages
1. Add breadcrumb items to page component
2. Update breadcrumbSchema in Helmet
3. Add relevant internal links from 2-3 related pages
4. Update this checklist

### Monitoring
- Check Google Search Console for crawl depth
- Monitor internal link report for orphaned pages
- Track click-through rates on breadcrumbs (GA4)
- Review user navigation paths in analytics

## Best Practices

✅ **Do:**
- Keep breadcrumbs above the H1
- Use clear, concise labels
- Make breadcrumbs clickable (except current page)
- Match breadcrumb text to page titles
- Include structured data for all breadcrumbs

❌ **Don't:**
- Use breadcrumbs as primary navigation
- Include more than 5 levels
- Use generic labels like "Page" or "Category"
- Make the current page link clickable
- Skip intermediate levels in the hierarchy

## Performance Notes

- Breadcrumb component is lightweight (<2KB)
- No external dependencies beyond React Router
- Structured data adds ~500 bytes per page
- All internal links use React Router Link (no page reload)

---

**Last Updated**: 2025-01-15
**Status**: ✅ Complete
**Next Review**: When adding new page types or restructuring site
