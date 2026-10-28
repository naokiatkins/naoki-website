const stats = [
  { label: "Experience", value: "5 years" },
  { label: "Reports maintained", value: "30+" },
  { label: "Data pipelines built", value: "5+" },
  { label: "Languages", value: "English, Japanese" },
];

export default function AboutSection() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-[1fr_380px] gap-10 md:gap-16">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">About</h2>
          <div className="font-serif text-lg leading-relaxed text-ink/85 space-y-4">
            <p>
              Five years in, I&apos;ve worked with the titles of business
              intelligence developer, to data engineer - and I am always
              striving to learn more and level up.
            </p>
            <p>
              My stack centres on Python, SQL, and Power BI. I care equally
              about code quality and the humans who use what I ship.
            </p>
          </div>
        </div>

        <dl className="self-start rounded-2xl bg-sand px-6 py-2 text-sm">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex justify-between gap-4 py-4 border-b border-ink/10 last:border-0"
            >
              <dt className="text-muted">{s.label}</dt>
              <dd className="font-medium text-right">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
