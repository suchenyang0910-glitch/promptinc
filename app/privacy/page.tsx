import type { Metadata } from "next";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how PromptInc handles data and privacy.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-slate-300 leading-7">
          <p>PromptInc respects your privacy. You can play without creating an account.</p>
          <p>
            Game progress may be stored locally in your browser using localStorage. This data stays on your device and
            is only used to restore your game progress.
          </p>
          <p>
            We may use third-party analytics and advertising services (such as Google AdSense) to support free gameplay.
            These providers may use cookies or similar technologies according to their own policies.
          </p>
          <p>If you have questions about this policy, contact us via the Contact page.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

