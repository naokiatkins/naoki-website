import { NextResponse, type NextRequest } from "next/server";

// Subdomain → app folder, e.g. photos.naokiatkins.com/ serves app/photos/page.tsx
const SECTIONS = ["photos", "music"];

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const [sub, ...rest] = host.split(".");
  const { pathname } = req.nextUrl;

  if (SECTIONS.includes(sub)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${sub}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // naokiatkins.com/photos → photos.naokiatkins.com, so each section lives on one address only
  const section = SECTIONS.find((s) => pathname === `/${s}` || pathname.startsWith(`/${s}/`));
  if (section) {
    const root = sub === "www" ? rest.join(".") : host;
    const target = new URL(req.url);
    target.host = `${section}.${root}`;
    target.pathname = pathname.slice(section.length + 1) || "/";
    return NextResponse.redirect(target);
  }
}

export const config = {
  // Pages only: skip API routes, Next internals, analytics and files with extensions
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
