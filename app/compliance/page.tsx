import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { sampleRoms } from "@/lib/nes/sampleRoms";

export const metadata: Metadata = {
  title: "Compliance Notice - NES Emulator - PromptInc",
  description: "Copyright and compliance notice for the NES emulator. Built-in ROMs include license sources.",
  alternates: {
    canonical: "/compliance",
  },
};

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Home
          </Link>
          <div className="flex items-center gap-4 text-sm flex-wrap justify-end">
            <Link href="/roms" className="text-gray-400 hover:text-white transition-colors">
              ROM Library
            </Link>
            <Link href="/nes" className="text-gray-400 hover:text-white transition-colors">
              Emulator
            </Link>
          </div>
        </nav>

        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 space-y-4">
          <h1 className="text-4xl font-bold text-[#e60012]">Compliance Notice</h1>
          <p className="text-gray-300 text-lg">
            We operate a retro gaming experience with a focus on copyright compliance and responsible usage.
          </p>
        </header>

        <AdSlot variant="banner" slot="compliance-top" />

        {/* Copyright */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">Copyright</h2>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <p>
              This site provides emulator technology only and does not provide commercial ROM downloads. Any built-in sample ROMs meet at least one of the following:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Public domain works</li>
              <li>Open-source / freeware works with explicit redistribution permission</li>
              <li>Technical test or demo ROMs</li>
            </ul>
          </div>
        </div>

        {/* User Responsibility */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">User Responsibility</h2>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <p>By using this site, you agree that you will:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Only upload ROM files you legally own or have permission to use</li>
              <li>Not use this site for unlawful purposes</li>
              <li>Respect the rights of copyright holders</li>
              <li>Not distribute infringing content using this site</li>
            </ul>
            <p className="text-yellow-400 bg-yellow-950/50 p-4 rounded-xl border border-yellow-800">
              <strong>Important:</strong> Any ROM you upload is processed locally in your browser and is not uploaded to our servers.
              We cannot access your local files. You are responsible for ensuring you have the rights to use the content.
            </p>
          </div>
        </div>

        {/* Built-in ROM list */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">Built-in Sample ROMs</h2>
          <p className="text-gray-400">These sample ROMs are included with source and license references:</p>
          
          <div className="space-y-4">
            {sampleRoms.map((rom) => (
              <div
                key={rom.id}
                className="bg-gray-950/50 rounded-xl p-5 border border-gray-800"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{rom.title}</h3>
                    <p className="text-sm text-gray-400">{rom.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs font-medium border border-green-800">
                      {rom.licenseName}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-6 text-sm">
                  <a
                    href={rom.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📦 Source: {rom.sourceLabel}
                  </a>
                  <a
                    href={rom.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📜 View license
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">Terms</h2>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <h3 className="text-xl font-semibold text-white">Disclaimer</h3>
            <p>
              This site is provided "as is" without warranties of any kind. We are not liable for any direct or indirect damages arising from use of the site.
            </p>
            
            <h3 className="text-xl font-semibold text-white mt-6">Intellectual Property</h3>
            <p>
              The emulator integration, site design, and code are protected by intellectual property laws. Do not copy or redistribute without permission.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">Changes</h3>
            <p>
              We may update this notice at any time. Continued use of the site indicates acceptance of the updated terms.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">Copyright Complaints</h2>
          <p className="text-gray-300">
            If you believe any content on this site infringes your copyright, contact us and we will review promptly:
          </p>
          <div className="bg-gray-950/50 rounded-xl p-6 border border-gray-800">
            <p className="text-gray-300">
              <strong>Email:</strong> copyright@example.com<br />
              <strong>Response time:</strong> We typically respond within 3 business days.
            </p>
          </div>
        </div>

        <AdSlot variant="banner" slot="compliance-bottom" />

        {/* Back */}
        <div className="flex justify-center pb-8">
          <Link
            href="/roms"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#e60012] hover:bg-red-700 rounded-xl font-bold transition-colors"
          >
            Browse ROM library →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
