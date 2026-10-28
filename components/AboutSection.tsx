export default function AboutSection() {
  const stats = [
    { value: "5", label: "Years exp." },
    { value: "30+", label: "Reports maintained" },
    { value: "5+", label: "Data pipelines built" },
    { value: "2", label: "Languages; English and Japanese" },
  ];

  return (
    <section className="py-24 px-6 border-t border-ink/10">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-6">
            About
          </p>
          <p className="font-display text-2xl md:text-3xl text-ink leading-snug mb-6">
            I create trustworthy data in the backend, and intuitive reports in the frontend. 
          </p>
          <p className="text-muted leading-relaxed mb-4">
            Five years in, I&apos;ve worked with the titles of business intelligence developer, 
            to data engineer - and I am always striving to learn more and level up.
          </p>
          <p className="text-muted leading-relaxed">
            My stack centres on Python, SQL, and Power BI. I care equally
            about code quality and the humans who use what I ship.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 content-start">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl text-ink mb-1">{s.value}</p>
              <p className="font-mono text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
