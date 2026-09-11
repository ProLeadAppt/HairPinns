type NewsletterSource = "footer" | "blog";

interface NewsletterSubscriptionInput {
  email: string;
  source: NewsletterSource;
  company?: string;
}

export async function subscribeToNewsletter({
  email,
  source,
  company = "",
}: NewsletterSubscriptionInput): Promise<void> {
  const response = await fetch("/api/newsletter-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contact: { email: email.trim() },
      context: {
        form_name: `newsletter_${source}`,
        event_name: "newsletter_subscription",
        source_page: window.location.href,
        timestamp: new Date().toISOString(),
        website: company,
      },
      consent: {
        marketing: true,
        opt_in_level: "single",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Newsletter subscription failed with HTTP ${response.status}`);
  }
}
