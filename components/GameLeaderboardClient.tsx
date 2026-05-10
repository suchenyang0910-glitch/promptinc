"use client";

import { useEffect, useState } from "react";

export default function GameLeaderboardClient({ gameSlug }: { gameSlug: string }) {
  const [Comp, setComp] = useState<null | React.ComponentType<{ gameSlug: string }>>(null);

  useEffect(() => {
    let cancelled = false;

    import("@/components/GameLeaderboard")
      .then((m) => {
        if (cancelled) return;
        setComp(() => m.default);
      })
      .catch(() => {
        return;
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!Comp) {
    return (
      <section className="bg-slate-900 rounded-2xl p-6 space-y-2 border border-slate-800">
        <div className="text-slate-400">Loading leaderboard…</div>
      </section>
    );
  }

  return <Comp gameSlug={gameSlug} />;
}
