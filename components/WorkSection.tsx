const projects = [
  {
    year: "2024",
    title: "Web App for ERC Tax Credit Calculation",
    role: "Lead Engineer",
    description:
      "Designed and implemented a web application to calculate ERC tax credits for small businesses. Built the backend API, data processing pipeline, and frontend interface.",
    tags: ["Python", "Flask", "Azure Blob Storage", "Azure SQL", "GitHub Actions"],
  },
];

export default function WorkSection() {
  return (
    <section id="work" className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold tracking-tight mb-8">Selected work</h2>

      <div className="space-y-6">
        {projects.map((p) => (
          <article key={p.title} className="rounded-2xl bg-sand/80 backdrop-blur-[2px] p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
              <span className="rounded-full bg-cream px-3 py-0.5">{p.year}</span>
              <span>{p.role}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
              {p.title}
            </h3>
            <p className="font-serif text-lg leading-relaxed text-ink/85 max-w-3xl mb-6">
              {p.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-cream px-3 py-1 text-xs text-ink/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
