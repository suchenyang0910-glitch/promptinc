export type AdScene =
  | "home_banner"
  | "games_banner"
  | "game_banner_top"
  | "game_banner_bottom"
  | "gameover_interstitial"
  | "leaderboard_banner"
  | "guide_banner"
  | "guide_inline";

export type AdPolicy = {
  interstitialCooldownMs: number;
  maxInterstitialPerSession: number;
};

export function getAdPolicy(): AdPolicy {
  return {
    interstitialCooldownMs: 3 * 60 * 1000,
    maxInterstitialPerSession: 3,
  };
}

const SESSION_KEY_COUNT = "ad:interstitial_count";
const KEY_LAST_SHOWN = "ad:last_shown";

export function canShowInterstitial(now = Date.now()): boolean {
  const policy = getAdPolicy();
  try {
    if (typeof navigator !== "undefined") {
      const nav = navigator as Navigator & { webdriver?: boolean };
      if (nav.webdriver) return false;
    }

    const count = Number(sessionStorage.getItem(SESSION_KEY_COUNT) ?? "0");
    if (Number.isFinite(count) && count >= policy.maxInterstitialPerSession) return false;

    const last = Number(localStorage.getItem(KEY_LAST_SHOWN) ?? "0");
    if (Number.isFinite(last) && now - last < policy.interstitialCooldownMs) return false;

    return true;
  } catch {
    return true;
  }
}

export function markInterstitialShown(now = Date.now()): void {
  try {
    const prev = Number(sessionStorage.getItem(SESSION_KEY_COUNT) ?? "0");
    const next = Number.isFinite(prev) ? prev + 1 : 1;
    sessionStorage.setItem(SESSION_KEY_COUNT, String(next));
    localStorage.setItem(KEY_LAST_SHOWN, String(now));
  } catch {
    return;
  }
}
