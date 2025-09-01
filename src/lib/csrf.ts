// src/lib/csrf.ts — CSRF double-submit cookie
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import crypto from 'crypto';

const COOKIE_NAME = 'csrf-token';

export function getOrCreateCsrfToken(cookieStore: ReadonlyRequestCookies): string {
  const exists = cookieStore.get(COOKIE_NAME)?.value;
  if (exists) return exists;
  const token = crypto.randomBytes(16).toString('hex');
  // В RSC cookies() read-only: вернём токен клиенту, а установим Set-Cookie в ответе API
  return token;
}

export function verifyCsrf(reqToken: string | null, cookieToken: string | null): boolean {
  return Boolean(reqToken && cookieToken && reqToken === cookieToken);
}


