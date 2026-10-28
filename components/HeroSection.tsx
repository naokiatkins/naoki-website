const links = [
  { label: "GitHub", href: "https://github.com/naokiatkins" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/naoki-atkins/" },
  { label: "Email", href: "mailto:hello@naokiatkins.com" },
];

export default function HeroSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 motion-safe:animate-fade-up">
      <h1 className="text-3xl md:text-5xl leading-tight md:leading-[1.15] tracking-tight max-w-4xl">
        <span className="font-semibold">Naoki Atkins, data engineer.</span>{" "}
        <span className="font-serif">
          I create trustworthy data in the backend, and intuitive reports in
          the frontend.
        </span>
      </h1>

      <div className="mt-10 flex flex-col sm:flex-row gap-6 sm:items-center">
        <a
          href="#book"
          className="self-start rounded-full bg-ink text-cream px-6 py-3 hover:bg-ink/85 transition-colors"
        >
          Check if we match →
        </a>
        <div className="flex gap-6 text-sm text-muted">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
              className="hover:text-ink transition-colors"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
