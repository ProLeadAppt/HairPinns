import { describe, expect, it } from 'vitest';
import { generateProductSchema, generateEnhancedProductSchema } from './schema';

const product = {
  name: 'Repair Shampoo', description: 'Repair shampoo.',
  image: 'https://cdn.shopify.com/product.jpg', price: '34.95', currency: 'AUD',
  url: 'https://hairpinns.com/products/repair-shampoo', availability: 'InStock',
};

describe('product offer accuracy', () => {
  for (const [name, generate] of Object.entries({ basic: generateProductSchema, enhanced: generateEnhancedProductSchema })) {
    it(`${name} retains the offer without inventing expiry or nationwide transit promises`, () => {
      const offer = generate(product).offers;
      expect(offer.price).toBe('34.95');
      expect(offer.priceCurrency).toBe('AUD');
      expect(offer.availability).toBe('https://schema.org/InStock');
      expect(offer).not.toHaveProperty('priceValidUntil');
      expect(offer.shippingDetails).not.toHaveProperty('deliveryTime');
      expect(offer.shippingDetails.shippingRate).toMatchObject({ value: '9.95', currency: 'AUD' });
    });
  }
});
