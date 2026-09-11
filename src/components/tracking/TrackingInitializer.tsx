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
    if (hasTrackedInitialRoute.current) {
      ga4.pageView(location.pathname + location.search, document.title);
    } else {
      hasTrackedInitialRoute.current = true;
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default TrackingInitializer;
