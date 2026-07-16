import { Facebook, Twitter, Linkedin, Mail, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareBarProps {
  url: string;
  title: string;
  variant?: "fixed" | "inline";
}

const SocialShareBar = ({ url, title, variant = "fixed" }: SocialShareBarProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  };

  const shareButtons = [
    { icon: Facebook, href: shareLinks.facebook, label: "Share on Facebook", fixedColor: "hover:text-[#1877f2]" },
    { icon: Twitter, href: shareLinks.twitter, label: "Share on Twitter", fixedColor: "hover:text-[#1da1f2]" },
    { icon: Linkedin, href: shareLinks.linkedin, label: "Share on LinkedIn", fixedColor: "hover:text-[#0077b5]" },
    { icon: Mail, href: shareLinks.email, label: "Share via Email", fixedColor: "hover:text-brand-500" },
  ];

  const wrapperClass = variant === "inline"
    ? "flex flex-wrap gap-2"
    : "fixed bottom-8 right-8 z-40 hidden flex-col gap-3 lg:flex";
  const controlClass = variant === "inline"
    ? "flex h-11 w-11 items-center justify-center border border-[hsl(var(--after-hours-copper)/0.55)] text-[hsl(var(--after-hours-cream))] transition-colors hover:border-[hsl(var(--after-hours-copper))] hover:text-[hsl(var(--after-hours-copper))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))]"
    : "flex h-12 w-12 items-center justify-center rounded-full border border-accent/20 bg-surface text-muted-foreground shadow-card transition-all hover:scale-110 hover:shadow-lg";

  return (
    <div className={wrapperClass} data-share-variant={variant}>
      {shareButtons.map((button) => {
        const Icon = button.icon;
        return (
          <a
            key={button.label}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={button.label}
            className={`${controlClass} ${variant === "fixed" ? button.fixedColor : ""}`}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}

      <button
        onClick={handleCopyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={`${controlClass} ${variant === "fixed" ? "hover:text-brand-500" : ""}`}
      >
        {copied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default SocialShareBar;
