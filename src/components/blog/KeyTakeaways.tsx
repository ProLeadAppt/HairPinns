interface KeyTakeawaysProps {
  items: string[];
  title?: string;
}

const KeyTakeaways = ({ items, title = "What to remember" }: KeyTakeawaysProps) => {
  if (!items?.length) return null;

  return (
    <aside className="my-14 bg-[hsl(var(--after-hours-plum))] px-5 py-8 text-[hsl(var(--after-hours-cream))] sm:px-8 sm:py-10" aria-labelledby="takeaways-title">
      <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">The short version</p>
      <h2 id="takeaways-title" className="mt-4 max-w-[14ch] font-heading text-3xl font-normal leading-tight text-[hsl(var(--after-hours-cream))]">{title}</h2>
      <ol className="mt-8 border-t border-[hsl(var(--after-hours-cream)/0.24)]">
        {items.map((item, index) => (
          <li key={item} className="grid grid-cols-[2.4rem_minmax(0,1fr)] gap-3 border-b border-[hsl(var(--after-hours-cream)/0.18)] py-4">
            <span className="font-mono text-[0.62rem] tracking-[0.14em] text-[hsl(var(--after-hours-copper))]">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.78)]">{item}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
};

export default KeyTakeaways;
