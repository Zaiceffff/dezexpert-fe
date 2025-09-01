// src/lib/pricing.ts — алгоритм расчёта цены и серверная верификация
import { type CreateLead, type PricingRule } from '@/entities/schemas';

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

  // exact match
  const exact = candidates.find((r) => r.variant === variant);
  if (exact) base = exact.basePrice;

  // nearest fallback by absolute room distance (e.g., 3 -> pick 2 if 3 not present)
  if (base == null) {
    if (input.objectType === 'apartment') {
      const targetRooms = typeof input.rooms === 'number' ? input.rooms : null;
      if (targetRooms != null) {
        let best: { dist: number; price: number } | null = null;
        for (const cand of candidates) {
          const candRooms = Number(cand.variant);
          if (Number.isFinite(candRooms)) {
            const dist = Math.abs(candRooms - targetRooms);
            if (best == null || dist < best.dist || (dist === best.dist && candRooms < targetRooms)) {
              best = { dist, price: cand.basePrice };
            }
          }
        }
        if (best) base = best.price;
      }
    }
  }

  // default fallback
  if (base == null) {
    const def = candidates.find((r) => r.variant === 'default');
    if (def) base = def.basePrice;
  }

  if (base == null) return 0;

  const multiplier = infestationMultiplier[input.infestation];
  return roundToNearest(base * multiplier, 50);
}

// Server-only logic moved to `pricing.server.ts` to avoid bundling server deps into client


