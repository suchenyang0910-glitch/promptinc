"use client";

import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics";

export default function AdSlot({
  variant = "inline",
  slot,
}: {
  variant?: "banner" | "inline" | "gameover";
  slot?: string;
}) {
  const heightClass =
    variant === "banner" ? "h-24" : variant === "gameover" ? "h-40" : "h-28";

  const ref = useRef<HTMLElement | null>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (trackedRef.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (trackedRef.current) return;
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        trackedRef.current = true;
        track("ad_impression", { variant, slot: slot ?? "" });
        obs.disconnect();
      },
      { threshold: 0.25 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [slot, variant]);

  return (
    <section
      ref={(node) => {
        ref.current = node;
      }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center"
      data-ad-variant={variant}
      data-ad-slot={slot ?? ""}
    >
      <p className="text-slate-500 text-sm">Advertisement</p>
      <div className={`${heightClass} flex items-center justify-center text-slate-600`}>Ad Slot</div>
    </section>
  );
}
