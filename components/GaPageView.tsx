"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type GtagConfig = (...args: ["config", string, Record<string, string>]) => void;

function getGaIdFromDom() {
  try {
    const el = document.querySelector(
      'script[src*="googletagmanager.com/gtag/js?id="]'
    ) as HTMLScriptElement | null;
    const src = el?.getAttribute("src") ?? "";
    const m = src.match(/[?&]id=([^&]+)/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

export default function GaPageView() {
  const pathname = usePathname();

  useEffect(() => {
    const gaId = getGaIdFromDom();
    if (!gaId) return;
    const pagePath = pathname;

    try {
      const gtag = (window as unknown as { gtag?: GtagConfig }).gtag;
      if (gtag) gtag("config", gaId, { page_path: pagePath });
    } catch {
      return;
    }
  }, [pathname]);

  return null;
}
