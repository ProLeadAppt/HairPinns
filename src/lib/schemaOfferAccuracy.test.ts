import { describe, expect, it } from 'vitest';
import { generateProductSchema, generateEnhancedProductSchema } from './schema';
import { shippingStates } from '@/data/shippingStates';

const product = {
  name: 'Repair Shampoo', description: 'Repair shampoo.',
  image: 'https://cdn.shopify.com/product.jpg', price: '34.95', currency: 'AUD',
  url: 'https://hairpinns.com/products/repair-shampoo', availability: 'InStock',
};
// Independently checked against the current visible shipping policy, not the
// helper's configuration: transit is after dispatch, not total order time.
const regionalTransit = [
  ['NSW', 1, 3], ['VIC', 3, 5], ['QLD', 3, 5], ['WA', 5, 8],
  ['SA', 4, 6], ['TAS', 5, 8], ['ACT', 2, 4], ['NT', 6, 10],
] as const;

describe('product offer accuracy', () => {
  for (const [name, generate] of Object.entries({ basic: generateProductSchema, enhanced: generateEnhancedProductSchema })) {
    it.each([['149.99', '9.95'], ['150.00', '0'], ['175.00', '0']])(
      `${name} declares the existing standard shipping threshold for price %s`,
      (price, expectedShipping) => {
        const offer = generate({ ...product, price }).offers;
        expect(offer.price).toBe(price);
        expect(offer.shippingDetails).toHaveLength(8);
        for (const details of offer.shippingDetails) {
          expect(details.shippingRate).toMatchObject({ value: expectedShipping, currency: 'AUD' });
        }
      },
    );
    it(`${name} retains the offer and return policy without expiry or nationwide transit promises`, () => {
      const offer = generate(product).offers;
      expect(offer.price).toBe('34.95');
      expect(offer.priceCurrency).toBe('AUD');
      expect(offer.availability).toBe('https://schema.org/InStock');
      expect(offer).not.toHaveProperty('priceValidUntil');
      expect(offer.hasMerchantReturnPolicy).toMatchObject({ applicableCountry: 'AU', merchantReturnDays: 14, returnMethod: 'https://schema.org/ReturnByMail' });
      expect(offer.shippingDetails.map(details => details.shippingDestination.addressRegion).sort()).toEqual(regionalTransit.map(([region]) => region).sort());
    });
    it.each(['BackOrder', 'PreOrder', 'OutOfStock'])(`${name} does not promise dispatch timing for %s`, availability => {
      const details = generate({ ...product, availability }).offers.shippingDetails;
      expect(details).toHaveLength(8);
      for (const region of details) {
        expect(region.shippingRate.value).toBe('9.95');
        expect(region).not.toHaveProperty('deliveryTime');
      }
    });
    it.each(regionalTransit)(`${name} separates handling from the %s post-dispatch estimate`, (region, minValue, maxValue) => {
      const details = generate(product).offers.shippingDetails.find(details => details.shippingDestination.addressRegion === region);
      expect(details).toMatchObject({
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'AU', addressRegion: region },
        shippingRate: { value: '9.95', currency: 'AUD' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue, maxValue, unitCode: 'DAY' },
        },
      });
      expect(details.deliveryTime).not.toHaveProperty('cutoffTime');
      expect(details.deliveryTime).not.toHaveProperty('businessDays');
    });
  }
  it('keeps policy-visible regional estimates aligned with product schema', () => {
    for (const [region, minValue, maxValue] of regionalTransit) {
      const state = Object.values(shippingStates).find(state => state.abbreviation === region);
      expect(state?.standardDeliveryDays).toBe(`${minValue}–${maxValue}`);
    }
  });
});
