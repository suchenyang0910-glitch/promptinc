"use client";

import { useCallback, useEffect, useRef } from "react";

import { AD_CONFIG } from "@/lib/ads/adConfig";
import { canShowInterstitial, markInterstitialShown } from "@/lib/ads/policy";

type InterstitialOptions = {
  /** Whether the interstitial system is active (e.g. game is running) */
  active: boolean;
  /** Called when user wants to see an interstitial */
  onShowAd?: () => void;
};

/**
 * Custom hook that periodically triggers interstitial ads while a game is active.
 *
 * - First interstitial appears after `firstDelayMs` (default 30s)
 * - Then repeats every `repeatIntervalMs` (default 60s)
 * - Respects the ad policy (max per session, cooldown)
 * - Does not block the game — simply fires a callback
 *
 * Usage in a game component:
 *
 *   const { showInterstitial, InterstitialOverlay } = useInterstitialAd({ active: isPlaying });
 *
 *   // Call anywhere:
 *   showInterstitial();
 *
 *   // Or render the overlay when shown:
 *   {showOverlay && <InterstitialOverlay onClose={() => setOverlay(false)} />}
 */
export function useInterstitialAd({ active, onShowAd }: InterstitialOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attemptShow = useCallback(() => {
    if (!canShowInterstitial()) return false;
    markInterstitialShown();
    onShowAd?.();
    return true;
  }, [onShowAd]);

  // Exposed method for manual triggers (e.g. level complete)
  const showInterstitial = useCallback(() => {
    attemptShow();
  }, [attemptShow]);

  // Start/stop the periodic timer based on `active`
  useEffect(() => {
    if (!active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // First interstitial after initial delay
    timeoutRef.current = setTimeout(() => {
      attemptShow();

      // Then repeat every interval
      intervalRef.current = setInterval(() => {
        attemptShow();
      }, AD_CONFIG.interstitial.repeatIntervalMs);
    }, AD_CONFIG.interstitial.firstDelayMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, attemptShow]);

  return { showInterstitial };
}
