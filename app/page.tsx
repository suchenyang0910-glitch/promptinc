import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";

export const metadata: Metadata = {
  title: "PromptInc - Free AI Startup Simulator Online",
  description:
    "Play PromptInc online for free. Build your AI startup, hire AI workers, upgrade GPU servers, and grow your digital empire.",
};

export default function HomePage() {
  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PromptInc",
    url: "/",
    description:
      "Free online games you can play instantly in your browser: idle, retro arcade, puzzle, and more.",
  };

  const featured = [
    games["promptinc"],
    games["retro-snake"],
    games["brick-block-classic"],
    games["brick-breaker"],
    games["bubble-shooter"],
    games["retro-air-strike"],
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />

      <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/logo.jpg"
            alt="PromptInc logo"
            width={80}
            height={80}
            priority
            className="rounded-2xl border border-slate-800 object-cover"
          />
        </div>
        <h1 className="text-5xl font-bold">PromptInc</h1>

        <p className="text-xl text-slate-300">
          Build your own AI startup empire in this free online simulator game.
        </p>

        <div>
          <Link
            href="/games/promptinc"
            className="inline-block bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl text-xl font-bold"
          >
            Play Now
          </Link>
          <Link
            href="/games"
            className="inline-block border border-slate-700 hover:bg-slate-800 px-8 py-4 rounded-xl text-xl font-bold ml-3"
          >
            Browse Games
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
          <Link href="/categories" className="hover:text-white">
            Categories
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/top" className="hover:text-white">
            Top
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/nes" className="hover:text-white">
            NES
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/leaderboards" className="hover:text-white">
            Leaderboards
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-12">
        <AdSlot variant="banner" slot="home-top" />
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="text-3xl font-bold">Popular Games</h2>
          <Link href="/games" className="text-slate-400 hover:text-white">
            Browse all
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-6 space-y-3 border border-slate-800"
            >
              <div className="text-4xl">{game.emoji}</div>
              <div>
                <div className="text-sm text-blue-400">{game.category}</div>
                <div className="text-xl font-bold">{game.gameName}</div>
              </div>
              <div className="text-slate-400 text-sm">{game.shortDescription}</div>
              <div className="inline-block bg-blue-600 px-4 py-2 rounded-xl font-bold w-fit">Play</div>
            </Link>
          ))}
        </div>
      </section>

      {/* NES模拟器专区 */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <div className="bg-gradient-to-r from-gray-900 to-[#1a0a0a] rounded-2xl p-8 border border-[#e60012]/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🎮</span>
                <h2 className="text-3xl font-bold text-[#e60012]">NES经典游戏模拟器</h2>
              </div>
              <p className="text-gray-300 max-w-xl">
                重温童年经典！在线畅玩FC/NES怀旧游戏，支持键盘和触屏操作，所有内置ROM均合规可自由分发。
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                href="/roms"
                className="inline-block bg-[#e60012] hover:bg-red-700 px-8 py-4 rounded-xl text-lg font-bold text-center transition-colors"
              >
                浏览游戏库
              </Link>
              <Link
                href="/nes"
                className="inline-block border border-gray-700 hover:bg-gray-800 px-8 py-3 rounded-xl text-center transition-colors"
              >
                进入模拟器
              </Link>
            </div>
          </div>
          
          {/* 推荐的NES游戏预览 */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "NES Starter", id: "starter" },
              { name: "NEStress", id: "nestress" },
              { name: "nestest", id: "nestest" },
              { name: "RasterDemo", id: "rasterdemo" },
              { name: "RasterTest1", id: "rastertest1" },
            ].map((rom) => (
              <Link
                key={rom.id}
                href={`/play/${rom.id}`}
                className="bg-black/50 hover:bg-black/80 rounded-xl p-4 text-center border border-gray-800 hover:border-[#e60012]/50 transition-all group"
              >
                <div className="text-2xl mb-2">🕹️</div>
                <div className="text-xs text-gray-400 group-hover:text-white truncate transition-colors">
                  {rom.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h2 className="text-3xl font-bold">Free AI Startup Simulator Game</h2>

        <p className="text-slate-300">
          PromptInc is a free browser game where you start with a small idea and grow it into a powerful AI company.
          Click to build your first product, hire AI workers, upgrade GPU servers, and unlock bigger business growth.
        </p>

        <p className="text-slate-300">
          The game is designed for players who enjoy idle games, clicker games, startup games, business simulators, and
          incremental games.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h2 className="text-3xl font-bold">How to Play PromptInc</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold">1. Click to Build</h3>
            <p className="text-slate-400">
              Start by clicking the launch button to earn your first valuation.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold">2. Hire AI Workers</h3>
            <p className="text-slate-400">
              Use your valuation to hire your first team and generate automatic revenue.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold">3. Grow Your Empire</h3>
            <p className="text-slate-400">
              Upgrade compute, deploy agents, and scale your startup into a global AI empire.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h2 className="text-3xl font-bold">Game Features</h2>

        <ul className="grid md:grid-cols-2 gap-4 text-slate-300">
          <li className="bg-slate-900 rounded-xl p-4">✅ Free to play</li>
          <li className="bg-slate-900 rounded-xl p-4">✅ No download required</li>
          <li className="bg-slate-900 rounded-xl p-4">✅ Browser-based gameplay</li>
          <li className="bg-slate-900 rounded-xl p-4">✅ Idle income system</li>
          <li className="bg-slate-900 rounded-xl p-4">✅ Startup growth simulation</li>
          <li className="bg-slate-900 rounded-xl p-4">✅ Works on mobile and desktop</li>
        </ul>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h2 className="text-3xl font-bold">FAQ</h2>

        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Is PromptInc free?</h3>
            <p className="text-slate-400">Yes. PromptInc is free to play directly in your browser.</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Do I need to download anything?</h3>
            <p className="text-slate-400">
              No. You can play PromptInc online without downloading or installing anything.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Is this a real investment game?</h3>
            <p className="text-slate-400">
              No. PromptInc is only a simulation game for entertainment. It does not involve real money, gambling, or
              financial services.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <AdSlot variant="banner" slot="home-bottom" />
      </section>

      <Footer />
    </main>
  );
}
