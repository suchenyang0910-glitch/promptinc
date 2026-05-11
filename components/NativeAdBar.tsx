"use client";

import { AD_CONFIG } from "@/lib/ads/adConfig";

type NativeAdBarProps = {
  /** Optional CSS classes */
  className?: string;
  /** Size variant */
  size?: "300x250" | "728x90" | "responsive";
};

/**
 * Native / banner ad bar, placed at the bottom of content sections.
 * Shows a real ad code when AD_CONFIG.mode === "production",
 * otherwise shows a placeholder.
 */
export default function NativeAdBar({ className = "", size = "responsive" }: NativeAdBarProps) {
  const sizeClass =
    size === "300x250" ? "w-[300px] h-[250px]" : size === "728x90" ? "w-[728px] h-[90px]" : "w-full min-h-[90px]";

  return (
    <div
      className={`flex justify-center ${className}`}
      data-ad-type="native"
      data-ad-size={size}
    >
      <div
        className={`${sizeClass} overflow-hidden rounded-xl border border-slate-800 bg-slate-900`}
      >
        {AD_CONFIG.mode === "production" ? (
          <div
            dangerouslySetInnerHTML={{ __html: AD_CONFIG.nativeCode }}
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-500 text-sm">
            <span>📢 Native Ad ({size})</span>
          </div>
        )}
      </div>
    </div>
  );
}
