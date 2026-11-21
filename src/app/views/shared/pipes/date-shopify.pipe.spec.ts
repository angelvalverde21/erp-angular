import { DateShopifyPipe } from './date-shopify.pipe';

describe('DateShopifyPipe formats', () => {
  const pipe = new DateShopifyPipe();
  beforeEach(() => { jasmine.clock().install(); jasmine.clock().mockDate(new Date('2026-11-17T17:00:00Z')); });
  afterEach(() => jasmine.clock().uninstall());

  it('preserves the long format and offers a compact weekday and time', () => {
    expect(pipe.transform('2026-11-14T21:07:00Z')).toBe('Sábado a las 16:07');
    expect(pipe.transform('2026-11-14T21:07:00Z', 'short')).toBe('Sábado 16:07');
    expect(pipe.transform('2026-11-14 16:07:00', 'short')).toBe('Sábado 16:07');
  });
  it('uses today and yesterday but never anteayer', () => {
    expect(pipe.transform('2026-11-17T14:05:00Z', 'short')).toBe('Hoy 09:05');
    expect(pipe.transform('2026-11-16T14:05:00Z', 'short')).toBe('Ayer 09:05');
    expect(pipe.transform('2026-11-15T14:05:00Z', 'short')).toBe('Domingo 09:05');
    expect(pipe.transform('2026-11-15T14:05:00Z')).toBe('Domingo a las 09:05');
  });
  it('keeps older dates compact without changing the default format', () => {
    expect(pipe.transform('2026-11-01T21:07:00Z', 'short')).toMatch(/^1 nov\.? 16:07$/i);
    expect(pipe.transform('2026-11-01T21:07:00Z')).toMatch(/^1 nov\.? a las 16:07$/i);
  });
  it('uses the Lima calendar across UTC midnight and renders midnight as 00:00', () => {
    jasmine.clock().mockDate(new Date('2026-11-18T02:00:00Z'));
    expect(pipe.transform('2026-11-18T01:07:00Z', 'short')).toBe('Hoy 20:07');
    expect(pipe.transform('2026-11-17T05:00:00Z', 'short')).toBe('Hoy 00:00');
    expect(pipe.transform('2026-11-17T02:00:00Z', 'short')).toBe('Ayer 21:00');
  });
  it('does not show invalid or absent dates', () => {
    for (const value of [null, undefined, '', 'invalid', new Date('invalid')]) expect(pipe.transform(value, 'short')).toBe('');
  });
});
