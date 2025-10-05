// Hair Pinns Capture - Analytics & Form Submission Utility

const ZAPIER_CATCH_HOOK_URL = "https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/";

interface SessionData {
  client_id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  referrer: string;
}

interface CapturePayload {
  page_url: string;
  form_name?: string;
  event_name?: string;
  timestamp: string;
  [key: string]: any;
}

interface CaptureOptions {
  event?: string;
  retryAttempts?: number;
}

// Error logging array
declare global {
  interface Window {
    __hpErrors?: Array<{
      timestamp: string;
      error: string;
      payload?: any;
    }>;
  }
}

if (typeof window !== 'undefined' && !window.__hpErrors) {
  window.__hpErrors = [];
}

// Generate or retrieve client_id
function getClientId(): string {
  const STORAGE_KEY = 'hp_client_id';
  
  if (typeof window === 'undefined') return '';
  
  let clientId = localStorage.getItem(STORAGE_KEY);
  
  if (!clientId) {
    // Generate UUIDv4
    clientId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    
    localStorage.setItem(STORAGE_KEY, clientId);
  }
  
  return clientId;
}

// Parse URL parameters
function getUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

// Get and persist session data
function getSessionData(): SessionData {
  const STORAGE_KEY = 'hp_session_data';
  
  if (typeof window === 'undefined') {
    return {
      client_id: '',
      referrer: ''
    };
  }
  
  // Check if we already have session data
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored session data:', e);
    }
  }
  
  // Capture new session data
  const params = getUrlParams();
  const sessionData: SessionData = {
    client_id: getClientId(),
    referrer: document.referrer || '(direct)',
  };
  
  // Capture UTM parameters
  if (params.utm_source) sessionData.utm_source = params.utm_source;
  if (params.utm_medium) sessionData.utm_medium = params.utm_medium;
  if (params.utm_campaign) sessionData.utm_campaign = params.utm_campaign;
  if (params.utm_content) sessionData.utm_content = params.utm_content;
  if (params.utm_term) sessionData.utm_term = params.utm_term;
  
  // Capture click IDs
  if (params.gclid) sessionData.gclid = params.gclid;
  if (params.fbclid) sessionData.fbclid = params.fbclid;
  if (params.ttclid) sessionData.ttclid = params.ttclid;
  
  // Store for session
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  
  return sessionData;
}

// SHA-256 hash function
async function sha256(message: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // Fallback for environments without crypto.subtle
    return btoa(message).substring(0, 32);
  }
  
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate dedupe key
async function generateDedupeKey(
  clientId: string,
  formName: string,
  identifier: string
): Promise<string> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const normalizedIdentifier = identifier.toLowerCase().replace(/\s+/g, '');
  const payload = `${clientId}|${formName}|${normalizedIdentifier}|${today}`;
  return await sha256(payload);
}

// Sleep utility for retry backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// POST to Zapier with retry logic
async function postToZapier(
  payload: Partial<CapturePayload>,
  options: CaptureOptions = {}
): Promise<boolean> {
  const { event, retryAttempts = 3 } = options;
  
  // Check honeypot field - if filled, reject silently
  if (payload.company && payload.company !== '') {
    console.warn('[hpCapture] Honeypot triggered - submission rejected');
    
    // Log as potential bot
    if (typeof window !== 'undefined' && window.__hpErrors) {
      window.__hpErrors.push({
        timestamp: new Date().toISOString(),
        error: 'Honeypot field filled - potential bot',
        payload: { ...payload, company: '[REDACTED]' },
      });
    }
    
    // Return success to not alert bots
    return true;
  }
  
  // Remove honeypot field from payload before sending
  const { company, ...cleanPayload } = payload as any;
  
  const sessionData = getSessionData();
  
  // Merge payload with session data and GDPR info
  const fullPayload: CapturePayload = {
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: new Date().toISOString(),
    ...sessionData,
    ...cleanPayload,
    // Add GDPR compliance fields
    gdpr_region_detected: 'AU',
    timestamp_consent: payload.consent_marketing ? new Date().toISOString() : undefined,
  };
  
  // Add event_name or form_name
  if (event) {
    fullPayload.event_name = event;
  }
  
  // Generate dedupe_key if we have identifier info
  const identifier = cleanPayload.email || cleanPayload.phone || '';
  if (identifier && (cleanPayload.form_name || event)) {
    try {
      fullPayload.dedupe_key = await generateDedupeKey(
        sessionData.client_id,
        cleanPayload.form_name || event || 'unknown',
        identifier
      );
    } catch (e) {
      console.error('Failed to generate dedupe_key:', e);
    }
  }
  
  // Retry logic with exponential backoff
  const backoffDelays = [1000, 3000, 10000]; // 1s, 3s, 10s
  
  for (let attempt = 0; attempt < retryAttempts; attempt++) {
    try {
      const response = await fetch(ZAPIER_CATCH_HOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullPayload),
      });
      
      if (response.ok) {
        console.log('[hpCapture] Successfully posted to Zapier:', fullPayload);
        return true;
      }
      
      // Non-2xx response
      console.warn(`[hpCapture] Attempt ${attempt + 1} failed with status ${response.status}`);
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < retryAttempts - 1) {
        await sleep(backoffDelays[attempt]);
      }
    } catch (error) {
      console.error(`[hpCapture] Attempt ${attempt + 1} failed with error:`, error);
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < retryAttempts - 1) {
        await sleep(backoffDelays[attempt]);
      }
    }
  }
  
  // All retries failed
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: 'Failed to submit after all retry attempts',
    payload: fullPayload,
  };
  
  if (typeof window !== 'undefined' && window.__hpErrors) {
    window.__hpErrors.push(errorLog);
  }
  
  console.error('[hpCapture] All retry attempts failed:', errorLog);
  return false;
}

// Exported utility object
export const hpCapture = {
  /**
   * Get current session data including UTMs, click IDs, referrer, and client_id
   */
  getSession: (): SessionData => {
    return getSessionData();
  },
  
  /**
   * Post data to Zapier with automatic session enrichment and retry logic
   * @param payload - Data to send (form fields, custom data)
   * @param options - Configuration options (event name, retry attempts)
   * @returns Promise<boolean> - true if successful, false if all retries failed
   */
  postToZapier: async (
    payload: Partial<CapturePayload>,
    options: CaptureOptions = {}
  ): Promise<boolean> => {
    return postToZapier(payload, options);
  },
  
  /**
   * Track a custom event (e.g., button click, page view)
   * @param eventName - Name of the event
   * @param data - Additional data to include
   */
  trackEvent: async (eventName: string, data: Record<string, any> = {}): Promise<boolean> => {
    return postToZapier(
      { ...data },
      { event: eventName }
    );
  },
};

export default hpCapture;
