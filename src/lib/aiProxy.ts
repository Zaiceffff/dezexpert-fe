// src/lib/aiProxy.ts — прокси к OpenAI и валидация ответа
import { AiReplySchema, type AiReply } from '@/entities/schemas';

export async function callAiProxyAndValidate(body: unknown): Promise<
  | { ok: true; data: AiReply }
  | { ok: false; error: string }
> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // мок: возвращаем пустой ответ
    const mock: AiReply = { textMessage: 'AI отключен', order: {}, isReady: false } as AiReply;
    return { ok: true, data: mock };
  }

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: JSON.stringify(body) }],
      temperature: 0.2
    })
  });

  if (!r.ok) return { ok: false, error: `OpenAI status ${r.status}` };
  const raw = await r.json();

  const content = raw?.choices?.[0]?.message?.content ?? '{}';
  let parsed: unknown = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    return { ok: false, error: 'AI response is not JSON' };
  }
  const res = AiReplySchema.safeParse(parsed);
  if (!res.success) return { ok: false, error: 'AI reply validation failed' };
  return { ok: true, data: res.data };
}


