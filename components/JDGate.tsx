"use client";

import { useCallback, useRef, useState } from "react";

export interface AnalysisResult {
  score: number;
  threshold: number;
  summary: string;
  skills: string[];
  gaps: string[];
  bookingUrl: string | null;
}

interface Props {
  onResult: (result: AnalysisResult | null) => void;
  result: AnalysisResult | null;
}

type State = "idle" | "dragging" | "loading" | "error";

export default function JDGate({ onResult, result }: Props) {
  const [state, setState] = useState<State>("idle");
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const analyse = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setErrorMsg("Please upload a PDF file.");
        setState("error");
        return;
      }
      setFileName(file.name);
      setState("loading");
      setErrorMsg("");

      const form = new FormData();
      form.append("jd", file);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Unknown error");
        }
        onResult(data);
        setState("idle");
      } catch (e: unknown) {
        setErrorMsg(e instanceof Error ? e.message : "Analysis failed.");
        setState("error");
      }
    },
    [onResult]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) analyse(file);
    },
    [analyse]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState("dragging");
  };
  const onDragLeave = () => setState("idle");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyse(file);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (state === "loading") return <LoadingState />;

  if (result) {
    // Clearing the parent's result also hides the booking link / low-match message
    return (
      <ResultCard result={result} fileName={fileName} onReset={() => onResult(null)} />
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onClick={() => inputRef.current?.click()}
        className={`drop-zone rounded-sm p-12 text-center cursor-pointer select-none ${
          state === "dragging" ? "active" : ""
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onFileChange}
        />
        <div className="mb-4 text-3xl opacity-40">⬆</div>
        <p className="font-display text-xl text-ink mb-2">
          Drop your job description here
        </p>
        <p className="font-mono text-xs text-muted">
          PDF only · max 5 MB · analysed privately
        </p>
      </div>

      {state === "error" && (
        <p className="mt-4 font-mono text-xs text-rust">{errorMsg}</p>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="py-12 space-y-4 animate-fade-in">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">
        Reading your JD…
      </p>
      <div className="skeleton h-4 rounded w-3/4" />
      <div className="skeleton h-4 rounded w-1/2" />
      <div className="skeleton h-4 rounded w-2/3" />
      <p className="font-mono text-xs text-muted mt-6">
        This takes ~5 seconds
      </p>
    </div>
  );
}

function ResultCard({
  result,
  fileName,
  onReset,
}: {
  result: AnalysisResult;
  fileName: string;
  onReset: () => void;
}) {
  const { threshold } = result;
  const isMatch = result.score >= threshold;
  const scoreColor =
    result.score >= 80
      ? "text-green-700"
      : result.score >= threshold
      ? "text-rust"
      : "text-muted";

  return (
    <div className="animate-fade-up space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-1">
            Analysis complete
          </p>
          <p className="font-mono text-xs text-ink/50 truncate max-w-xs">
            {fileName}
          </p>
        </div>
        <button
          onClick={onReset}
          className="font-mono text-xs text-muted underline underline-offset-4 hover:text-ink transition-colors flex-shrink-0"
        >
          Try another
        </button>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <span className="font-display text-lg text-ink">Match score</span>
          <span className={`font-display text-4xl font-bold ${scoreColor}`}>
            {result.score}
            <span className="text-xl font-normal">/100</span>
          </span>
        </div>
        <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
          <div
            className="score-fill h-full bg-rust rounded-full"
            style={{ width: `${result.score}%` }}
          />
        </div>
        <p className="mt-1 font-mono text-xs text-muted">
          Calendar unlocks at {threshold}+
        </p>
      </div>

      {/* Summary */}
      <p className="text-ink/80 leading-relaxed">{result.summary}</p>

      {/* Skills matched */}
      {result.skills.length > 0 && (
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-3">
            Matched skills
          </p>
          <div className="flex flex-wrap gap-2">
            {result.skills.map((s) => (
              <span
                key={s}
                className="font-mono text-xs px-3 py-1 border border-ink/15 rounded-full text-ink/70"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gaps */}
      {result.gaps.length > 0 && !isMatch && (
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-3">
            Potential gaps
          </p>
          <ul className="space-y-1">
            {result.gaps.map((g) => (
              <li key={g} className="font-mono text-xs text-muted flex gap-2">
                <span>—</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
