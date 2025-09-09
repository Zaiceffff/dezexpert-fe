// /api/ai/proxy — прокси к OpenAI, валидирует ответ по AiReplySchema
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { withGuards } from '@/lib/requestGuards';
import { callAiProxyAndValidate } from '@/lib/aiProxy';

export const dynamic = 'force-dynamic';

export const POST = withGuards(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));
  const result = await callAiProxyAndValidate(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json(result.data);
});

