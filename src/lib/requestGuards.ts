// src/lib/requestGuards.ts — origin-check, CSRF, rate-limit, враппер для route handlers
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { rateLimit } from './rateLimit';
import { verifyCsrf } from './csrf';

const postPathsWithCsrf = new Set(['/leads', '/sms/send', '/reminders/schedule', '/ai/proxy']);

export function withGuards(
  handler: (req: NextRequest, ctx?: Record<string, unknown>) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx?: Record<string, unknown>) => {
    // origin check
    const origin = req.headers.get('origin');
    const base = process.env.APP_BASE_URL;
    if (origin && base && !origin.startsWith(base)) {
      return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
    }

    // rate limit on POST
    if (req.method === 'POST') {
      const ip = req.headers.get('x-forwarded-for') ?? 'local';
      if (!rateLimit(ip)) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

      // CSRF double-submit
      const pathname = new URL(req.url).pathname;
      if (postPathsWithCsrf.has(pathname)) {
        const reqToken = req.headers.get('x-csrf-token');
        const cookieToken = req.cookies.get('csrf-token')?.value ?? null;
        // Разрешаем первый запрос при наличии reqToken (cookie может отсутствовать до установки)
        if (!reqToken) {
          return NextResponse.json({ error: 'CSRF' }, { status: 403 });
        }
        if (cookieToken && !verifyCsrf(reqToken, cookieToken)) {
          return NextResponse.json({ error: 'CSRF' }, { status: 403 });
        }
      }
    }

    const res = await handler(req, ctx);

    // propagate csrf cookie if present in header
    const reqToken = req.headers.get('x-csrf-token');
    if (reqToken) {
      res.headers.set('Set-Cookie', `csrf-token=${reqToken}; Path=/; SameSite=Lax; HttpOnly`);
    }
    return res;
  };
}


