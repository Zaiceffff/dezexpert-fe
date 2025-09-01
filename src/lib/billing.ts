// src/lib/billing.ts — интерфейс BillingProvider (мок)
export interface BillingProvider {
  getPlans(): Promise<Array<{ id: string; name: string; price: string }>>;
}

class MockBilling implements BillingProvider {
  async getPlans() {
    return [
      { id: 'start', name: 'Старт', price: '0 ₽' },
      { id: 'pro', name: 'Про', price: '990 ₽/мес' },
      { id: 'biz', name: 'Бизнес', price: '1990 ₽/мес' }
    ];
  }
}

export const billingProvider: BillingProvider = new MockBilling();


