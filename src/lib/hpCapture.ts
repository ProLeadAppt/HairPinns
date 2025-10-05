// Hair Pinns Capture - Analytics & Form Submission Utility

import { projectConfig } from '@/config/projectConfig';

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

interface FirstTouchData {
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_utm_content?: string;
  first_utm_term?: string;
  first_gclid?: string;
  first_fbclid?: string;
  first_ttclid?: string;
  first_referrer: string;
  first_landing_page: string;
  first_seen_timestamp: string;
}

interface PageTrackingData {
  last_seen_page: string;
  page_entry_time: number;
  seconds_on_page?: number;
}

interface CapturePayload {
  page_url: string;
  form_name?: string;
  event_name?: string;
  timestamp: string;
  source_page?: string;
  lead_magnet_title?: string;
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
      status_code?: number;
      response_text?: string;
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

// Get or create first-touch attribution data (persists across sessions)
function getFirstTouchData(): FirstTouchData {
  const STORAGE_KEY = 'hp_first_touch';
  
  if (typeof window === 'undefined') {
    return {
      first_referrer: '',
      first_landing_page: '',
      first_seen_timestamp: new Date().toISOString(),
    };
  }
  
  // Check if we already have first-touch data
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse first-touch data:', e);
    }
  }
  
  // Capture first-touch data
  const params = getUrlParams();
  const firstTouch: FirstTouchData = {
    first_referrer: document.referrer || '(direct)',
    first_landing_page: window.location.href,
    first_seen_timestamp: new Date().toISOString(),
  };
  
  // Capture first UTM parameters
  if (params.utm_source) firstTouch.first_utm_source = params.utm_source;
  if (params.utm_medium) firstTouch.first_utm_medium = params.utm_medium;
  if (params.utm_campaign) firstTouch.first_utm_campaign = params.utm_campaign;
  if (params.utm_content) firstTouch.first_utm_content = params.utm_content;
  if (params.utm_term) firstTouch.first_utm_term = params.utm_term;
  
  // Capture first click IDs
  if (params.gclid) firstTouch.first_gclid = params.gclid;
  if (params.fbclid) firstTouch.first_fbclid = params.fbclid;
  if (params.ttclid) firstTouch.first_ttclid = params.ttclid;
  
  // Store permanently in localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(firstTouch));
  
  console.log('[hpCapture] First-touch data captured:', firstTouch);
  
  return firstTouch;
}

// Get current session data (last-touch attribution)
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
  
  // Capture new session data (last-touch)
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

// Track page entry time and calculate time on page
function getPageTrackingData(): PageTrackingData {
  const STORAGE_KEY = 'hp_page_tracking';
  
  if (typeof window === 'undefined') {
    return {
      last_seen_page: '',
      page_entry_time: Date.now(),
    };
  }
  
  const currentPage = window.location.href;
  const now = Date.now();
  
  // Get previous page data
  const stored = sessionStorage.getItem(STORAGE_KEY);
  let previousData: PageTrackingData | null = null;
  
  if (stored) {
    try {
      previousData = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse page tracking data:', e);
    }
  }
  
  // Calculate seconds on previous page
  let secondsOnPage: number | undefined;
  if (previousData && previousData.page_entry_time) {
    secondsOnPage = Math.round((now - previousData.page_entry_time) / 1000);
  }
  
  // Store current page data
  const currentData: PageTrackingData = {
    last_seen_page: currentPage,
    page_entry_time: now,
    seconds_on_page: secondsOnPage,
  };
  
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  
  return currentData;
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
  const firstTouch = getFirstTouchData();
  const pageTracking = getPageTrackingData();
  
  // Generate dedupe_key first
  const identifier = cleanPayload.email || cleanPayload.phone || '';
  let dedupeKey = '';
  if (identifier && (cleanPayload.form_name || event)) {
    try {
      dedupeKey = await generateDedupeKey(
        sessionData.client_id,
        cleanPayload.form_name || event || 'unknown',
        identifier
      );
    } catch (e) {
      console.error('Failed to generate dedupe_key:', e);
    }
  }

  // Build standardized nested payload structure
  const fullPayload: any = {
    // Contact information
    contact: {
      first_name: cleanPayload.first_name || cleanPayload.name || '',
      last_name: cleanPayload.last_name || '',
      email: cleanPayload.email || '',
      phone: cleanPayload.phone || '',
    },
    
    // Context (tracking metadata)
    context: {
      form_name: cleanPayload.form_name || '',
      event_name: event || cleanPayload.event_name || '',
      source_page: typeof window !== 'undefined' ? window.location.href : '',
      referrer: sessionData.referrer,
      timestamp: new Date().toISOString(),
      client_id: sessionData.client_id,
      dedupe_key: dedupeKey,
      last_seen_page: pageTracking.last_seen_page,
      seconds_on_page: pageTracking.seconds_on_page,
    },
    
    // Consent and GDPR
    consent: {
      marketing: cleanPayload.consent_marketing || false,
      gdpr_region_detected: projectConfig.gdpr_region,
      timestamp_consent: cleanPayload.consent_marketing ? new Date().toISOString() : undefined,
      double_opt_in: projectConfig.double_opt_in,
    },
    
    // Session attribution (last-touch)
    session: {
      utm_source: sessionData.utm_source || '',
      utm_medium: sessionData.utm_medium || '',
      utm_campaign: sessionData.utm_campaign || '',
      utm_content: sessionData.utm_content || '',
      utm_term: sessionData.utm_term || '',
      gclid: sessionData.gclid || '',
      fbclid: sessionData.fbclid || '',
      ttclid: sessionData.ttclid || '',
    },
    
    // First-touch attribution (lifetime)
    first_touch: {
      first_utm_source: firstTouch.first_utm_source || '',
      first_utm_medium: firstTouch.first_utm_medium || '',
      first_utm_campaign: firstTouch.first_utm_campaign || '',
      first_utm_content: firstTouch.first_utm_content || '',
      first_utm_term: firstTouch.first_utm_term || '',
      first_gclid: firstTouch.first_gclid || '',
      first_fbclid: firstTouch.first_fbclid || '',
      first_ttclid: firstTouch.first_ttclid || '',
      first_referrer: firstTouch.first_referrer,
      first_landing_page: firstTouch.first_landing_page,
      first_seen_timestamp: firstTouch.first_seen_timestamp,
    },
  };
  
  // Add optional commerce data if present
  if (cleanPayload.product_id || cleanPayload.product_title || cleanPayload.order_id || cleanPayload.items) {
    fullPayload.commerce = {
      product_id: cleanPayload.product_id || '',
      product_title: cleanPayload.product_title || '',
      product_handle: cleanPayload.product_handle || '',
      price: cleanPayload.price || '',
      currency: cleanPayload.currency || 'AUD',
      variant: cleanPayload.variant || '',
      quantity: cleanPayload.quantity || '',
      cart_total: cleanPayload.cart_total || '',
      order_id: cleanPayload.order_id || '',
      items: cleanPayload.items || [],
    };
  }
  
  // Add optional free-text data if present
  if (cleanPayload.message || cleanPayload.topic) {
    fullPayload.free_text = {
      message: cleanPayload.message || '',
      topic: cleanPayload.topic || '',
      topic_label: cleanPayload.topic_label || '',
      preferred_time: cleanPayload.preferred_time || '',
      preferred_time_label: cleanPayload.preferred_time_label || '',
    };
  }
  
  // Add lead magnet data if present
  if (cleanPayload.lead_magnet_title) {
    fullPayload.lead_magnet = {
      title: cleanPayload.lead_magnet_title,
      slug: cleanPayload.lead_magnet_slug || '',
    };
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
      
      // Non-2xx response - log detailed error
      const responseText = await response.text().catch(() => 'Could not read response text');
      
      console.warn(`[hpCapture] Attempt ${attempt + 1} failed with status ${response.status}`);
      
      // Log to window.__hpErrors for QA
      if (typeof window !== 'undefined' && window.__hpErrors) {
        window.__hpErrors.push({
          timestamp: new Date().toISOString(),
          error: `HTTP ${response.status} on attempt ${attempt + 1}`,
          status_code: response.status,
          response_text: responseText,
          payload: fullPayload,
        });
      }
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < retryAttempts - 1) {
        await sleep(backoffDelays[attempt]);
      }
    } catch (error) {
      console.error(`[hpCapture] Attempt ${attempt + 1} failed with error:`, error);
      
      // Log network/fetch errors
      if (typeof window !== 'undefined' && window.__hpErrors) {
        window.__hpErrors.push({
          timestamp: new Date().toISOString(),
          error: `Network error on attempt ${attempt + 1}: ${error}`,
          payload: fullPayload,
        });
      }
      
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
   * Get current session data including UTMs, click IDs, referrer, and client_id (last-touch)
   */
  getSession: (): SessionData => {
    return getSessionData();
  },
  
  /**
   * Get first-touch attribution data from initial visit
   */
  getFirstTouch: (): FirstTouchData => {
    return getFirstTouchData();
  },
  
  /**
   * Get page tracking data including time on page
   */
  getPageTracking: (): PageTrackingData => {
    return getPageTrackingData();
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

// QA Testing Utility - Accessible in browser console
if (typeof window !== 'undefined') {
  (window as any).__hpTest = async (formName: string = 'test_form') => {
    console.log(`[hpCapture] Testing form submission: ${formName}`);
    
    const testPayload = {
      form_name: formName,
      name: 'Test User',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@hairpinns.com',
      phone: '0412345678',
      message: 'This is a test submission from the console',
      consent_marketing: true,
    };
    
    console.log('[hpCapture] Test payload (before transformation):', testPayload);
    
    try {
      const success = await hpCapture.postToZapier(
        testPayload,
        { event: 'test_submission' }
      );
      
      if (success) {
        console.log('✅ [hpCapture] Test submission successful!');
        console.log('Check Zapier Task History to verify webhook received');
        console.log('Payload should be nested as: contact, context, consent, session, first_touch');
      } else {
        console.error('❌ [hpCapture] Test submission failed');
        console.log('Check window.__hpErrors for details');
      }
    } catch (error) {
      console.error('❌ [hpCapture] Test submission error:', error);
    }
  };
}

export default hpCapture;
