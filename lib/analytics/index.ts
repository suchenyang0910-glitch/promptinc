export type AnalyticsEvent =
  | "game_view"
  | "game_start"
  | "game_pause"
  | "game_reset"
  | "game_over"
  | "score_submit"
  | "ad_impression"
  | "ad_interstitial_shown"
  | "daily_bonus_claim";

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

type Gtag = (...args: ["event", string, Record<string, string | number>]) => void;
type Clarity = (...args: ["event", string]) => void;

function safeParams(params?: AnalyticsParams) {
  const out: Record<string, string | number> = {};
  if (!params) return out;
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    if (typeof v === "boolean") out[k] = v ? 1 : 0;
    else if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "string") out[k] = v.slice(0, 120);
  }
  return out;
}

export function track(event: AnalyticsEvent, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;
  const p = safeParams(params);

  try {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (gtag) gtag("event", event, p);
  } catch {
    return;
  }

  try {
    const clarity = (window as unknown as { clarity?: Clarity }).clarity;
    if (clarity) clarity("event", event);
  } catch {
    return;
  }
}
