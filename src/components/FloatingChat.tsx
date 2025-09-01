'use client';

import { useMemo } from 'react';

export default function FloatingChat() {
  const utm = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const utmParams = new URLSearchParams();
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
      const val = params.get(key);
      if (val) utmParams.set(key, val);
    });
    const qs = utmParams.toString();
    return qs ? `?${qs}` : '';
  }, []);

  const tgLink = `https://t.me/DezExpert_pro${utm}`;
  const waLink = `https://wa.me/79999999999${utm}`;

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2">
      <a
        href={tgLink}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-white shadow-lg border hover:shadow-xl transition-all duration-200 p-3"
        aria-label="Открыть Telegram чат"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-sky-500 fill-current">
          <path d="M12 0a12 12 0 100 24A12 12 0 0012 0zm5.69 7.12c.12-.006.37.027.53.162a.58.58 0 01.195.376c.018.107.04.354.023.545-.206 2.19-1.11 7.5-1.57 9.957-.195 1.04-.576 1.387-.946 1.42-.803.075-1.415-.53-2.197-1.042-1.222-.8-1.913-1.3-3.1-2.08-1.372-.9-.483-1.398.298-2.207.205-.212 3.76-3.436 3.827-3.728.008-.038.016-.173-.065-.244s-.201-.047-.289-.028c-.126.028-2.075 1.315-5.856 3.862-.555.38-1.055.566-1.505.554-.495-.009-1.446-.278-2.154-.508-.867-.283-1.555-.432-1.495-.908.031-.249.374-.503 1.028-.763 4.03-1.757 6.72-2.915 8.064-3.474 3.842-1.597 4.636-1.874 5.154-1.885z"/>
        </svg>
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-white shadow-lg border hover:shadow-xl transition-all duration-200 p-3"
        aria-label="Открыть WhatsApp чат"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500 fill-current">
          <path d="M20.52 3.49A11.82 11.82 0 0012.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 005.69 1.45h.01c6.55 0 11.89-5.33 11.9-11.89a11.83 11.83 0 00-3.44-8.42zM12.06 21.6h-.01a9.86 9.86 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 012.89 6.99c0 5.45-4.43 9.88-9.87 9.88zm5.41-7.22c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
        </svg>
      </a>
    </div>
  );
}


