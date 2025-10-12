import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Health Check API Endpoint
 * 
 * Returns Shopify configuration status without exposing sensitive tokens
 * GET /api/health -> { ok: true, shop: "hairpinns.com", hasToken: true }
 */
serve(async (req) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Read environment variables (these would be set in Supabase secrets)
    const shopDomain = Deno.env.get("SHOP_DOMAIN");
    const apiVersion = Deno.env.get("SF_API_VERSION");
    const storefrontToken = Deno.env.get("SF_STOREFRONT_TOKEN");

    // Check if all required variables are present
    const missingVars: string[] = [];
    if (!shopDomain) missingVars.push("SHOP_DOMAIN");
    if (!apiVersion) missingVars.push("SF_API_VERSION");
    if (!storefrontToken) missingVars.push("SF_STOREFRONT_TOKEN");

    if (missingVars.length > 0) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Missing required environment variables",
          missing: missingVars,
          message: `Please configure the following secrets in Lovable Cloud: ${missingVars.join(", ")}`,
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          } 
        }
      );
    }

    // Return health check response (without exposing actual token value)
    return new Response(
      JSON.stringify({
        ok: true,
        shop: shopDomain,
        apiVersion: apiVersion,
        hasToken: !!storefrontToken,
        tokenLength: storefrontToken.length,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        } 
      }
    );
  } catch (error) {
    console.error("Health check error:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        } 
      }
    );
  }
});
