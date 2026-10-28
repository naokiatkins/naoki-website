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
    <section className="py-24 px-6 border-t border-ink/10 bg-ink/[0.02]">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs tracking-widest text-muted uppercase mb-12">
          Selected work
        </p>

        <div className="space-y-0 divide-y divide-ink/10">
          {projects.map((p) => (
            <div
              key={p.title}
              className="py-10 grid md:grid-cols-[120px_1fr] gap-4 md:gap-10 group"
            >
              <div className="font-mono text-xs text-muted pt-1">{p.year}</div>
              <div>
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h3 className="font-display text-xl text-ink">{p.title}</h3>
                  <span className="font-mono text-xs text-muted">{p.role}</span>
                </div>
                <p className="text-muted leading-relaxed mb-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2.5 py-0.5 border border-ink/10 text-ink/50 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
