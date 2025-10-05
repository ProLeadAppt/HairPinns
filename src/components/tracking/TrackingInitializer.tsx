import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hpCapture } from '@/lib/hpCapture';

/**
 * Component that initializes tracking on mount and tracks page views
 */
const TrackingInitializer = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize session data on first load
    const session = hpCapture.getSession();
    console.log('[Tracking] Session initialized:', session);
  }, []);

  useEffect(() => {
    // Track page views on route change
    hpCapture.trackEvent('page_view', {
      path: location.pathname,
      search: location.search,
    });
  }, [location]);

  return null; // This component doesn't render anything
};

export default TrackingInitializer;
