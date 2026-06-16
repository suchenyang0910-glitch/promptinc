import { NextResponse } from "next/server";

type CspReport = {
  "document-uri"?: string;
  referrer?: string;
  "violated-directive"?: string;
  "effective-directive"?: string;
  "original-policy"?: string;
  disposition?: string;
  "blocked-uri"?: string;
  "status-code"?: number;
  "source-file"?: string;
  "line-number"?: number;
  "column-number"?: number;
};

type ReportingApiItem = {
  type?: string;
  url?: string;
  body?: {
    age?: number;
    disposition?: string;
    effectiveDirective?: string;
    blockedURL?: string;
    documentURL?: string;
    originalPolicy?: string;
    referrer?: string;
    statusCode?: number;
    sourceFile?: string;
    lineNumber?: number;
    columnNumber?: number;
    sample?: string;
  };
};

function safeStr(v: unknown, max = 600) {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s) return undefined;
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

function safeNum(v: unknown) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return undefined;
}

function normalizeFromLegacy(payload: unknown): CspReport | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const maybe = root["csp-report"];
  if (!maybe || typeof maybe !== "object") return null;
  const r = maybe as Record<string, unknown>;

  return {
    "document-uri": safeStr(r["document-uri"]),
    referrer: safeStr(r.referrer),
    "violated-directive": safeStr(r["violated-directive"]),
    "effective-directive": safeStr(r["effective-directive"]),
    "original-policy": safeStr(r["original-policy"]),
    disposition: safeStr(r.disposition),
    "blocked-uri": safeStr(r["blocked-uri"]),
    "status-code": safeNum(r["status-code"]),
    "source-file": safeStr(r["source-file"]),
    "line-number": safeNum(r["line-number"]),
    "column-number": safeNum(r["column-number"]),
  };
}

function normalizeFromReportingApi(payload: unknown): CspReport | null {
  if (!Array.isArray(payload)) return null;
  const first = payload.find((x) => x && typeof x === "object") as ReportingApiItem | undefined;
  if (!first?.body || typeof first.body !== "object") return null;
  const b = first.body;

  return {
    "document-uri": safeStr(b.documentURL) ?? safeStr(first.url),
    referrer: safeStr(b.referrer),
    "violated-directive": safeStr(b.effectiveDirective),
    "effective-directive": safeStr(b.effectiveDirective),
    "original-policy": safeStr(b.originalPolicy),
    disposition: safeStr(b.disposition),
    "blocked-uri": safeStr(b.blockedURL),
    "status-code": safeNum(b.statusCode),
    "source-file": safeStr(b.sourceFile),
    "line-number": safeNum(b.lineNumber),
    "column-number": safeNum(b.columnNumber),
  };
}

export async function POST(req: Request) {
  const ua = safeStr(req.headers.get("user-agent"), 240);
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "";

  let payload: unknown = null;
  try {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json") || ct.includes("application/reports+json")) {
      payload = await req.json();
    } else {
      const raw = await req.text();
      if (raw) payload = JSON.parse(raw);
    }
  } catch {
    return NextResponse.json({ ok: true }, { status: 204 });
  }

  const report = normalizeFromLegacy(payload) ?? normalizeFromReportingApi(payload);
  if (report) {
    const event = {
      type: "csp",
      ts: Date.now(),
      ip: safeStr(ip, 120),
      ua,
      doc: report["document-uri"],
      blocked: report["blocked-uri"],
      violated: report["violated-directive"],
      effective: report["effective-directive"],
      disposition: report.disposition,
      status: report["status-code"],
      source: report["source-file"],
      line: report["line-number"],
      col: report["column-number"],
    };
    console.info(JSON.stringify(event));
  }

  return new Response(null, { status: 204 });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
