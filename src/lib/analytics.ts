type AnalyticsEvent =
  | 'hero_cta_click'
  | 'demo_open'
  | 'pricing_select_plan'
  | 'faq_open'
  | 'copy_ref_link'
  | 'dashboard_upgrade_click'
  | 'mini_lead_form_submit';

export function track(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event, ...payload });
    }
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', event, payload || { /* TODO: implement */ });
    }
  } catch { /* TODO: implement */ }
}

export function withUtm(href: string): string {
  if (typeof window === 'undefined') return href;
  try {
    const params = new URLSearchParams(window.location.search);
    const utmParams = new URLSearchParams();
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
      const val = params.get(key);
      if (val) utmParams.set(key, val);
    });
    const qs = utmParams.toString();
    if (!qs) return href;
    const url = new URL(href, window.location.origin);
    url.search = url.search ? `${url.search}&${qs}` : `?${qs}`;
    return url.pathname + url.search + url.hash;
  } catch {
    return href;
  }
}

