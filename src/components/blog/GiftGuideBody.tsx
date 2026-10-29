import { Link } from 'react-router-dom';
import { renderInlineLinks } from '@/lib/renderInlineLinks';
import { BOOK_URL, trackBookingClick } from '@/config/bookingConfig';

type Choice = { heading: string; content: string; label: string; href: string };
export type GiftGuideContent = {
  introduction: string;
  choices: readonly Choice[];
  sections: readonly { heading: string; content: string; booking?: boolean }[];
  closing: string;
};
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4';
export function ArticleParagraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
    <p key={index} className="max-w-[65ch] text-base leading-8 text-[hsl(var(--hp-ink))]">{renderInlineLinks(paragraph)}</p>
  ))}</>;
}
export default function GiftGuideBody({ content, destination }: { content: GiftGuideContent; destination: string }) {
  const giftLink = <Link to={destination} className={`inline-flex min-h-12 items-center justify-center rounded-sm bg-[hsl(var(--hp-purple))] px-6 py-3 text-base font-semibold !text-white hover:underline ${focus}`}>Browse gifts<span aria-hidden="true" className="ml-4">→</span></Link>;
  return <div className="gift-guide-body">
    <div className="space-y-5"><ArticleParagraphs text={content.introduction} /></div>
    <div className="mt-6 mb-12">{giftLink}</div>
    <section id="article-products" tabIndex={-1} className="scroll-mt-28" aria-labelledby="gift-starting-point">
      <h2 id="gift-starting-point" className="font-heading text-3xl leading-tight text-[hsl(var(--hp-ink))]">Choose a thoughtful starting point</h2>
      <div className="mt-6 grid gap-4">
        {content.choices.map(choice => <Link key={choice.href} to={choice.href} className={`block rounded-sm border border-[hsl(var(--hp-ink)/0.28)] bg-[hsl(var(--hp-lavender))] p-5 !text-[hsl(var(--hp-ink))] hover:no-underline hover:border-[hsl(var(--hp-purple))] sm:p-6 ${focus}`}>
          <h3 className="font-heading text-2xl leading-tight">{choice.heading}</h3>
          <p className="mt-3 max-w-[60ch] text-base leading-7">{choice.content}</p>
          <span className="mt-4 inline-flex min-h-11 items-center text-base font-semibold underline underline-offset-4">{choice.label}<span aria-hidden="true" className="ml-3">→</span></span>
        </Link>)}
      </div>
    </section>
    {content.sections.map(section => <section key={section.heading} className="mt-12 border-t border-[hsl(var(--hp-ink)/0.2)] pt-8">
      <h2 className="mb-5 font-heading text-3xl leading-tight text-[hsl(var(--hp-ink))]">{section.heading}</h2>
      <div className="space-y-5"><ArticleParagraphs text={section.content} /></div>
      {section.booking && <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick('christmas_guide', window.location.pathname)} className={`mt-4 inline-flex min-h-11 items-center gap-2 text-base font-semibold underline underline-offset-4 ${focus}`}>Check appointments<span className="sr-only"> (opens in a new tab)</span><span aria-hidden="true">↗</span></a>}
    </section>)}
    <div className="mt-12 space-y-5 border-t border-[hsl(var(--hp-ink)/0.2)] pt-8"><ArticleParagraphs text={content.closing} />{giftLink}</div>
  </div>;
}
