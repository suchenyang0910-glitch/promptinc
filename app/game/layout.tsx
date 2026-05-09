import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play PromptInc - Free AI Startup Simulator Game",
  description:
    "Play PromptInc, a free browser-based AI startup simulator. Click, upgrade, hire AI workers, and build your AI empire online.",
  alternates: {
    canonical: "/games/promptinc",
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
