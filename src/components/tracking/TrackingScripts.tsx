import { useEffect } from "react";

/**
 * GA4, Meta Pixel and Microsoft Clarity initialization scripts
 * Loaded after idle so they don't compete with first paint.
 *
 * The lightweight GA queue is created in index.html. The provider script is
 * loaded here after idle so analytics cannot compete with first paint.
 */

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "";
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || "wdl274809i";
const GA4_MEASUREMENT_ID = "G-N6Y1TJMWGG";

const GA4_SCRIPT_ID = "hp-ga4-script";
const META_PIXEL_SCRIPT_ID = "hp-meta-pixel-inline";
const CLARITY_SCRIPT_ID = "hp-clarity-inline";

const TrackingScripts = () => {
  useEffect(() => {
    if (!document.getElementById(GA4_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GA4_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    if (META_PIXEL_ID && !document.getElementById(META_PIXEL_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = META_PIXEL_SCRIPT_ID;
      script.type = "text/javascript";
      script.text = `
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
      `;
      document.head.appendChild(script);
    }

    if (CLARITY_PROJECT_ID && !document.getElementById(CLARITY_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = CLARITY_SCRIPT_ID;
      script.type = "text/javascript";
      script.text = `
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
      `;
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default TrackingScripts;
