import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ga4 } from '@/lib/pixelTracking';

/**
 * Component that initializes tracking on mount and tracks page views
 */
const TrackingInitializer = () => {
  const location = useLocation();
  const hasTrackedInitialRoute = useRef(false);

  useEffect(() => {
    // Initialize tracking on first load (non-blocking)
    try {
      import('@/lib/hpCapture').then((module) => {
        const hpCapture = module.default || module.hpCapture;
        if (hpCapture) {
          const session = hpCapture.getSession();
          const firstTouch = hpCapture.getFirstTouch();
          const pageTracking = hpCapture.getPageTracking();
          
          console.log('[Tracking] Session initialized:', session);
          console.log('[Tracking] First-touch data:', firstTouch);
          console.log('[Tracking] Page tracking:', pageTracking);
        }
      }).catch((error) => {
        console.warn('[Tracking] Failed to initialize tracking:', error);
      });
    } catch (error) {
      console.warn('[Tracking] Failed to load tracking module:', error);
    }
  }, []);

  useEffect(() => {
    if (hasTrackedInitialRoute.current) {
      ga4.pageView(location.pathname + location.search, document.title);
    } else {
      hasTrackedInitialRoute.current = true;
    }

    // Update page tracking on route change (non-blocking)
    try {
      import('@/lib/hpCapture').then((module) => {
        const hpCapture = module.default || module.hpCapture;
        if (hpCapture) {
          const pageTracking = hpCapture.getPageTracking();
          
          // Track page views on route change
          hpCapture.trackEvent('page_view', {
            path: location.pathname,
            search: location.search,
            seconds_on_previous_page: pageTracking.seconds_on_page,
          }).catch((error) => {
            console.warn('[Tracking] Failed to track page view:', error);
          });
        }
      }).catch((error) => {
        console.warn('[Tracking] Failed to load tracking module:', error);
      });
    } catch (error) {
      console.warn('[Tracking] Failed to load tracking module:', error);
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default TrackingInitializer;
