import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Game Not Found</h1>

        <p className="text-slate-400">This game does not exist or has been moved.</p>

        <Link
          href="/games"
          className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold"
        >
          Browse Games
        </Link>
      </div>
    </main>
  );
}

