import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/game", label: "Play" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Image
            src="/logo.jpg"
            alt="PromptInc logo"
            width={40}
            height={40}
            className="rounded-xl border border-white/10 object-cover"
          />
          <div>
            <div className="font-semibold text-slate-200">PromptInc</div>
            <div className="mt-1">A free AI startup simulator you can play in the browser.</div>
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

