import type { NextRequest } from "next/server";

// Never throws: a Discord outage or bad webhook must not break the request
export async function notifyDiscord(url: string | undefined, content: string) {
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Visitor-controlled text (referrer, filename) must not be able to @everyone the channel
      body: JSON.stringify({ content: content.slice(0, 2000), allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) console.error("Discord webhook failed:", res.status);
  } catch (err) {
    console.error("Discord webhook failed:", err);
  }
}

// Set by Vercel's edge; absent locally
export function visitorLocation(req: NextRequest) {
  const city = req.headers.get("x-vercel-ip-city");
  const country = req.headers.get("x-vercel-ip-country");
  const parts = [city && decodeURIComponent(city), country].filter(Boolean);
  return parts.length ? parts.join(", ") : "unknown location";
}
