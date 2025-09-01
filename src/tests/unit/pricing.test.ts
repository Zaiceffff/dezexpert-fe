// unit test — проверка алгоритма цены
import { describe, it, expect } from 'vitest';
import { computeApproxPrice } from '@/lib/pricing';
import { type PricingRule } from '@/entities/schemas';

const rules: PricingRule[] = [
  { partnerId: 'p', pestType: 'tarakany', objectType: 'apartment', variant: '1', basePrice: 2000 },
  { partnerId: 'p', pestType: 'tarakany', objectType: 'apartment', variant: '2', basePrice: 2500 },
  { partnerId: 'p', pestType: 'tarakany', objectType: 'house', variant: 'default', basePrice: 4000 }
];

describe('computeApproxPrice', () => {
  it('exact apartment rooms', () => {
    const v = computeApproxPrice(rules, {
      pestType: 'tarakany',
      objectType: 'apartment',
      rooms: 2,
      infestation: 'low'
    } as any);
    expect(v).toBe(2500);
  });

  it('fallback to nearest apartment', () => {
    const v = computeApproxPrice(rules, {
      pestType: 'tarakany',
      objectType: 'apartment',
      rooms: 3,
      infestation: 'medium'
    } as any);
    // base fallback 2500 * 1.15 = 2875 -> round to 2900 (nearest 50)
    expect(v).toBe(2900);
  });

  it('default variant for house', () => {
    const v = computeApproxPrice(rules, {
      pestType: 'tarakany',
      objectType: 'house',
      infestation: 'high'
    } as any);
    // 4000 * 1.3 = 5200
    expect(v).toBe(5200);
  });
});

