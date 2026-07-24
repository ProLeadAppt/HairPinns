import { Link } from "react-router-dom";
import jenaHeadshot from "@/assets/images/jena-headshot.webp";

const AuthorBio = () => (
  <aside className="mt-16 border-y border-[hsl(var(--after-hours-plum)/0.26)] py-8" aria-labelledby="author-bio-heading">
    <div className="grid gap-7 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start">
      <Link to="/about" className="group block w-28 sm:w-full" aria-label="About Jena Pinn">
        <img
          src={jenaHeadshot}
          alt="Jena Pinn, owner of Hair Pinns in Bangor, NSW"
          width="240"
          height="300"
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-[filter] duration-500 group-hover:grayscale"
        />
      </Link>
      <div>
        <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.6)]">The person behind the advice</p>
        <h2 id="author-bio-heading" className="mt-3 font-heading text-3xl font-normal leading-tight text-[hsl(var(--after-hours-plum))]">Written by Jena Pinn.</h2>
        <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[hsl(var(--after-hours-copper))]" aria-label="Verified salon owner, behind the chair since 2009">
          Verified salon owner · Behind the chair since 2009
        </p>
        <p className="mt-4 text-sm leading-7 text-[hsl(var(--after-hours-plum)/0.72)]">
          Jena owns and runs Hair Pinns in Bangor, Sutherland Shire. She has worked behind the chair since 2009 and specialises in smoothing, foiling, colour, and practical home hair care. Every product recommended here is one she uses with clients.
        </p>
        <nav aria-label="More from Jena" className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-[0.66rem] font-semibold uppercase tracking-[0.12em]">
          <Link to="/about" className="border-b border-[hsl(var(--after-hours-plum)/0.35)] !text-[hsl(var(--after-hours-plum))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline">Meet Jena</Link>
          <Link to="/booking" className="border-b border-[hsl(var(--after-hours-plum)/0.35)] !text-[hsl(var(--after-hours-plum))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline">Book a visit</Link>
          <a href="https://www.instagram.com/hair.pinns/" target="_blank" rel="noopener noreferrer" className="border-b border-[hsl(var(--after-hours-plum)/0.35)] !text-[hsl(var(--after-hours-plum))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline">Instagram ↗</a>
        </nav>
      </div>
    </div>
  </aside>
);

export default AuthorBio;
