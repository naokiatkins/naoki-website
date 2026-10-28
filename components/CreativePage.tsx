import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Photos and music sites, built from the professional site's header, hero type and footer
export default async function CreativePage({
  section,
  title,
  intro,
  children,
}: {
  section: "photos" | "music";
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  // Absolute links: on photos.<root>, a relative "/music" would be rewritten to /photos/music
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const root = (h.get("host") ?? "photos.naokiatkins.com").split(".").slice(1).join(".");
  const site = (sub?: string) => `${proto}://${sub ? `${sub}.` : ""}${root}`;
  // Footer lists only the other two sites
  const others = [
    { key: "photos", label: "Photos", href: site("photos") },
    { key: "music", label: "Music", href: site("music") },
    { key: "work", label: "Work", href: site() },
  ].filter((l) => l.key !== section);

  return (
    <>
      <Header homeHref={site()} links={[]} cta={null} />
      <main>
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 motion-safe:animate-fade-up">
          <h1 className="text-3xl md:text-5xl leading-tight md:leading-[1.15] tracking-tight max-w-4xl">
            <span className="font-semibold">{title}.</span>{" "}
            <span className="font-serif">{intro}</span>
          </h1>
        </section>
        {children}
      </main>
      <Footer links={others} />
    </>
  );
}
