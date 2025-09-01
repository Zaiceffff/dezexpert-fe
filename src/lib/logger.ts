// src/lib/logger.ts — простое структурированное логирование
export function logInfo(event: string, data?: unknown) {
  console.info(JSON.stringify({ level: 'info', event, data, ts: new Date().toISOString() }));
}
export function logWarn(event: string, data?: unknown) {
  console.warn(JSON.stringify({ level: 'warn', event, data, ts: new Date().toISOString() }));
}
export function logError(event: string, data?: unknown) {
  // В продакшене можно отправлять логи в сервис аналитики
  // Пока просто игнорируем
}

