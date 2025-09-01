// src/lib/leadSource.ts — интерфейс источников лидов (Avito/мессенджеры), моки
export interface LeadSource {
  pullNew(): Promise<Array<{ name: string; phone: string; payload: unknown }>>;
  ack(ids: string[]): Promise<void>;
}

// Документация: подключить здесь реальный API, а затем преобразовать к CreateLead
class MockLeadSource implements LeadSource {
  async pullNew() {
    return [];
  }
  async ack() {
    return;
  }
}

export const leadSource: LeadSource = new MockLeadSource();


