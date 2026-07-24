interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  caption?: string;
}

const BeforeAfter = ({ beforeImage, afterImage, beforeAlt, afterAlt, caption }: BeforeAfterProps) => (
  <figure className="my-14">
    <div className="grid gap-px bg-[hsl(var(--after-hours-plum)/0.24)] md:grid-cols-2">
      {[
        { src: beforeImage, alt: beforeAlt, label: "Before / 01" },
        { src: afterImage, alt: afterAlt, label: "After / 02" },
      ].map((image) => (
        <div key={image.label} className="bg-[hsl(var(--after-hours-paper))]">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={image.src} alt={image.alt} className="h-full w-full object-cover" loading="lazy" decoding="async" width="800" height="600" />
          </div>
          <p className="border-t border-[hsl(var(--after-hours-plum)/0.2)] px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--after-hours-plum)/0.66)]">{image.label}</p>
        </div>
      ))}
    </div>
    {caption ? <figcaption className="mt-4 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.62)]">{caption}</figcaption> : null}
  </figure>
);

export default BeforeAfter;
