import { describe, expect, it } from 'vitest';
import { productIdentifiers } from './productIdentifiers';

describe('product identifiers', () => {
  it('keeps a real SKU, GTIN and MPN', () => {
    expect(productIdentifiers({
      sku: ' WB-ORIG ',
      barcode: '9312345678901',
      mpn: { value: 'MPN-1' },
    })).toEqual({ sku: 'WB-ORIG', gtin: '9312345678901', mpn: 'MPN-1' });
  });

  it('reads the Google shopping MPN metafield when the custom one is empty', () => {
    expect(productIdentifiers({ googleMpn: { value: 'GOOG-9' } })).toEqual({ mpn: 'GOOG-9' });
  });

  it('omits a variant ID, a blank SKU and a barcode that is not a GTIN', () => {
    expect(productIdentifiers({
      sku: '   ',
      barcode: '12345',
      mpn: { value: ' ' },
    })).toEqual({});
  });
});
