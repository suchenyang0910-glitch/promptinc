import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = games[slug];
  if (!g) return { title: "Not Found" };
  return {
    title: "Best " + g.gameName + " Strategies - Advanced Guide",
    description: "Advanced strategies for " + g.gameName + ". Optimal upgrade paths, resource allocation, endgame scaling.",
    alternates: { canonical: "/games/" + g.slug + "/strategies" },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const g = games[slug];
  if (!g) notFound();
  const strats = [
    { t: "Compound Growth", b: "Reinvest all income into upgrades until plateau. First 30 min compounding yields exponential returns." },
    { t: "ROI-Based Path", b: "Cost-per-income: divide cost by income. Prioritize lowest ratio for best efficiency." },
    { t: "Endgame Multipliers", b: "Percentage multipliers beat flat bonuses late-game. Prioritize ALL-income multipliers." },
    { t: "Prestige Loop", b: "Grow until 100x+ income/sec cost -> prestige -> reinvest -> speed past peak." },
    { t: "Speedrun Technique", b: "Click -> cheapest upgrade -> second -> passive -> skip mid-tier -> big multipliers." },
  ];
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <nav className="flex gap-3 text-sm text-slate-400">
          <Link href="/" className="hover:text-white">Home</Link><span>/</span>
          <Link href="/games" className="hover:text-white">Games</Link><span>/</span>
          <Link href={"/games/" + g.slug} className="hover:text-white">{g.gameName}</Link><span>/</span>
          <span className="text-white">Strategies</span>
        </nav>
        <header>
          <h1 className="text-3xl font-bold">Best {g.gameName} Strategies</h1>
          <p className="text-slate-300 text-lg">Advanced tactics to master {g.gameName}.</p>
        </header>
        <AdSlot variant="banner" slot={"strategies-" + g.slug + "-top"} />
        <div className="grid gap-6">
          {strats.map((s, i) => (
            <div key={i} className="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-2">
              <h2 className="text-xl font-semibold text-violet-400">{s.t}</h2>
              <p className="text-slate-300">{s.b}</p>
            </div>
          ))}
        </div>
        <AdSlot variant="banner" slot={"strategies-" + g.slug + "-bottom"} />
        <div className="flex gap-3 pt-4">
          <Link href={"/games/" + g.slug} className="px-4 py-2 bg-indigo-600 rounded-lg font-medium">Play Now</Link>
          <Link href={"/games/" + g.slug + "/guide"} className="px-4 py-2 bg-slate-800 rounded-lg font-medium">Guide</Link>
          <Link href={"/games/" + g.slug + "/tips"} className="px-4 py-2 bg-slate-800 rounded-lg font-medium">Tips</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
