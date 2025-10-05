import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

/**
 * SuburbRedirect Component
 * 
 * Handles 301 redirects from old /suburbs/* paths to new /near/* paths
 * Ensures SEO continuity and prevents 404s from old links
 */
const SuburbRedirect = () => {
  const { suburb } = useParams<{ suburb: string }>();

  useEffect(() => {
    // Log redirect for monitoring
    if (suburb) {
      console.info(`[301 Redirect] /suburbs/${suburb} → /near/${suburb}`);
    }
  }, [suburb]);

  if (!suburb) {
    return <Navigate to="/services" replace />;
  }

  // 301 redirect to new path structure
  return <Navigate to={`/near/${suburb}`} replace />;
};

export default SuburbRedirect;
