// src/lib/auth.ts — простая mock-аутентификация через cookie x-partner-id
import { cookies } from 'next/headers';

export function getCurrentPartnerId(): string | null {
  const c = cookies().get('x-partner-id')?.value ?? null;
  return c;
}


