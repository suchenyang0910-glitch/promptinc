"use client";

export default function ShareButton({ gameSlug }: { gameSlug: string }) {
  async function fallbackShare(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      window.alert("Game link copied!");
      return;
    } catch {
      // ignore
    }

    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
      "Play this game on PromptInc"
    )}`;
    try {
      window.open(tgUrl, "_blank", "noreferrer");
      return;
    } catch {
      // ignore
    }

    window.prompt("Copy this link:", url);
  }

  async function shareGame() {
    const url = window.location.origin + `/games/${gameSlug}`;
    const shareData = {
      title: "PromptInc",
      text: "Play free browser games on PromptInc.",
      url,
    };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData);
      } catch {
        await fallbackShare(url);
      }
      return;
    }

    await fallbackShare(url);
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
