/**
 * Ad network configuration for PromptInc.
 *
 * =====================================
 * 🚨 SETUP INSTRUCTIONS
 * =====================================
 * 1. Sign up at a supported ad network (Adsterra / PropellerAds / EZmob)
 * 2. Create two ad units:
 *    A. Interstitial / Popunder — for in-game interstitial
 *    B. Native / Banner (300x250) — for bottom-of-page display
 * 3. Replace the placeholder codes below with your generated codes
 * 4. When you have real codes, set AD_NETWORK to "production"
 * 5. Rebuild and redeploy
 */

export const AD_CONFIG = {
  /**
   * Set to "production" when real ad codes are configured.
   * "placeholder" shows gray placeholder slots.
   */
  mode: "placeholder" as "placeholder" | "production",

  /**
   * Interstitial ad code (popunder / interstitial).
   * PropellerAds: paste the <script> tag from your interstitial zone
   * Adsterra: paste the <script> from your popunder zone
   */
  interstitialCode: `<!-- PASTE YOUR INTERSTITIAL AD SCRIPT HERE -->
<div class="bg-slate-800 rounded-lg p-4 text-center text-slate-400">
  [Interstitial Ad Placeholder — Replace with real ad code]
</div>`,

  /**
   * Native/banner ad code (300x250 recommended).
   * PropellerAds: paste the <script> tag from your native zone
   * Adsterra: paste the <script> from your 300x250 banner zone
   */
  nativeCode: `<!-- PASTE YOUR NATIVE AD SCRIPT HERE -->
<div class="bg-slate-800 rounded-lg p-4 text-center text-slate-400">
  [Native Ad Placeholder — 300x250 — Replace with real ad code]
</div>`,

  interstitial: {
    /**
     * How often (ms) to show interstitial while the game is active.
     * First delay: 30s after game starts
     * Repeat interval: 60s
     */
    firstDelayMs: 30_000,
    repeatIntervalMs: 60_000,
  },
} as const;
