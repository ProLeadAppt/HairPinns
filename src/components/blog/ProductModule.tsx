import { Link } from "react-router-dom";

interface Product {
  name: string;
  link: string;
  description: string;
}

interface ProductModuleProps {
  title: string;
  products: Product[];
}

const ProductModule = ({ title, products }: ProductModuleProps) => (
  <aside className="my-14 border-y border-[hsl(var(--after-hours-plum)/0.28)] py-8" aria-labelledby="product-note-title">
    <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.6)]">From Jena’s shelf</p>
    <h2 id="product-note-title" className="mt-4 max-w-[16ch] font-heading text-3xl font-normal leading-tight text-[hsl(var(--after-hours-plum))]">{title}</h2>
    <div className="mt-7 border-t border-[hsl(var(--after-hours-plum)/0.22)]">
      {products.map((product, index) => (
        <Link
          key={`${product.link}-${index}`}
          to={product.link}
          className="group grid min-h-20 grid-cols-[2.4rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-[hsl(var(--after-hours-plum)/0.18)] py-4 !text-[hsl(var(--after-hours-plum))] hover:no-underline"
        >
          <span className="font-mono text-[0.61rem] tracking-[0.14em] text-[hsl(var(--after-hours-plum)/0.5)]">{String(index + 1).padStart(2, "0")}</span>
          <span>
            <strong className="block font-heading text-lg font-normal transition-colors group-hover:text-[hsl(var(--after-hours-copper))]">{product.name}</strong>
            <span className="mt-1 block text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.66)]">{product.description}</span>
          </span>
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  </aside>
);

export default ProductModule;
