/**
 * hpCapture Lite - Lightweight JavaScript version
 * Minimal form tracking with GHL inbound webhook integration
 * NOTE: This is a legacy file. Use the full TypeScript version from hpCapture.ts instead.
 */

export const hpCapture = (() => {
  // GHL inbound webhook URL - should be set via environment variable
  // This lite version doesn't support env vars - use the full version instead
  const HOOK = process.env.VITE_GHL_INBOUND_WEBHOOK_URL || "";
  
  const get = (k) => new URLSearchParams(location.search).get(k) || "";
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const read = (k) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
  
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() :
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }));
  
  const sha256 = async (s) => {
    const d = new TextEncoder().encode(s);
    const h = await crypto.subtle.digest("SHA-256", d);
    return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join("");
  };
  
  const getSession = () => {
    let cid = read("hp_client_id");
    if (!cid) {
      cid = uuid();
      store("hp_client_id", cid);
    }
    
    const utms = {
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_content: get("utm_content"),
      utm_term: get("utm_term")
    };
    
    const click_ids = {
      gclid: get("gclid"),
      fbclid: get("fbclid"),
      ttclid: get("ttclid")
    };
    
    return {
      client_id: cid,
      utms,
      click_ids,
      referrer: document.referrer || ""
    };
  };
  
  const postToGHL = async (payload, { event }) => {
    const sess = getSession();
    const emailOrPhone = (payload?.email || payload?.phone || "").toLowerCase().trim();
    const key = `${sess.client_id}|${event}|${emailOrPhone}|${new Date().toISOString().slice(0, 10)}`;
    const dedupe_key = await sha256(key);
    
    const body = {
      ...payload,
      event_name: event,
      source_page: location.href,
      timestamp: new Date().toISOString(),
      client_id: sess.client_id,
      utms: sess.utms,
      click_ids: sess.click_ids,
      referrer: sess.referrer,
      dedupe_key
    };
    
    const tries = [1000, 3000, 10000];
    
    for (let i = 0; i < tries.length; i++) {
      try {
        const res = await fetch(HOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        
        if (res.ok) return true;
        
        window.__hpErrors = window.__hpErrors || [];
        window.__hpErrors.push({
          status: res.status,
          text: await res.text(),
          body
        });
      } catch (e) {
        window.__hpErrors = window.__hpErrors || [];
        window.__hpErrors.push({
          error: e?.message,
          body
        });
      }
      
      if (i < tries.length - 1) {
        await new Promise(r => setTimeout(r, tries[i]));
      }
    }
    
    return false;
  };
  
  // Legacy alias for backward compatibility
  const postToZapier = postToGHL;
  
  return { getSession, postToGHL, postToZapier };
})();
