/** Arrange already-sanitised Shopify markup without changing its copy or links. */
export function formatPublicArticleHtml(html: string): string {
  if (typeof DOMParser === 'undefined') return html;
  const document = new DOMParser().parseFromString(html, 'text/html');
  const body = document.body;

  // Older editor posts often have flat h2/p markup instead of sections.
  // Give those posts the same rhythm as future semantic Shopify articles.
  if (!body.querySelector(':scope > section') && body.querySelector(':scope > h2')) {
    let section: HTMLElement | null = null;
    for (const node of Array.from(body.childNodes)) {
      if (node instanceof Element && node.tagName === 'H2') {
        section = document.createElement('section');
        body.insertBefore(section, node);
      }
      if (section) section.appendChild(node);
    }
  }

  for (const section of Array.from(body.querySelectorAll(':scope > section'))) {
    section.classList.add('journal-section');
    const figures = Array.from(section.children).filter(child => child.tagName === 'FIGURE');
    if (!figures.length) continue;
    // Keep interleaved image/copy sequences in their authored order.
    const children = Array.from(section.children);
    const firstFigure = children.indexOf(figures[0]);
    if (children.slice(firstFigure).some(child => child.tagName !== 'FIGURE')) continue;
    section.classList.add('journal-section--illustrated');
    const copy = document.createElement('div');
    copy.className = 'journal-section-copy';
    const media = document.createElement('div');
    media.className = 'journal-section-media';
    for (const child of Array.from(section.childNodes)) {
      (figures.includes(child as Element) ? media : copy).appendChild(child);
    }
    section.append(copy, media);
  }
  return body.innerHTML;
}
