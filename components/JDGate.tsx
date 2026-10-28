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
        className={`drop-zone rounded-xl px-6 py-12 text-center cursor-pointer select-none ${
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
        <div className="mb-3 text-2xl text-muted" aria-hidden>⬆</div>
        <p className="text-lg font-medium mb-1">Drop your job description here</p>
        <p className="text-sm text-muted">
          or click to browse · PDF only · max 5 MB · analysed privately
        </p>
      </div>

      {state === "error" && (
        <p className="mt-4 text-sm text-rust">{errorMsg}</p>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl bg-cream/80 backdrop-blur-[2px] p-6 space-y-4 animate-fade-in">
      <p className="text-sm font-medium">Reading your JD…</p>
      <div className="skeleton h-4 rounded-full w-3/4" />
      <div className="skeleton h-4 rounded-full w-1/2" />
      <div className="skeleton h-4 rounded-full w-2/3" />
      <p className="text-sm text-muted pt-2">This takes ~5 seconds</p>
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
    <div className="rounded-xl bg-cream/80 backdrop-blur-[2px] p-6 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">Analysis complete</p>
          <p className="text-sm text-muted truncate">{fileName}</p>
        </div>
        <button
          onClick={onReset}
          className="flex-shrink-0 rounded-full bg-sand px-4 py-1.5 text-sm hover:bg-ink/10 transition-colors"
        >
          Try another
        </button>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <span className="font-medium">Match score</span>
          <span className={`text-4xl font-semibold tracking-tight ${scoreColor}`}>
            {result.score}
            <span className="text-xl font-normal text-muted">/100</span>
          </span>
        </div>
        <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
          <div
            className="score-fill h-full bg-rust rounded-full"
            style={{ width: `${result.score}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-muted">Calendar unlocks at {threshold}+</p>
      </div>

      {/* Summary */}
      <p className="font-serif text-lg leading-relaxed text-ink/85">{result.summary}</p>

      {/* Skills matched */}
      {result.skills.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Matched skills</p>
          <div className="flex flex-wrap gap-2">
            {result.skills.map((s) => (
              <span key={s} className="rounded-full bg-sand px-3 py-1 text-xs text-ink/70">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gaps */}
      {result.gaps.length > 0 && !isMatch && (
        <div>
          <p className="text-sm font-medium mb-3">Potential gaps</p>
          <ul className="text-sm text-muted divide-y divide-ink/10">
            {result.gaps.map((g) => (
              <li key={g} className="py-2">
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
