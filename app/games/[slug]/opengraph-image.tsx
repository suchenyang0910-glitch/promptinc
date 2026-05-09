import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { games } from "@/games";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const game = games[slug];
  if (!game) notFound();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #020617 0%, #0b1224 45%, #111827 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, color: "#94a3b8" }}>PromptInc</div>
          <div
            style={{
              fontSize: 22,
              color: "#60a5fa",
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(96, 165, 250, 0.12)",
              border: "1px solid rgba(96, 165, 250, 0.18)",
            }}
          >
            {game.category}
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ fontSize: 110 }}>{game.emoji}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1 }}>{game.gameName}</div>
            <div style={{ marginTop: 18, fontSize: 30, color: "#cbd5e1" }}>{game.shortDescription}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            "Play free",
            "Instant in browser",
            "Leaderboard",
          ].map((t) => (
            <div
              key={t}
              style={{
                fontSize: 24,
                padding: "10px 16px",
                borderRadius: 999,
                background: "rgba(148, 163, 184, 0.12)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}

