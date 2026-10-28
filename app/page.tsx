"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";
import JDGate, { type AnalysisResult } from "@/components/JDGate";

// Loaded after the page so three.js stays out of the initial bundle
const DataScene = dynamic(() => import("@/components/DataScene"), { ssr: false });

export default function Home() {
  const [matchResult, setMatchResult] = useState<AnalysisResult | null>(null);

  const isHighMatch =
    matchResult !== null && matchResult.score >= matchResult.threshold;

  return (
    <>
      <DataScene />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />

        {/* ── The gate ── */}
        <section id="book" className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="rounded-2xl bg-sand/80 backdrop-blur-[2px] p-6 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Are we a fit?
              </h2>
              <p className="font-serif text-lg leading-relaxed text-ink/85 mb-10">
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
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10">
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-muted">
          © {new Date().getFullYear()} Naoki Atkins
        </div>
      </footer>
    </>
  );
}

function BookingLink({ bookingUrl }: { bookingUrl: string | null }) {
  if (!bookingUrl) {
    return (
      <div className="mt-8 rounded-xl bg-cream/80 backdrop-blur-[2px] p-6 text-center text-sm text-muted">
        Set <code>NEXT_PUBLIC_CALENDLY_URL</code> in your env vars.
      </div>
    );
  }

  return (
    <div className="mt-8 animate-fade-up">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-full bg-ink text-cream text-center px-6 py-3.5 hover:bg-ink/85 transition-colors"
      >
        Book a call on Calendly →
      </a>
      <p className="mt-3 text-center text-sm text-muted">Opens in a new tab</p>
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
    <div className="mt-8 rounded-xl bg-cream/80 backdrop-blur-[2px] p-6 animate-fade-up">
      <p className="font-serif text-lg leading-relaxed text-ink/85">
        This role looks like a {score}% match — my calendar unlocks at{" "}
        {threshold}%. That said, feel free to reach out via the links above if
        you think the fit is there.
      </p>
    </div>
  );
}
