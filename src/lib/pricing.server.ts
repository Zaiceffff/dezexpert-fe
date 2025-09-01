import { type CreateLead, type PricingRule } from '@/entities/schemas';
import { repo } from './repo';

const infestationMultiplier: Record<'low' | 'medium' | 'high', number> = {
  low: 1.0,
  medium: 1.15,
  high: 1.3
};

export function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function computeApproxPrice(
  rules: Array<Pick<PricingRule, 'pestType' | 'objectType' | 'variant' | 'basePrice'>>,
  input: Pick<CreateLead, 'pestType' | 'objectType' | 'rooms' | 'infestation'>
): number {
  const variant = input.objectType === 'apartment' ? String(input.rooms ?? 'default') : 'default';

  const candidates = rules.filter(
    (r) => r.pestType === input.pestType && r.objectType === input.objectType
  );

  let base: number | null = null;

  const exact = candidates.find((r) => r.variant === variant);
  if (exact) base = exact.basePrice;

  if (base == null) {
    if (input.objectType === 'apartment') {
      const numericRooms = [1, 2, 3, 4];
      for (const r of numericRooms) {
        const cand = candidates.find((c) => c.variant === String(r));
        if (cand) {
          base = cand.basePrice;
          break;
        }
      }
    }
  }

  if (base == null) {
    const def = candidates.find((r) => r.variant === 'default');
    if (def) base = def.basePrice;
  }

  if (base == null) return 0;

  const multiplier = infestationMultiplier[input.infestation];
  return roundToNearest(base * multiplier, 50);
}

export async function computeApproxPriceServer(input: CreateLead): Promise<number | null> {
  const rules = (await repo.getPricingRules(input.partnerId)) as Array<Pick<PricingRule, 'pestType' | 'objectType' | 'variant' | 'basePrice'>>;
  const approx = computeApproxPrice(rules, input);
  return approx > 0 ? approx : null;
}
