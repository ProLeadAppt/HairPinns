const STYLE_ID = 'hair-pinns-chat-viewport';

/**
 * Compatibility guard for the inspected LeadConnector middle-right layout.
 * Use the inspected open shadow root for the responsive compatibility guard.
 * Scope overrides to verified elements; do not change routing, fields or audio.
 * Keep the vendor-owned launcher position when collapsed.
 */
export function installChatViewportGuard() {
  let host: HTMLElement | null = null;
  let widgetRoot: ShadowRoot | null = null;
  let shadowObserver: MutationObserver | null = null;
  let style: HTMLStyleElement | null = null;

  const publishViewport = () => {
    if (!host) return;
    host.style.setProperty('--hp-chat-viewport-height', `${window.visualViewport?.height ?? window.innerHeight}px`);
    host.style.setProperty('--hp-chat-viewport-top', `${window.visualViewport?.offsetTop ?? 0}px`);
    host.style.setProperty('--hp-chat-viewport-width', `${document.documentElement.clientWidth}px`);
  };

  const mountStyle = () => {
    if (!widgetRoot || widgetRoot.getElementById(STYLE_ID)) return;
    style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* The vendor wrapper includes invisible prompt/launcher padding.
         Only painted interactive surfaces may intercept storefront clicks. */
      #lc_text-widget { pointer-events: none !important; }
      #lc_text-widget--btn,
      #lc_text-widget--box,
      .lc_text-widget--prompt { pointer-events: auto !important; }
      #lc_text-widget--btn {
        background-color: hsl(var(--hp-purple, 280 40.7767% 40.3922%)) !important;
        color: white !important;
      }
      #lc_text-widget--box {
        background-color: white !important;
        color: hsl(var(--hp-ink, 278.4 25.2525% 19.4118%)) !important;
        border-color: hsl(var(--hp-lilac, 279.1304 37.7049% 88.0392%)) !important;
      }
      .lc_text-widget--header-wrapper {
        background: hsl(var(--hp-purple, 280 40.7767% 40.3922%)) !important;
        color: white !important;
      }
      @media (max-width: 1023px) {
        :host([data-active="true"]) #lc_text-widget {
          top: calc(var(--hp-chat-viewport-top, 0px) + 12px + env(safe-area-inset-top)) !important;
          right: calc(12px + env(safe-area-inset-right)) !important;
          bottom: auto !important;
          left: auto !important;
          width: min(340px, calc(var(--hp-chat-viewport-width, 100vw) - 24px - env(safe-area-inset-left) - env(safe-area-inset-right))) !important;
          padding-bottom: 0 !important;
          transform: none !important;
        }
        :host([data-active="true"]) #lc_text-widget--box {
          width: 100% !important;
          height: min(660px, calc(var(--hp-chat-viewport-height, 100dvh) - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom))) !important;
          max-height: calc(var(--hp-chat-viewport-height, 100dvh) - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
          box-sizing: border-box !important;
        }
        :host([data-active="true"]) #lc_text-widget--btn {
          display: none !important;
        }
      }
    `;
    widgetRoot.appendChild(style);
  };

  const findWidget = () => {
    const next = document.querySelector<HTMLElement>('chat-widget#leadconnector-widget, chat-widget#leadconnector-widget-loader');
    if (!next?.shadowRoot) return;
    if (next === host && widgetRoot === next.shadowRoot) { mountStyle(); return; }
    shadowObserver?.disconnect();
    host = next;
    widgetRoot = next.shadowRoot;
    publishViewport();
    mountStyle();
    shadowObserver = new MutationObserver(mountStyle);
    shadowObserver.observe(widgetRoot, { childList: true });
  };

  findWidget();
  const observer = new MutationObserver(findWidget);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', publishViewport);
  window.visualViewport?.addEventListener('resize', publishViewport);
  window.visualViewport?.addEventListener('scroll', publishViewport);

  return () => {
    observer.disconnect();
    shadowObserver?.disconnect();
    style?.remove();
    host?.style.removeProperty('--hp-chat-viewport-height');
    host?.style.removeProperty('--hp-chat-viewport-top');
    host?.style.removeProperty('--hp-chat-viewport-width');
    window.removeEventListener('resize', publishViewport);
    window.visualViewport?.removeEventListener('resize', publishViewport);
    window.visualViewport?.removeEventListener('scroll', publishViewport);
  };
}
