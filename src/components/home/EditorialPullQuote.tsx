import PullQuote from "@/components/design-system/PullQuote";
import Section from "@/components/design-system/Section";

/**
 * EditorialPullQuote — the full-width editorial beat that breaks the
 * bestsellers/reviews/blog section into a magazine-style spread.
 *
 * Renders a single Jena quote on a gold-soft background with the editorial
 * 96–128px section rhythm. Use it sparingly — exactly one per page, between
 * two busy blocks.
 */
const EditorialPullQuote = () => {
  return (
    <Section padding="editorial" variant="default" className="!py-0">
      <PullQuote attribution="Jena · owner, Hair Pinns Bangor">
        I only stock products I actually use on my clients. If I haven't put it
        on a real head of hair in the chair, it doesn't make the shelf.
      </PullQuote>
    </Section>
  );
};

export default EditorialPullQuote;
