"use client";

import { useState } from "react";
import { rewriteCopy } from "@/lib/api";

const COPY_STYLES = [
  {
    id: "clean" as const,
    label: "Clean",
    desc: "Clear, professional tone",
    icon: "format_align_left",
  },
  {
    id: "persuasive" as const,
    label: "Persuasive",
    desc: "Compelling, action-oriented",
    icon: "campaign",
  },
  {
    id: "concise" as const,
    label: "Concise",
    desc: "Short, punchy copy",
    icon: "content_cut",
  },
];

export default function CopyRewritePanel() {
  const [inputText, setInputText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<"clean" | "persuasive" | "concise">("clean");
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await rewriteCopy(inputText, selectedStyle);
      setResults(data.versions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rewrite failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
        <div>
          <h3 className="text-lg font-semibold text-on-surface">Copy Rewrite</h3>
          <p className="text-sm text-on-surface-variant">Input original text, get 3 style variations</p>
        </div>
      </div>

      {/* Text Input */}
      <textarea
        className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm resize-none focus:outline-none focus:border-primary transition-colors"
        rows={3}
        placeholder="Paste your original text here (e.g. product title, description, tagline)..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* Style Selector */}
      <div className="flex gap-2 mt-3">
        {COPY_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`flex-1 p-3 rounded-lg border text-left transition-all ${
              selectedStyle === style.id
                ? "border-primary bg-primary-container/10 text-primary"
                : "border-outline-variant hover:border-primary/50 text-on-surface-variant"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-lg">{style.icon}</span>
              <span className="text-sm font-medium">{style.label}</span>
            </div>
            <p className="text-xs opacity-70">{style.desc}</p>
          </button>
        ))}
      </div>

      {/* Rewrite Button */}
      <button
        onClick={handleRewrite}
        disabled={!inputText.trim() || isLoading}
        className="w-full mt-3 py-2.5 px-4 rounded-lg bg-primary text-on-primary font-medium text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-lg">sync</span>
            Generating...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            Rewrite with AI
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-on-surface-variant">3 Style Variations:</p>
          {results.map((text, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant group"
            >
              <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-on-surface flex-1 leading-relaxed">{text}</p>
              <button
                onClick={() => copyToClipboard(text, i)}
                className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-primary/10 transition-all"
                title="Copy"
              >
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  {copiedIndex === i ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}