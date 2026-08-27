"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics";

const SAMEWAVE_URL =
  "https://samewave.cc/?utm_source=promptinc&utm_medium=internal_ad&utm_campaign=adult_interest_discovery";
const CREATIVE = "samewave-banner-concept-8x1-v1";

type SamewavePromoProps = {
  slot: string;
};

/**
 * First-party Samewave promotion. Kept separate from external ad-network code
 * so it can be measured and retired independently.
 */
export default function SamewavePromo({ slot }: SamewavePromoProps) {
  const ref = useRef<HTMLElement | null>(null);
  const trackedImpression = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || trackedImpression.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || trackedImpression.current) return;
        trackedImpression.current = true;
        track("samewave_promo_impression", {
          slot,
          creative: CREATIVE,
          format: "banner",
          placement: "home_bottom",
        });
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [slot]);

  return (
    <section ref={ref} aria-label="Samewave promotion" data-testid="samewave-promo" data-ad-slot={slot}>
      <a
        href={SAMEWAVE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track("samewave_promo_click", {
            slot,
            creative: CREATIVE,
            format: "banner",
            cta_variant: "enter",
          });
        }}
        className="group relative flex min-h-24 items-center overflow-hidden rounded-2xl border border-[#d6a8ff]/30 bg-gradient-to-r from-[#121019] to-[#241a37] px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d2ff] sm:px-6"
      >
        <Image
          src="/ads/samewave/samewave-banner-concept-8x1-v1.png"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 896px"
          className="object-cover opacity-55 motion-safe:transition-transform motion-safe:duration-[12000ms] motion-safe:group-hover:scale-105"
        />
        <div className="relative flex w-full min-w-0 items-center gap-3 text-[#f7f3fa] sm:gap-5">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f1d2ff] sm:text-xs">
            Promotion · 18+
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold sm:text-lg">Discover connections with respect and boundaries</span>
            <span className="hidden truncate text-xs text-[#c6b8d6] lg:block">在尊重与边界中，发现同频连接</span>
          </span>
          <span className="shrink-0 rounded-xl bg-[#b46cff] px-3 py-2 text-sm font-bold text-white shadow-sm transition motion-safe:group-hover:-translate-y-px motion-safe:duration-150">
            Explore
          </span>
        </div>
      </a>
    </section>
  );
}
