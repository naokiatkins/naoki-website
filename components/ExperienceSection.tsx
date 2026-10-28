const roles = [
  {
    title: "Data Engineer",
    company: "Advantest",
    location: "Marunouchi, Tokyo",
    dates: "Apr 2025 – Present",
  },
  {
    title: "Senior Business Intelligence Developer",
    company: "Omega Accounting Solutions",
    location: "Irvine, CA",
    dates: "Aug 2024 – Mar 2025",
  },
  {
    title: "Business Intelligence Developer",
    company: "Omega Accounting Solutions",
    location: "Irvine, CA",
    dates: "Jan 2023 – Aug 2024",
  },
  {
    title: "Data Analyst",
    company: "Centers for Disease Control and Prevention",
    location: "Remote",
    dates: "Aug 2021 – Dec 2022",
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold tracking-tight mb-8">Experience</h2>

      <ol className="rounded-2xl bg-sand/80 backdrop-blur-[2px] px-6 py-2">
        {roles.map((r) => (
          <li
            key={r.title + r.dates}
            className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-5 border-b border-ink/10 last:border-0"
          >
            <p>
              <span className="font-medium">{r.title}</span>
              <span className="text-muted"> · {r.company} · {r.location}</span>
            </p>
            <p className="text-sm text-muted sm:text-right shrink-0">{r.dates}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
