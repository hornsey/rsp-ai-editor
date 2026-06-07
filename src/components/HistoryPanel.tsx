"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "rsp_editor_history";

export interface HistoryItem {
  id: string;
  timestamp: number;
  mode: string;
  thumbnail: string; // base64 or URL
  outputUrl: string | null;
}

function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  // Keep last 10 items
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(-10)));
}

export default function HistoryPanel() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const addToHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    };
    const updated = [...history, newItem];
    setHistory(updated);
    saveHistory(updated);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const modeLabel: Record<string, string> = {
    enhance: "Auto Enhance",
    "remove-bg": "Remove BG",
    restyle: "Restyle",
  };

  // Expose addToHistory globally so editor page can call it
  useEffect(() => {
    (window as unknown as { __rspAddHistory: typeof addToHistory }).__rspAddHistory = addToHistory;
  }, [history]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-20 z-40 flex items-center gap-2 px-3 py-2 bg-surface border border-outline-variant rounded-lg shadow-md hover:border-primary transition-all text-sm"
      >
        <span className="material-symbols-outlined text-lg">history</span>
        <span className="text-on-surface-variant font-medium">History</span>
        {history.length > 0 && (
          <span className="bg-primary text-on-primary text-xs px-1.5 py-0.5 rounded-full">
            {history.length}
          </span>
        )}
      </button>

      {/* Slide-in Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-surface border-l border-outline-variant shadow-xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <h3 className="font-semibold text-on-surface">Session History</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-surface-container rounded">
            <span className="material-symbols-outlined text-xl text-on-surface-variant">close</span>
          </button>
        </div>

        {/* History List */}
        <div className="overflow-y-auto h-[calc(100%-130px)] p-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-8">
              No edits yet this session.
            </p>
          ) : (
            history
              .slice()
              .reverse()
              .map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                  onClick={() => {
                    if (item.outputUrl) {
                      window.open(item.outputUrl, "_blank");
                    }
                  }}
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0">
                    <img
                      src={item.thumbnail}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {modeLabel[item.mode] || item.mode}
                    </p>
                    <p className="text-xs text-on-surface-variant">{formatTime(item.timestamp)}</p>
                  </div>
                  {item.outputUrl && (
                    <span className="material-symbols-outlined text-sm text-primary self-center">open_in_new</span>
                  )}
                </div>
              ))
          )}
        </div>

        {/* Clear */}
        {history.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-variant">
            <button
              onClick={clearHistory}
              className="w-full py-2 text-sm text-error hover:bg-error-container rounded-lg transition-colors"
            >
              Clear History
            </button>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// addToHistory is called via window.__rspAddHistory set in HistoryPanel.tsx
// The editor page uses addHistory from @/lib/history directly