/**
 * Frame-safe checkout navigation
 * Handles navigation when the app is embedded in an iframe (preview/sandbox)
 */
export function gotoCheckout(url: string) {
  if (!url) return;

  // Prefer top-level nav (works when page is framed)
  const openTop = () => {
    try {
      window.top!.location.assign(url);
    } catch {
      window.location.assign(url);
    }
  };

  // If we're running inside a sandboxed frame, fall back to new tab
  if (window !== window.top) {
    // Try top first (allowed on most previews by user click), else new tab
    try {
      openTop();
    } catch {
      window.open(url, "_blank", "noopener");
    }
  } else {
    openTop();
  }
}
