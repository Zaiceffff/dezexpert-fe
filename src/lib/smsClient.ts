// src/lib/smsClient.ts — интерфейс и мок-реализация SMS
import { logInfo } from './logger';

export interface SmsClient {
  sendSms(to: string, text: string): Promise<{ ok: boolean; id: string }>;
}

class MockSms implements SmsClient {
  async sendSms(to: string, text: string): Promise<{ ok: boolean; id: string }> {
    const id = `sms_${Date.now()}`;
    logInfo('sms.mock', { to, text });
    return { ok: true, id };
  }
}

export const smsClient: SmsClient = new MockSms();


