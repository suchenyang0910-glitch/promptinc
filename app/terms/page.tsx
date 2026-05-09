import type { Metadata } from "next";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for playing PromptInc.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Use</h1>
        <div className="mt-6 space-y-4 text-slate-300 leading-7">
          <p>By using PromptInc, you agree to use the website for personal entertainment purposes only.</p>
          <p>
            PromptInc is a simulation game. It does not involve real money, investment advice, gambling, or financial
            services.
          </p>
          <p>We may update or modify the website, the game features, or these terms at any time.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

