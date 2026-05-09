import type { Metadata } from "next";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what PromptInc is and why it exists.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">About PromptInc</h1>
        <div className="mt-6 space-y-4 text-slate-300 leading-7">
          <p>
            PromptInc is a free, browser-based AI startup simulator. It is designed to be simple, fast, and playable on
            mobile.
          </p>
          <p>
            The core loop is intentionally minimal: click to earn money, buy upgrades, hire AI workers, and scale your
            income over time.
          </p>
          <p>
            This website exists to provide a fun mini game experience and to explore lightweight SEO-friendly game
            publishing.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

