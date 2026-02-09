// A/B Testing Utility
// Simple variant testing with localStorage persistence

export interface Variant {
  id: string;
  name: string;
  weight?: number; // Weight for weighted distribution (0-100)
}

/**
 * Get or assign a variant for a test
 * @param testName - Unique name for the test
 * @param variants - Array of possible variants
 * @returns The assigned variant for this user
 */
export function getVariant(testName: string, variants: Variant[]): Variant {
  if (typeof window === "undefined") {
    return variants[0]; // Default to first variant on server
  }

  const storageKey = `ab_test_${testName}`;
  
  // Check if user already has an assigned variant
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const variant = JSON.parse(stored);
      // Verify variant still exists
      if (variants.find(v => v.id === variant.id)) {
        return variant;
      }
    } catch (error) {
      console.error(`Failed to parse stored variant for ${testName}:`, error);
    }
  }

  // Assign new variant
  const variant = assignVariant(variants);
  
  // Store assignment
  try {
    localStorage.setItem(storageKey, JSON.stringify(variant));
  } catch (error) {
    console.error(`Failed to store variant for ${testName}:`, error);
  }

  return variant;
}

/**
 * Assign a variant based on weights (or equal distribution)
 */
function assignVariant(variants: Variant[]): Variant {
  // If no weights specified, use equal distribution
  const hasWeights = variants.some(v => v.weight !== undefined);
  
  if (!hasWeights) {
    // Equal distribution
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  }

  // Weighted distribution
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight || 0), 0);
  let random = Math.random() * totalWeight;

  for (const variant of variants) {
    const weight = variant.weight || 0;
    if (random < weight) {
      return variant;
    }
    random -= weight;
  }

  // Fallback to first variant
  return variants[0];
}

/**
 * Track a conversion event for an A/B test
 * @param testName - Name of the test
 * @param variantId - ID of the variant that converted
 * @param eventName - Name of the conversion event
 * @param data - Additional event data
 */
export async function trackConversion(
  testName: string,
  variantId: string,
  eventName: string,
  data: Record<string, any> = {}
): Promise<void> {
  // Send to tracking system (hpCapture)
  const hpCaptureModule = await import("./hpCapture");
  const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
  
  await hpCapture.trackEvent("ab_test_conversion", {
    test_name: testName,
    variant_id: variantId,
    conversion_event: eventName,
    ...data,
  });
}

/**
 * Reset a test assignment (for testing/debugging)
 */
export function resetTest(testName: string): void {
  if (typeof window === "undefined") return;
  
  const storageKey = `ab_test_${testName}`;
  localStorage.removeItem(storageKey);
}

