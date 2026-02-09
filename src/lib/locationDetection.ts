/**
 * Location Detection Utility
 * Detects user location via IP for personalized messaging
 */

interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  suburb?: string;
  postcode?: string;
}

let cachedLocation: LocationData | null = null;
let locationPromise: Promise<LocationData> | null = null;

/**
 * Get user location from IP using a free geolocation API
 * Falls back gracefully if unavailable
 */
export async function getUserLocation(): Promise<LocationData | null> {
  // Return cached location if available
  if (cachedLocation) {
    return cachedLocation;
  }

  // Return existing promise if already fetching
  if (locationPromise) {
    try {
      return await locationPromise;
    } catch {
      return null;
    }
  }

  // Create new fetch promise
  locationPromise = fetch('https://ipapi.co/json/')
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Location API failed');
      }
      const data = await response.json();
      
      const location: LocationData = {
        city: data.city,
        region: data.region,
        country: data.country_name || data.country,
        suburb: data.city, // Most APIs return city as suburb
        postcode: data.postal,
      };

      cachedLocation = location;
      return location;
    })
    .catch((error) => {
      console.warn('Location detection failed:', error);
      // Don't cache errors, allow retry
      locationPromise = null;
      return null;
    });

  try {
    return await locationPromise;
  } catch {
    return null;
  }
}

/**
 * Check if user is in Australia
 */
export async function isInAustralia(): Promise<boolean> {
  const location = await getUserLocation();
  return location?.country === 'Australia' || location?.country === 'AU';
}

/**
 * Check if user is in Sutherland Shire area
 */
export async function isInSutherlandShire(): Promise<boolean> {
  const location = await getUserLocation();
  if (!location) return false;

  const sutherlandShireSuburbs = [
    'bangor', 'menai', 'illawong', 'alfords point', 'woronora',
    'sutherland', 'kirrawee', 'kareela', 'como', 'gymea',
    'miranda', 'engadine', 'heathcote', 'caringbah', 'cronulla'
  ];

  const userSuburb = location.suburb?.toLowerCase() || '';
  return sutherlandShireSuburbs.some(suburb => userSuburb.includes(suburb));
}

/**
 * Get personalized shipping message based on location
 */
export async function getShippingMessage(): Promise<string> {
  const location = await getUserLocation();
  
  if (!location) {
    return 'Fast shipping Australia-wide';
  }

  if (await isInSutherlandShire()) {
    return `Fast shipping to ${location.suburb || 'your area'}`;
  }

  if (await isInAustralia()) {
    return `Fast shipping to ${location.city || 'your area'}, ${location.region || 'Australia'}`;
  }

  return 'Fast shipping Australia-wide';
}

/**
 * Get distance estimate (mock implementation)
 * In production, you'd use a mapping API to calculate actual distance
 */
export async function getDistanceEstimate(): Promise<string | null> {
  const location = await getUserLocation();
  
  if (!location || !(await isInSutherlandShire())) {
    return null;
  }

  // Mock distance calculation
  // In production, use Google Maps Distance Matrix API or similar
  const estimatedMinutes = Math.floor(Math.random() * 20) + 5;
  return `${estimatedMinutes} minutes from ${location.suburb || 'your location'}`;
}
