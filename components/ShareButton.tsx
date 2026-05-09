"use client";

export default function ShareButton({ gameSlug }: { gameSlug: string }) {
  async function shareGame() {
    const url = window.location.origin + `/games/${gameSlug}`;
    const shareData = {
      title: "PromptInc",
      text: "Play free browser games on PromptInc.",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        return;
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      window.alert("Game link copied!");
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={shareGame}
      className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl py-3 font-bold"
    >
      Share Game
    </button>
  );
}
