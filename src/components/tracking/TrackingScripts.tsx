import { Helmet } from "react-helmet";

/**
 * Meta Pixel and Microsoft Clarity initialization scripts
 * Place in <head> via Helmet for proper loading
 * IDs loaded from environment variables for production
 *
 * GA4 is intentionally loaded in index.html so Google Tag Assistant and GA
 * Realtime can see the tag immediately on first paint. SPA route-change
 * page_view events are sent by TrackingInitializer.
 */

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "";
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || "wdl274809i";

const TrackingScripts = () => {
  // Only render scripts if IDs are configured
  if (!META_PIXEL_ID && !CLARITY_PROJECT_ID) {
    return null;
  }

  return (
    <Helmet>
      {/* Meta Pixel */}
      {META_PIXEL_ID && (
        <>
          <script>
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </script>
          <noscript>
            {`<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1"
            />`}
          </noscript>
        </>
      )}

      {/* Microsoft Clarity — skips during prerender/headless, and waits for the
          browser to be idle (or 3s, whichever first) so it doesn't compete with
          LCP, hydration, or any user interaction on first paint. */}
      {CLARITY_PROJECT_ID && (
        <script>
          {`
            (function(){
              var ua=navigator.userAgent||"";
              if(ua.indexOf("HeadlessChrome")!==-1||ua.indexOf("HairPinnsPrerender")!==-1)return;
              var load=function(){
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
              };
              if("requestIdleCallback" in window){
                window.requestIdleCallback(load,{timeout:3000});
              } else {
                setTimeout(load,3000);
              }
            })();
          `}
        </script>
      )}
    </Helmet>
  );
};

export default TrackingScripts;
