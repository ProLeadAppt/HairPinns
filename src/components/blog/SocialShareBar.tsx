import { Facebook, Twitter, Linkedin, Mail, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareBarProps {
  url: string;
  title: string;
}

const SocialShareBar = ({ url, title }: SocialShareBarProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  };

  const shareButtons = [
    { icon: Facebook, href: shareLinks.facebook, label: "Share on Facebook", color: "hover:text-[#1877f2]" },
    { icon: Twitter, href: shareLinks.twitter, label: "Share on Twitter", color: "hover:text-[#1da1f2]" },
    { icon: Linkedin, href: shareLinks.linkedin, label: "Share on LinkedIn", color: "hover:text-[#0077b5]" },
    { icon: Mail, href: shareLinks.email, label: "Share via Email", color: "hover:text-brand-500" }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40 hidden lg:flex flex-col gap-3">
      {shareButtons.map((button) => {
        const Icon = button.icon;
        return (
          <a
            key={button.label}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={button.label}
            className={`w-12 h-12 rounded-full bg-surface shadow-card border border-accent/20 flex items-center justify-center text-muted-foreground transition-all hover:shadow-lg hover:scale-110 ${button.color}`}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
      
      <button
        onClick={handleCopyLink}
        aria-label="Copy link"
        className="w-12 h-12 rounded-full bg-surface shadow-card border border-accent/20 flex items-center justify-center text-muted-foreground hover:text-brand-500 transition-all hover:shadow-lg hover:scale-110"
      >
        {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default SocialShareBar;
