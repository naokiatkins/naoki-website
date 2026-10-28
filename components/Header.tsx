type Link = { label: string; href: string };

// Defaults are the professional site's; photos/music pass their own links
const SECTION_LINKS: Link[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Certificates", href: "#certificates" },
  { label: "Work", href: "#work" },
];

export default function Header({
  homeHref = "#",
  links = SECTION_LINKS,
  cta = { label: "Check fit →", href: "#book" },
}: {
  homeHref?: string;
  links?: Link[];
  cta?: Link | null;
}) {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-ink/10">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href={homeHref} className="font-semibold tracking-tight">
          Naoki Atkins
        </a>
        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              // With no button, keep links visible on phones
              className={`${cta ? "hidden sm:inline " : ""}text-muted hover:text-ink transition-colors`}
            >
              {l.label}
            </a>
          ))}
          {cta && (
            <a
              href={cta.href}
              className="rounded-full bg-ink text-cream px-4 py-1.5 hover:bg-ink/85 transition-colors"
            >
              {cta.label}
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
