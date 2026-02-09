import { Helmet } from "react-helmet";

/**
 * GA4 and Meta Pixel initialization scripts
 * Place in <head> via Helmet for proper loading
 * IDs loaded from environment variables for production
 */

// Load from environment variables - set in Netlify or .env file
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || "";
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "";

const TrackingScripts = () => {
  // Only render scripts if IDs are configured
  if (!GA4_MEASUREMENT_ID && !META_PIXEL_ID) {
    return null;
  }

  return (
    <Helmet>
      {/* Google Analytics 4 */}
      {GA4_MEASUREMENT_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_MEASUREMENT_ID}', {
                send_page_view: false, // Manual page view tracking
                cookie_flags: 'SameSite=None;Secure',
              });
            `}
          </script>
        </>
      )}

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
    </Helmet>
  );
};

export default TrackingScripts;
