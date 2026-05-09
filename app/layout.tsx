import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

function resolveBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(resolveBaseUrl()),
  title: {
    default: "PromptInc",
    template: "%s | PromptInc",
  },
  description:
    "Play PromptInc online for free. Build your AI startup, hire AI workers, upgrade GPU servers, and grow your digital empire.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "PromptInc",
    description:
      "Play PromptInc online for free. Build your AI startup, hire AI workers, upgrade GPU servers, and grow your digital empire.",
    images: [{ url: "/logo.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptInc",
    description:
      "Play PromptInc online for free. Build your AI startup, hire AI workers, upgrade GPU servers, and grow your digital empire.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-white">{children}</body>
    </html>
  );
}
