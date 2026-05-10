"use client";

import { useEffect, useState } from "react";

import type { GameConfig } from "@/types/game";

export default function GameMountClient({ game }: { game: GameConfig }) {
  const [Mount, setMount] = useState<null | React.ComponentType<{ game: GameConfig }>>(null);

  useEffect(() => {
    let cancelled = false;

    import("@/components/GameMount")
      .then((m) => {
        if (cancelled) return;
        setMount(() => m.default);
      })
      .catch(() => {
        return;
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!Mount) {
    return (
      <section className="bg-slate-900 rounded-2xl p-6 space-y-2 border border-slate-800">
        <div className="text-slate-400">Loading game…</div>
      </section>
    );
  }

  return <Mount game={game} />;
}
