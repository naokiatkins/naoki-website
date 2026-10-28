export default function HeroSection() {
  return (
    <section className="flex flex-col justify-start pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 right-12 bottom-0 w-px bg-ink/6 hidden md:block" />

      <div className="max-w-4xl">
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-8">
            Available for new opportunities
          </p>
        </div>

        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          <h1 className="font-display text-6xl md:text-8xl text-ink leading-[1.05] mb-6">
            Naoki Atkins.
            <br />
            <em className="text-rust">Data Engineer</em>
          </h1>
        </div>

        <div
          className="animate-fade-up flex flex-col sm:flex-row gap-6 items-start sm:items-center"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          <a
            href="#book"
            className="font-mono text-sm border border-ink px-6 py-3 hover:bg-ink hover:text-cream transition-colors duration-200"
          >
            Check if we match →
          </a>
          <div className="flex gap-6 font-mono text-xs text-muted">
            <a
              href="https://github.com/naokiatkins"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/naoki-atkins/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:you@example.com"
              className="hover:text-ink transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-6 font-mono text-xs text-muted rotate-90 tracking-widest hidden md:block">
        scroll
      </div>
    </section>
  );
}
