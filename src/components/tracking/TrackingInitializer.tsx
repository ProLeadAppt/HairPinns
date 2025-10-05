import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hpCapture } from '@/lib/hpCapture';

/**
 * Component that initializes tracking on mount and tracks page views
 */
const TrackingInitializer = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize tracking on first load
    const session = hpCapture.getSession();
    const firstTouch = hpCapture.getFirstTouch();
    const pageTracking = hpCapture.getPageTracking();
    
    console.log('[Tracking] Session initialized:', session);
    console.log('[Tracking] First-touch data:', firstTouch);
    console.log('[Tracking] Page tracking:', pageTracking);
  }, []);

  useEffect(() => {
    // Update page tracking on route change
    const pageTracking = hpCapture.getPageTracking();
    
    // Track page views on route change
    hpCapture.trackEvent('page_view', {
      path: location.pathname,
      search: location.search,
      seconds_on_previous_page: pageTracking.seconds_on_page,
    });
  }, [location]);

  return null; // This component doesn't render anything
};

export default TrackingInitializer;
