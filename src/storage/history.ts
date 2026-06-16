import type { HistoryEntry } from "../types";

const KEY = "bibletype.history";
const LIMIT = 200;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveResult(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...loadHistory()].slice(0, LIMIT);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota / unavailable storage
  }
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function bestWpm(history: HistoryEntry[]): number {
  return history.reduce((best, e) => Math.max(best, e.wpm), 0);
}
