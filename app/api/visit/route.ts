import { NextRequest, NextResponse } from "next/server";
import { notifyDiscord, visitorLocation } from "@/lib/discord";

const LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;
// shortcut: per-instance memory, so the limit resets on cold starts and isn't shared
// across instances; move to Postgres or Upstash if the channel gets spammed.
const recent = new Map<string, number[]>();

function device(ua: string) {
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Macintosh/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows";
  if (/Linux/.test(ua)) return "Linux";
  return "unknown device";
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (/bot|crawl|spider|preview|headless/i.test(ua)) {
    return new NextResponse(null, { status: 204 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) return new NextResponse(null, { status: 204 });
  if (recent.size > 1000) recent.clear(); // keep the map from growing forever
  recent.set(ip, [...hits, now]);

  // Only the referring site's hostname, never the full URL
  let from = "direct";
  try {
    const { referrer } = await req.json();
    if (typeof referrer === "string" && referrer) from = new URL(referrer).hostname;
  } catch {
    // Missing or malformed body: treat as a direct visit
  }

  await notifyDiscord(process.env.DISCORD_VISITS_WEBHOOK_URL, `👀 New visitor · ${visitorLocation(req)} · from ${from} · ${device(ua)}`);
  return new NextResponse(null, { status: 204 });
}
