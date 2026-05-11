"use client";

/**
 * TG channel promotion bar — shows a call-to-action
 * to join the game tips channel.
 *
 * When you have a real TG channel, update the URL below.
 */

export default function TgPromoBar({ gameName }: { gameName?: string }) {
  // TODO: Replace with real TG channel when created
  const channelUrl = "https://t.me/monyForDNY";
  const channelName = "@monyForDNY";

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-sky-800 bg-sky-950/40 hover:bg-sky-900/50 transition-colors p-4 text-center"
      >
        <p className="text-sky-400 font-semibold text-sm sm:text-base">
          📢 {gameName ? `Get ${gameName} tips & guides → ` : "Get game tips & guides → "}
          <span className="text-sky-300 underline decoration-dotted">{channelName}</span>
        </p>
      </a>
    </div>
  );
}
