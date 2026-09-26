/** Record an accepted enquiry without coupling the form outcome to optional pixels. */
export function trackContactLead(): void {
  if (typeof window === 'undefined' || !['hairpinns.com', 'www.hairpinns.com'].includes(window.location.hostname)) return;

  try {
    if (typeof window.gtag !== 'function') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer?.push(arguments); };
    }
    window.gtag('event', 'generate_lead', { method: 'contact_form' });
  } catch {
    // An unavailable analytics integration must not prompt a duplicate enquiry.
  }

  try {
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
  } catch {
    // Keep Meta independent of GA and of the accepted submission.
  }
}
