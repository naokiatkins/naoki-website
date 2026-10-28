export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-ink/10">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-semibold tracking-tight">
          Naoki Atkins
        </a>
        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          <a href="#about" className="hidden sm:inline text-muted hover:text-ink transition-colors">
            About
          </a>
          <a href="#experience" className="hidden sm:inline text-muted hover:text-ink transition-colors">
            Experience
          </a>
          <a href="#work" className="hidden sm:inline text-muted hover:text-ink transition-colors">
            Work
          </a>
          <a
            href="#book"
            className="rounded-full bg-ink text-cream px-4 py-1.5 hover:bg-ink/85 transition-colors"
          >
            Check fit →
          </a>
        </div>
      </nav>
    </header>
  );
}
