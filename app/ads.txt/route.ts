import { NextResponse } from "next/server";

export async function GET() {
  const pubId = process.env.ADSENSE_PUB_ID;
  const lines: string[] = [];

  if (pubId) {
    const normalized = pubId.startsWith("pub-") ? pubId : `pub-${pubId}`;
    lines.push(`google.com, ${normalized}, DIRECT, f08c47fec0942fa0`);
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

