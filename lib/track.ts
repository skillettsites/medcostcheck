/**
 * Minimal GA4 event helper for the purchase funnel.
 *
 * Without this there is no way to tell whether the paid report fails because
 * nobody sees the offer, because nobody clicks it, or because people abandon
 * at Stripe. Stripe only shows the last of those, and it showed six sessions
 * and no sales with no way to know the denominator.
 */
type GtagWindow = Window & {
  gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
};

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  try {
    w.gtag?.("event", event, params);
  } catch {
    // Analytics must never break the page.
  }
}
