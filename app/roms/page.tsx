import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import RomsListClient from "./RomsListClient";

export const metadata: Metadata = {
  title: "NES ROM Library - PromptInc",
  description: "Browse free-to-redistribute NES ROMs you can play instantly in your browser.",
  alternates: {
    canonical: "/roms",
  },
};

export default function RomsPage() {

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Home
          </Link>
          <div className="flex items-center gap-4 text-sm flex-wrap justify-end">
            <Link href="/nes" className="text-gray-400 hover:text-white transition-colors">
              Emulator
            </Link>
            <Link href="/compliance" className="text-gray-400 hover:text-white transition-colors">
              Compliance
            </Link>
            <Link href="/games" className="text-gray-400 hover:text-white transition-colors">
              Games
            </Link>
          </div>
        </nav>

        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 space-y-4">
          <h1 className="text-4xl font-bold text-[#e60012]">NES ROM Library</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            A curated collection of free-to-redistribute NES/FC ROMs. Play instantly in your browser with keyboard and touch controls.
          </p>
        </header>

        <AdSlot variant="banner" slot="roms-top" />

        <RomsListClient />

        <AdSlot variant="banner" slot="roms-bottom" />

        {/* Notes */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">About This Library</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Redistribution-Friendly</h3>
              <p className="text-sm leading-relaxed">
                Built-in ROMs are public domain, explicitly licensed for redistribution, or intended for testing/demo use.
                Each entry includes license information and source links.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Local Playback</h3>
              <p className="text-sm leading-relaxed">
                Games run locally in your browser. If you upload your own ROM, it is processed locally and not uploaded to any server.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <Link
              href="/compliance"
              className="inline-flex items-center gap-2 text-[#e60012] hover:text-red-400 font-semibold transition-colors"
            >
              Read the full compliance notice →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
