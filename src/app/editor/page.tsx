"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import UploadZone from "@/components/UploadZone";
import CopyRewritePanel from "@/components/CopyRewritePanel";
import HistoryPanel from "@/components/HistoryPanel";
import { initSession, getUsage, submitEdit, getEditStatus, type EditStatus } from "@/lib/api";
import { addHistory } from "@/lib/history";

type EditMode = "enhance" | "remove-bg" | "restyle";

const MAX_FILE_SIZE_MB = 10;
const MAX_RESULTS = 3;

const MODES: { id: EditMode; icon: string; title: string; desc: string }[] = [
  {
    id: "enhance",
    icon: "colors_spark",
    title: "Auto Enhance",
    desc: "Improves lighting, color, and clarity automatically.",
  },
  {
    id: "remove-bg",
    icon: "auto_fix_high",
    title: "Background Remove",
    desc: "High-precision cutouts in milliseconds.",
  },
  {
    id: "restyle",
    icon: "palette",
    title: "Restyle",
    desc: "Transform into cinematic, anime, or 3D art styles.",
  },
];

// Error types for specific UI
type ErrorType = "format" | "size" | "network" | "rate_limit" | "server" | null;

function getErrorMessage(type: ErrorType): string | null {
  if (type === "format") return "Unsupported file type. Please use JPG, PNG, or WebP.";
  if (type === "size") return `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
  if (type === "network") return "Network error. Check your connection and try again.";
  if (type === "rate_limit") return "Daily limit reached. Upgrade to Pro for unlimited edits.";
  if (type === "server") return "Server error. Please try again in a few moments.";
  return null;
}

export default function EditorPage() {
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Edit state
  const [activeMode, setActiveMode] = useState<EditMode>("enhance");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]); // up to 3 URLs
  const [selectedResult, setSelectedResult] = useState<number>(0);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Usage state
  const [editsUsed, setEditsUsed] = useState<number | null>(null);
  const [editsLimit, setEditsLimit] = useState<number | null>(null);

  // Copy rewrite tab
  const [showCopyRewrite, setShowCopyRewrite] = useState(false);

  // History panel visibility
  const [historyOpen, setHistoryOpen] = useState(false);

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFileSelect = useCallback((file: File) => {
    setErrorType(null);
    setApiError(null);
    setResults([]);
    setSelectedResult(0);

    // Validate format
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorType("format");
      return;
    }
    // Validate size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorType("size");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  // ── Apply edit ──────────────────────────────────────────────────────────────
  const handleApply = async () => {
    if (!selectedFile) return;
    setErrorType(null);
    setApiError(null);
    setResults([]);
    setSelectedResult(0);
    setIsProcessing(true);

    try {
      await initSession();

      // Submit — will throw on HTTP error or server error
      const { task_id } = await submitEdit(activeMode, selectedFile);

      // Poll for result (max 60s)
      let lastStatus: EditStatus | null = null;
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          lastStatus = await getEditStatus(task_id);
        } catch {
          // poll error — keep retrying
          continue;
        }

        if (lastStatus.status === "done") {
          // Simulate 3 variants in demo (replace with real multi-output from API)
          const outUrl = lastStatus.output_url || previewUrl;
          setResults(outUrl ? [outUrl, outUrl, outUrl] : []);
          setSelectedResult(0);

          // Record usage
          try {
            const usage = await getUsage();
            setEditsUsed(usage.edits_used);
            setEditsLimit(usage.edits_limit);
          } catch { /* ignore */ }

          // Add to history
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

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults([]);
    setSelectedResult(0);
    setErrorType(null);
    setApiError(null);
  };

  // ── Download ────────────────────────────────────────────────────────────────
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
    <>
      {/* ── Header ── */}
      <header className="w-full top-0 sticky z-30 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 cursor-pointer active:opacity-70">
            <span className="material-symbols-outlined text-primary text-3xl">auto_fix_high</span>
            <span className="text-xl font-bold text-primary">RSP AI Editor</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Usage indicator */}
            {editsUsed !== null && editsLimit !== null && (
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base">bolt</span>
                <span>
                  {editsUsed}/{editsLimit} edits
                </span>
              </div>
            )}
            <Link
              href="/pricing"
              className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">

        {/* ── 1. Upload Zone ── */}
        {!selectedFile ? (
          <section className="mb-6">
            <UploadZone onFileSelect={handleFileSelect} />
          </section>
        ) : null}

        {/* ── 2. Error Banner ── */}
        {errorMsg ? (
          <section className="mb-4 p-4 bg-error-container rounded-xl border border-error/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-error shrink-0">error</span>
            <div className="flex-1">
              <p className="text-sm text-on-error-container font-medium">{errorMsg}</p>
              {errorType === "rate_limit" && (
                <Link href="/pricing" className="text-xs underline mt-1 inline-block text-on-error-container">
                  View Pro Plans →
                </Link>
              )}
            </div>
            <button onClick={() => { setErrorType(null); setApiError(null); }} className="shrink-0">
              <span className="material-symbols-outlined text-error text-lg">close</span>
            </button>
          </section>
        ) : null}

        {/* ── 3. Preview + Controls (shown when file selected) ── */}
        {selectedFile && (
          <>
            {/* Image Preview */}
            <section className="mb-5 rounded-xl overflow-hidden border border-outline-variant shadow-lg">
              <img
                className="w-full h-64 object-contain bg-surface-container"
                src={previewUrl || ""}
                alt="Preview"
              />
            </section>

            {/* Mode Tabs */}
            <section className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wider text-outline mb-2">Select Mode</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      activeMode === mode.id
                        ? "border-primary bg-primary-container/10 shadow-sm"
                        : "border-outline-variant hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>
                        {mode.icon}
                      </span>
                      <span className="text-sm font-semibold text-on-surface">{mode.title}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <section className="flex gap-3 mb-4">
              <button
                className="flex-1 bg-primary text-on-primary py-3 px-4 rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleApply}
                disabled={isProcessing || !!errorType}
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">bolt</span>
                    Apply {MODES.find((m) => m.id === activeMode)?.title}
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl font-medium border border-outline-variant text-sm hover:bg-surface-container transition-all"
              >
                Reset
              </button>
            </section>

            {/* Progress indicator while processing */}
            {isProcessing && (
              <div className="mb-4 p-3 bg-surface-container rounded-xl border border-outline-variant flex items-center gap-3">
                <span className="material-symbols-outlined text-primary animate-spin text-xl">progress_activity</span>
                <div>
                  <p className="text-sm font-medium text-on-surface">AI is editing your image</p>
                  <p className="text-xs text-on-surface-variant">Usually takes under 8 seconds</p>
                </div>
              </div>
            )}

            {/* ── 4. Result Panel (up to 3 variants) ── */}
            {!isProcessing && results.length > 0 && (
              <section className="mt-6 p-5 bg-surface-container rounded-xl border border-primary/20">
                <h3 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  Results — pick your favorite
                </h3>

                {/* Result thumbnails */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {results.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedResult(i)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedResult === i ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={`Result ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Selected result preview */}
                <div className="rounded-lg overflow-hidden border border-outline-variant mb-4 bg-surface-container-lowest">
                  <img
                    className="w-full h-52 object-contain"
                    src={results[selectedResult]}
                    alt={`Selected result ${selectedResult + 1}`}
                  />
                </div>

                {/* ── 5. Export Bar ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-primary text-on-primary py-3 px-4 rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    Download Result
                  </button>

                  {/* Try another mode */}
                  <button
                    onClick={() => { setResults([]); setSelectedResult(0); }}
                    className="px-4 py-3 rounded-xl font-medium border border-outline-variant text-sm hover:bg-surface-container transition-all"
                  >
                    Try Another Mode
                  </button>
                </div>

                {/* Export quality note */}
                <p className="mt-2 text-xs text-on-surface-variant text-center">
                  Free: standard quality ·{" "}
                  <Link href="/pricing" className="text-primary underline">
                    Upgrade to Pro
                  </Link>{" "}
                  for HD + no watermark
                </p>
              </section>
            )}
          </>
        )}

        {/* ── 6. Copy Rewrite Panel (toggle) ── */}
        {selectedFile && !isProcessing && (
          <div className="mt-4">
            <button
              onClick={() => setShowCopyRewrite(!showCopyRewrite)}
              className="w-full flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant hover:border-primary/50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Copy Rewrite</p>
                  <p className="text-xs text-on-surface-variant">Need text? Get 3 style variations</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${showCopyRewrite ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>

            {showCopyRewrite && (
              <div className="mt-2">
                <CopyRewritePanel />
              </div>
            )}
          </div>
        )}

        {/* ── 7. Sample + Placeholder (no file selected) ── */}
        {!selectedFile && (
          <section className="mt-6 py-8 text-center">
            <div className="rounded-xl overflow-hidden border border-outline-variant shadow-lg relative group max-w-sm mx-auto">
              <img
                className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5N7l4wiLX37OJYQoetHtkBY-YylRmXsUg4V7RfZvLgxUXPZ19sQ5_cjvVRKYX-0OnmmMkDRGzBqo3zKZi7vz_muakCIo4I4IAyWunF2dJ5y8n_LkDbp8sT_VRHCv4qsKTN3Cwmlh8A6lTzbDTvU7lpz3tk7M2as-w0AsNp4gk1eYp_VenHJtJ89qtE4ka5t3rBoiUnySeMo-x1O5D3jRt3u-TfzaJRSXDSgwZQvtjQDzHuTjFQIFkYcafTW3fUSm1zBTq103beqzq"
                alt="Sample workspace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">info</span>
                  AI-powered precision for every pixel
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-6 px-6 mt-auto bg-surface border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-semibold text-primary mb-1">RSP AI Editor</span>
            <p className="text-sm text-on-surface-variant">© 2024 RSP AI Editor. No signup required.</p>
          </div>
          <nav className="flex gap-4">
            <Link href="/terms" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy</Link>
          </nav>
        </div>
      </footer>

      {/* History Panel */}
      <HistoryPanel />
    </>
  );
}
