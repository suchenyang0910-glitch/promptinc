import type { Metadata } from "next";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact PromptInc for feedback or business inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <div className="mt-6 space-y-4 text-slate-300 leading-7">
          <p>For questions, feedback, or business inquiries, reach out by email.</p>
          <p>
            Email: <span className="font-semibold text-slate-100">contact@yourdomain.com</span>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

