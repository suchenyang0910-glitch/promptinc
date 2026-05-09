"use client";

import { useEffect } from "react";

import AdSlot from "@/components/AdSlot";

export default function InterstitialAd({ onClose, slot }: { onClose: () => void; slot: string }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">Advertisement</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm font-semibold"
          >
            Close
          </button>
        </div>

        <AdSlot variant="gameover" slot={slot} />
      </div>
    </div>
  );
}

