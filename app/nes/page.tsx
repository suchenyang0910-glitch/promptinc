import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import NesEmulatorClient from "@/components/nes/NesEmulatorClient";

export const metadata: Metadata = {
  title: "NES Emulator - PromptInc",
  description: "Upload a local .nes ROM, or instantly try free-to-redistribute sample ROMs with license sources.",
  alternates: {
    canonical: "/nes",
  },
};

export default function NesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="text-slate-400 hover:text-white">
            ← Home
          </Link>
          <div className="flex items-center gap-4 text-sm flex-wrap justify-end">
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
            <Link href="/leaderboards" className="text-slate-400 hover:text-white">
              Leaderboards
            </Link>
          </div>
        </nav>

        <header className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-2">
          <h1 className="text-3xl font-bold">NES Emulator</h1>
          <p className="text-slate-300">
            Upload a local <span className="font-semibold">.nes</span> ROM, or instantly try sample ROMs that are free to redistribute.
          </p>
        </header>

        <AdSlot variant="banner" slot="nes-top" />

        <NesEmulatorClient />

        <AdSlot variant="banner" slot="nes-bottom" />
      </section>

      <Footer />
    </main>
  );
}
