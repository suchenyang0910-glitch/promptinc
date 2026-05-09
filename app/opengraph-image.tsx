import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1 }}>PromptInc</div>
        <div style={{ marginTop: 16, fontSize: 32, color: "#94a3b8" }}>
          Free online idle, retro, puzzle & arcade games
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            "Instant play",
            "Leaderboards",
            "Mobile-friendly",
            "No downloads",
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

