import { Link } from "react-router-dom";
import { CheckCircle2, Award, MapPin, Instagram, Facebook } from "lucide-react";
import jenaHeadshot from "@/assets/images/hero-salon-1280w.webp";

/**
 * Author bio block rendered at the end of every blog post.
 *
 * Purpose: maximise E-E-A-T signals (Experience, Expertise, Authoritativeness,
 * Trustworthiness) on every long-form article. Google increasingly weights
 * author credibility for any content category that touches health, beauty,
 * or money topics, and hair care lives adjacent to those YMYL signals.
 *
 * The Person JSON-LD is emitted in BlogPost.tsx via generateAuthorSchema()
 * which lives in src/lib/schema.ts. This component is the visible on-page
 * counterpart, which gives Google a concrete in-DOM anchor for the same
 * entity (matters for SERP author cards and AI Overview attribution).
 */
const AuthorBio = () => {
  return (
    <aside
      className="mt-12 pt-8 border-t border-border"
      aria-labelledby="author-bio-heading"
    >
      <div className="bg-gradient-to-br from-brand-500/5 to-accent/5 border border-brand-500/15 rounded-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Link
            to="/about"
            className="flex-shrink-0 group"
            aria-label="About Jena Pinn"
          >
            <img
              src={jenaHeadshot}
              alt="Jena Pinn, owner of Hair Pinns in Bangor, NSW"
              width="120"
              height="120"
              loading="lazy"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform"
            />
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2
                id="author-bio-heading"
                className="text-xl font-heading font-bold text-heading"
              >
                Written by Jena Pinn
              </h2>
              <CheckCircle2
                className="w-5 h-5 text-brand-500"
                aria-label="Verified salon owner"
              />
            </div>

            <p className="text-sm text-muted-foreground mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                20+ years professional hairdresser
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Bangor, NSW
              </span>
            </p>

            <p className="text-foreground leading-relaxed mb-4">
              Jena owns and runs Hair Pinns in Bangor, Sutherland Shire. She's
              been doing hair professionally since 2009 and specialises in
              QIQI smoothing treatments, foiling, and colour. Every product
              recommended on this site is one she personally uses on clients
              in the salon. Hair Pinns ships Australia-wide.
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                More about Jena
              </Link>
              <span className="text-muted-foreground" aria-hidden="true">
                •
              </span>
              <Link
                to="/booking"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Book an appointment
              </Link>
              <span className="text-muted-foreground" aria-hidden="true">
                •
              </span>
              <a
                href="https://www.instagram.com/hair.pinns/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
                aria-label="Hair Pinns on Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
                Instagram
              </a>
              <span className="text-muted-foreground" aria-hidden="true">
                •
              </span>
              <a
                href="https://www.facebook.com/Hair.Pinns"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
                aria-label="Hair Pinns on Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AuthorBio;
