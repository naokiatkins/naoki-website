const certifications = [
  {
    name: "JLPT N1",
    issuer: "Japanese Foundation",
    dates: "Jan 2025",
  },
  {
    name: "DP-600: Fabric Analytics Engineer Associate",
    issuer: "Microsoft",
    dates: "Sep 2024",
  },
  {
    name: "AZ-900: Azure Fundamentals",
    issuer: "Microsoft",
    dates: "Sep 2024",
  },
  {
    name: "PL-300: Power BI Data Analyst",
    issuer: "Microsoft",
    dates: "Jul 2022",
  },
  {
    name: "Data Analytics Certificate",
    issuer: "Google",
    dates: "Apr 2021",
  },
];

export default function CertificationsSection() {
  return (
    <section id="certificates" className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold tracking-tight mb-8">Certificates</h2>

      <ul className="rounded-2xl bg-sand/80 backdrop-blur-[2px] px-6 py-2">
        {certifications.map((c) => (
          <li
            key={c.name}
            className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-5 border-b border-ink/10 last:border-0"
          >
            <p>
              <span className="font-medium">{c.name}</span>
              <span className="text-muted"> · {c.issuer}</span>
            </p>
            <p className="text-sm text-muted sm:text-right shrink-0">{c.dates}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
