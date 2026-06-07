"use client";

import { useState } from "react";
import Link from "next/link";
import UploadZone from "@/components/UploadZone";
import { initSession, getUsage, submitEdit, getEditStatus } from "@/lib/api";

type EditMode = "enhance" | "remove-bg" | "restyle";

export default function EditorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<EditMode>("enhance");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modes: { id: EditMode; icon: string; title: string; desc: string }[] = [
    {
      id: "enhance",
      icon: "colors_spark",
      title: "Auto Enhance",
      desc: "Auto-improves photo quality, lighting, and colors using neural networks.",
    },
    {
      id: "remove-bg",
      icon: "auto_fix_high",
      title: "Background Remove",
      desc: "Removes background with one click using high-precision segmentation.",
    },
    {
      id: "restyle",
      icon: "palette",
      title: "Restyle",
      desc: "Applies artistic style transformations and texture mapping to your photo.",
    },
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowResult(false);
  };

  const handleApply = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Ensure session exists
      await initSession();

      // Submit edit task
      const { task_id } = await submitEdit(activeMode, selectedFile);

      // Poll for result (max 60s)
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const status = await getEditStatus(task_id);

        if (status.status === "done") {
          setOutputUrl(status.output_url || null);
          setShowResult(true);
          setIsProcessing(false);
          return;
        }
        if (status.status === "failed") {
          setError(status.error || "Processing failed");
          setIsProcessing(false);
          return;
        }
      }
      setError("Processing timed out");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowResult(false);
  };

  return (
    <>
      {/* Header */}
      <header className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 cursor-pointer active:opacity-70">
            <span className="material-symbols-outlined text-primary text-3xl">auto_fix_high</span>
            <span className="text-xl font-bold text-primary">RSP AI Editor</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full">
        {/* Upload Zone */}
        <section className="mb-6">
          <UploadZone onFileSelect={handleFileSelect} />
        </section>

        {/* Preview & Editor Modes */}
        {selectedFile && (
          <>
            {/* Image Preview */}
            <section className="mb-6 rounded-xl overflow-hidden border border-outline-variant shadow-lg">
              <img
                className="w-full h-64 object-cover"
                src={previewUrl || ""}
                alt="Preview"
              />
            </section>

            {/* Editor Modes */}
            <section className="space-y-3">
              <h2 className="text-sm font-medium uppercase tracking-wider text-outline mb-3">Editing Modes</h2>
              
              {modes.map((mode) => (
                <div
                  key={mode.id}
                  className={`glass-card border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                    activeMode === mode.id ? "border-primary shadow-md" : "border-outline-variant hover:shadow-md"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className="bg-primary-container/10 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>
                        {mode.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-on-surface">{mode.title}</h3>
                      <p className="text-sm text-on-surface-variant">{mode.desc}</p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeMode === mode.id
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
                      }`}
                      onClick={() => setActiveMode(mode.id)}
                    >
                      {activeMode === mode.id ? "Selected" : "Select"}
                    </button>
                    </div>
                  </div>
                ))}
              </section>

            {/* Action Buttons */}
            <section className="mt-6 flex gap-3">
              <button
                className="flex-1 bg-primary text-on-primary py-3 px-6 rounded-xl font-medium hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleApply}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">bolt</span>
                    Apply {modes.find((m) => m.id === activeMode)?.title}
                  </>
                )}
              </button>
              
              {showResult && (
                <button
                  className="px-6 py-3 rounded-xl font-medium border border-outline-variant hover:bg-surface-container transition-all"
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </section>

            {/* Error */}
            {error && (
              <section className="mt-4 p-4 bg-error-container rounded-xl border border-error/30">
                <p className="text-sm text-on-error-container">{error}</p>
              </section>
            )}

            {/* Result Section */}
            {showResult && (
              <section className="mt-8 p-6 bg-surface-container rounded-xl border border-primary/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  Result Ready
                </h3>
                <div className="rounded-lg overflow-hidden border border-outline-variant mb-4">
                  <img
                    className="w-full h-48 object-cover"
                    src={outputUrl || previewUrl || ""}
                    alt="Result"
                  />
                </div>
                <div className="flex gap-3">
                  <a
                    href={outputUrl || "#"}
                    download
                    className="flex-1 bg-primary text-on-primary py-3 px-6 rounded-xl font-medium text-center hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Download Result
                  </a>
                  <button
                    className="px-6 py-3 rounded-xl font-medium bg-surface-container hover:bg-surface-container-high transition-all"
                    onClick={() => setShowResult(false)}
                  >
                    Try Another Mode
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* Sample Image (shown when no file selected) */}
        {!selectedFile && (
          <section className="mt-8 py-8">
            <div className="rounded-xl overflow-hidden border border-outline-variant shadow-lg relative group">
              <img
                className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5N7l4wiLX37OJYQoetHtkBY-YylRmXsUg4V7RfZvLgxUXPZ19sQ5_cjvVRKYX-0OnmmMkDRGzBqo3zKZi7vz_muakCIo4I4IAyWunF2dJ5y8n_LkDbp8sT_VRHCv4qsKTN3Cwmlh8A6lTzbDTvU7lpz3tk7M2as-w0AsNp4gk1eYp_VenHJtJ89qtE4ka5t3rBoiUnySeMo-x1O5D3jRt3u-TfzaJRSXDSgwZQvtjQDzHuTjFQIFkYcafTW3fUSm1zBTq103beqzq"
                alt="Sample workspace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">info</span>
                  AI-powered precision for every pixel.
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
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
    </>
  );
}
