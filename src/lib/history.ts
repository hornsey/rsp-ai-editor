// Session history management (localStorage-based, no account required)

const STORAGE_KEY = "rsp_editor_history";

export interface HistoryItem {
  id: string;
  timestamp: number;
  mode: string;
  thumbnail: string;
  outputUrl: string | null;
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistory(item: Omit<HistoryItem, "id" | "timestamp">): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).slice(2),
    timestamp: Date.now(),
  };
  const existing = getHistory();
  const updated = [...existing, newItem].slice(-10); // keep last 10
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newItem;
}

export function clearHistory(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}