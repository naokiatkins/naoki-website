"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";
import JDGate, { type AnalysisResult } from "@/components/JDGate";

export default function Home() {
  const [matchResult, setMatchResult] = useState<AnalysisResult | null>(null);

  const isHighMatch =
    matchResult !== null && matchResult.score >= matchResult.threshold;

  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <WorkSection />

      {/* ── The gate ── */}
      <section id="book" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-4">
            Work with me
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-6 leading-tight">
            Are we a fit?
          </h2>
          <p className="text-muted leading-relaxed mb-12 max-w-lg">
            Upload your job description. I&apos;ll analyse it against my
            background and — if there&apos;s a strong match — unlock my
            calendar so we can talk.
          </p>

          <JDGate onResult={setMatchResult} result={matchResult} />

          {isHighMatch && <BookingLink bookingUrl={matchResult.bookingUrl} />}

          {matchResult && !isHighMatch && (
            <LowMatchMessage
              score={matchResult.score}
              threshold={matchResult.threshold}
            />
          )}
        </div>
      </section>

      <footer className="border-t border-ink/10 py-8 px-6 text-center">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Naoki Atkins
        </p>
      </footer>
    </main>
  );
}

function BookingLink({ bookingUrl }: { bookingUrl: string | null }) {
  if (!bookingUrl) {
    return (
      <div className="mt-10 p-6 border border-ink/10 rounded text-center text-muted font-mono text-sm">
        Set <code>NEXT_PUBLIC_CALENDLY_URL</code> in your env vars.
      </div>
    );
  }

  return (
    <div className="mt-10 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2 h-2 rounded-full bg-rust animate-pulse" />
        <p className="font-mono text-xs tracking-widest text-rust uppercase">
          Great match — book a call
        </p>
      </div>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-mono text-sm border border-ink px-6 py-3 hover:bg-ink hover:text-cream transition-colors duration-200"
      >
        Book a call on Calendly ↗
      </a>
      <p className="mt-3 font-mono text-xs text-muted">Opens in a new tab</p>
    </div>
  );
}

function LowMatchMessage({
  score,
  threshold,
}: {
  score: number;
  threshold: number;
}) {
  return (
    <div className="mt-8 p-6 border border-ink/10 rounded-sm animate-fade-up">
      <p className="font-mono text-xs tracking-widest text-muted uppercase mb-2">
        Match score: {score}/100
      </p>
      <p className="text-ink/70 leading-relaxed">
        This role looks like a {score}% match — my calendar unlocks at{" "}
        {threshold}%. That said, feel free to reach out via the links above if
        you think the fit is there.
      </p>
    </div>
  );
}
