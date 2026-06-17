import { cn } from "@/lib/utils";

/**
 * Reveal — wraps the existing `.reveal` scroll-reveal system.
 *
 * The `useScrollReveal` hook in src/hooks/useScrollReveal.ts already adds
 * `visible` to any element with the `.reveal` class inside the <main>
 * container. This component just normalises the API so editors don't have
 * to remember class names.
 *
 *   <Reveal as="div" className="...">…</Reveal>
 *   <Reveal as="section" stagger="slow">…</Reveal>   // cascade children
 */
interface RevealProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** Stagger children that have `.reveal` class. */
  stagger?: "default" | "slow" | false;
}

const Reveal = ({
  children,
  as: Tag = "div",
  className,
  stagger = false,
}: RevealProps) => {
  const staggerClass =
    stagger === "slow"
      ? "reveal-stagger-slow"
      : stagger === "default"
      ? "reveal-stagger"
      : "";
  return (
    <Tag className={cn("reveal", staggerClass, className)}>
      {children}
    </Tag>
  );
};

export default Reveal;
