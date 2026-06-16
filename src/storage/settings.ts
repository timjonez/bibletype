import type { SourceMode, Theme } from "../types";

export interface Settings {
  theme: Theme;
  length: number;
  source: SourceMode;
  book: string;
  chapter: number;
}

const KEY = "bibletype.settings";

export const LENGTH_OPTIONS = [1, 2, 3, 5, 8] as const;

const DEFAULTS: Settings = {
  theme: "dark",
  length: 3,
  source: "random",
  book: "John",
  chapter: 3,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

// Applies the theme to <html> so CSS variables switch globally.
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}
