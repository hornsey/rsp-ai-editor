"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import UploadZone from "@/components/UploadZone";
import CopyRewritePanel from "@/components/CopyRewritePanel";
import HistoryPanel from "@/components/HistoryPanel";
import { initSession, getUsage, submitEdit, getEditStatus, type EditStatus } from "@/lib/api";
import { addHistory } from "@/lib/history";

type EditMode = "enhance" | "remove-bg" | "restyle";
type ErrorType = "format" | "size" | "network" | "rate_limit" | "server" | null;

const MAX_FILE_SIZE_MB = 10;

const MODES: { id: EditMode; icon: string; title: string; desc: string }[] = [
  {
    id: "enhance",
    icon: "colors_spark",
    title: "Auto Enhance",
    desc: "Improve lighting, color, and clarity automatically.",
  },
  {
    id: "remove-bg",
    icon: "auto_fix_high",
    title: "Background Remove",
    desc: "Create a cleaner cutout for product or profile images.",
  },
  {
    id: "restyle",
    icon: "palette",
    title: "Style Restyle",
    desc: "Generate a new visual direction from the same image.",
  },
];

function getErrorMessage(type: ErrorType): string | null {
  if (type === "format") return "Unsupported file type. Please use JPG, PNG, or WebP.";
  if (type === "size") return `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
  if (type === "network") return "Network error. Check your connection and try again.";
  if (type === "rate_limit") return "Daily limit reached. Upgrade to Pro for higher monthly limits.";
  if (type === "server") return "Server error. Please try again in a few moments.";
  return null;
}

export default function EditorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<EditMode>("enhance");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState(0);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [editsUsed, setEditsUsed] = useState<number | null>(null);
  const [editsLimit, setEditsLimit] = useState<number | null>(null);
  const [showCopyRewrite, setShowCopyRewrite] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setErrorType(null);
    setApiError(null);
    setResults([]);
    setSelectedResult(0);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorType("format");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorType("size");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleApply = async () => {
    if (!selectedFile) return;

    setErrorType(null);
    setApiError(null);
    setResults([]);
    setSelectedResult(0);
    setIsProcessing(true);

    try {
      await initSession();
      const { task_id } = await submitEdit(activeMode, selectedFile);
      let lastStatus: EditStatus | null = null;

      for (let i = 0; i < 30; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          lastStatus = await getEditStatus(task_id);
        } catch {
          continue;
        }

        if (lastStatus.status === "done") {
          const outUrl = lastStatus.output_url || previewUrl;
          setResults(outUrl ? [outUrl, outUrl, outUrl] : []);
          setSelectedResult(0);

          try {
            const usage = await getUsage();
            setEditsUsed(usage.edits_used);
            setEditsLimit(usage.edits_limit);
          } catch {
            // Usage is helpful but not required for a completed edit.
          }

          if (outUrl) {
            addHistory({ mode: activeMode, thumbnail: previewUrl || outUrl, outputUrl: outUrl });
          }

          setIsProcessing(false);
          return;
        }

        if (lastStatus.status === "failed") {
          const msg = (lastStatus.error || "").toLowerCase();
          if (msg.includes("rate") || msg.includes("limit")) {
            setErrorType("rate_limit");
          } else if (msg.includes("format")) {
            setErrorType("format");
          } else {
            setErrorType("server");
          }
          setIsProcessing(false);
          return;
        }
      }

      setApiError("Processing timed out. Please try again.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("network") || msg.includes("fetch")) {
        setErrorType("network");
      } else if (msg.toLowerCase().includes("rate") || msg.includes("429")) {
        setErrorType("rate_limit");
      } else {
        setApiError(msg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults([]);
    setSelectedResult(0);
    setErrorType(null);
    setApiError(null);
  };

  const handleDownload = () => {
    const url = results[selectedResult] || previewUrl;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsp-${activeMode}-${Date.now()}.png`;
    a.click();
  };

  const errorMsg = getErrorMessage(errorType) || apiError;

  return (
    <main className="app-shell py-8">
      <section className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="eyebrow mb-3">AI Editor (No Signup)</p>
          <h1 className="text-4xl font-extrabold md:text-5xl">Upload, choose a task, export.</h1>
          <p className="mt-4 leading-7 text-on-surface-variant">
            Start with a JPG, PNG, or WebP image up to 10MB. Free usage is limited, with Pro available for higher volume and HD exports.
          </p>
        </div>
        <div className="soft-card flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="text-sm font-bold">Free limits</p>
            <p className="text-sm text-on-surface-variant">5 image edits/day · 10 copy rewrites/day</p>
          </div>
          {editsUsed !== null && editsLimit !== null ? (
            <span className="rounded-full bg-primary-container px-3 py-1 text-sm font-bold text-on-primary-container">
              {editsUsed}/{editsLimit} edits used
            </span>
          ) : (
            <Link href="/pricing" className="text-sm font-bold text-primary hover:underline">
              View Pro limits
            </Link>
          )}
        </div>
      </section>

      {errorMsg ? (
        <section className="mb-5 flex items-start gap-3 rounded-xl border border-error/30 bg-error-container p-4">
          <span className="material-symbols-outlined shrink-0 text-error">error</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-on-surface">{errorMsg}</p>
            {errorType === "rate_limit" ? (
              <Link href="/pricing" className="mt-1 inline-block text-xs font-bold text-error underline">
                Compare plans
              </Link>
            ) : null}
          </div>
          <button onClick={() => { setErrorType(null); setApiError(null); }} className="shrink-0" aria-label="Dismiss error">
            <span className="material-symbols-outlined text-lg text-error">close</span>
          </button>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          {!selectedFile ? (
            <UploadZone onFileSelect={handleFileSelect} />
          ) : (
            <div className="panel-card overflow-hidden">
              <div className="border-b border-outline-variant p-4">
                <p className="text-sm font-bold">Selected image</p>
                <p className="text-xs text-on-surface-variant">{selectedFile.name}</p>
              </div>
              <div className="bg-surface-muted p-4">
                <img className="h-72 w-full rounded-xl object-contain" src={previewUrl || ""} alt="Selected upload preview" />
              </div>
              <div className="flex gap-3 p-4">
                <button onClick={handleReset} className="secondary-button flex-1 py-2 text-sm">
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  disabled={isProcessing || !!errorType}
                  className="primary-button flex-1 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                      Processing
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">bolt</span>
                      Apply
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowCopyRewrite((show) => !show)}
            className="soft-card flex w-full items-center justify-between p-4 text-left hover:border-primary"
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              <span>
                <span className="block text-sm font-extrabold">Copy Rewrite</span>
                <span className="block text-xs text-on-surface-variant">Generate clean, persuasive, or concise copy variants.</span>
              </span>
            </span>
            <span className={`material-symbols-outlined transition ${showCopyRewrite ? "rotate-180" : ""}`}>expand_more</span>
          </button>
          {showCopyRewrite ? <CopyRewritePanel /> : null}
        </div>

        <div className="space-y-5">
          <div className="panel-card p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant">Editing Modes</p>
            <div className="grid gap-3">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    activeMode === mode.id
                      ? "border-primary bg-primary-container text-on-primary-container"
                      : "border-outline-variant bg-surface hover:border-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">{mode.icon}</span>
                    <div>
                      <p className="font-extrabold">{mode.title}</p>
                      <p className="mt-1 text-sm leading-6 text-on-surface-variant">{mode.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {isProcessing ? (
            <div className="soft-card flex items-center gap-3 p-4">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              <div>
                <p className="text-sm font-bold">AI is editing your image</p>
                <p className="text-xs text-on-surface-variant">Most edits target an under-8-second response, but provider latency can vary.</p>
              </div>
            </div>
          ) : null}

          {results.length > 0 ? (
            <section className="panel-card p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold">Results</h2>
                  <p className="text-sm text-on-surface-variant">Pick a result, then export standard quality.</p>
                </div>
                <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
                  {results.length} variants
                </span>
              </div>

              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {results.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    onClick={() => setSelectedResult(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                      selectedResult === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Result ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="mb-4 overflow-hidden rounded-xl border border-outline-variant bg-surface-muted">
                <img className="h-72 w-full object-contain" src={results[selectedResult]} alt={`Selected result ${selectedResult + 1}`} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={handleDownload} className="primary-button flex-1">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Download Result
                </button>
                <button onClick={() => { setResults([]); setSelectedResult(0); }} className="secondary-button">
                  Try Another Mode
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-on-surface-variant">
                Free: standard quality, watermark may apply.{" "}
                <Link href="/pricing" className="font-bold text-primary underline">
                  Upgrade for HD + no watermark
                </Link>
              </p>
            </section>
          ) : (
            <div className="soft-card p-6">
              <h2 className="text-xl font-extrabold">Result panel</h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Upload an image and apply a mode to see result variants, export actions, and upgrade messaging here.
              </p>
            </div>
          )}
        </div>
      </section>

      <HistoryPanel />
    </main>
  );
}
