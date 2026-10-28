export default function Footer({ links }: { links: { label: string; href: string }[] }) {
  return (
    <footer className="border-t border-ink/10">
      <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-muted flex flex-wrap justify-between gap-4">
        <span>© {new Date().getFullYear()} Naoki Atkins</span>
        <nav className="flex gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
