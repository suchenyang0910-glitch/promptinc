import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = "airportinc";
  const g = games[slug];
  if (!g) return { title: "Not Found" };
  return {
    title: g.gameName + " Tips & Tricks - Boost Your Score",
    description: "Pro tips for " + g.gameName + ". Learn optimal upgrade order, hidden mechanics, and how to maximize earnings.",
    alternates: { canonical: "/games/" + g.slug + "/tips" },
  };
}

export default async function Page({ params }: Props) {
  const slug = "airportinc";
  const g = games[slug];
  if (!g) notFound();
  const tips = [
    { t: "Early Game Clicks", b: "Click aggressively first 5 min. Build capital, snowball into upgrades." },
    { t: "Upgrade ROI", b: "Buy cheapest upgrade first unless better cost-per-income elsewhere." },
    { t: "Don't Hoard Cash", b: "Spend on upgrades as soon as affordable. Idle cash is wasted potential." },
    { t: "Offline Earnings", b: "Invest in highest income/sec before closing. Offline = rate at departure." },
    { t: "Hidden Synergies", b: "Some upgrades unlock combo bonuses. Check descriptions carefully." },
    { t: "Prestige Timing", b: "Prestige only when upgrades cost 100x+ your income/sec." },
  ];
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <nav className="flex gap-3 text-sm text-slate-400">
          <Link href="/" className="hover:text-white">Home</Link><span>/</span>
          <Link href="/games" className="hover:text-white">Games</Link><span>/</span>
          <Link href={"/games/" + g.slug} className="hover:text-white">{g.gameName}</Link><span>/</span>
          <span className="text-white">Tips</span>
        </nav>
        <header>
          <h1 className="text-3xl font-bold">{g.gameName} Tips & Tricks</h1>
          <p className="text-slate-300 text-lg">Pro strategies to boost your score in {g.gameName}.</p>
        </header>
        <AdSlot variant="banner" slot={"tips-" + g.slug + "-top"} />
        <div className="grid gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-2">
              <h2 className="text-xl font-semibold text-emerald-400">{tip.t}</h2>
              <p className="text-slate-300">{tip.b}</p>
            </div>
          ))}
        </div>
        <AdSlot variant="banner" slot={"tips-" + g.slug + "-bottom"} />
        <div className="flex gap-3 pt-4">
          <Link href={"/games/" + g.slug} className="px-4 py-2 bg-indigo-600 rounded-lg font-medium">Play Now</Link>
          <Link href={"/games/" + g.slug + "/guide"} className="px-4 py-2 bg-slate-800 rounded-lg font-medium">Guide</Link>
          <Link href={"/games/" + g.slug + "/strategies"} className="px-4 py-2 bg-slate-800 rounded-lg font-medium">Strategies</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
