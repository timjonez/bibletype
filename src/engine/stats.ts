import type { TestStats } from "../types";

export interface StatsInput {
  /** Characters currently matching the target. */
  correct: number;
  /** Number of positions the user has filled in (cursor index). */
  total: number;
  /** Cumulative printable keypresses (excludes backspace). */
  typed: number;
  /** Cumulative keypresses that were wrong at the moment they were pressed. */
  errors: number;
  /** Elapsed time in milliseconds. */
  ms: number;
}

// Standard typing metrics: a "word" is 5 characters. WPM rewards correct
// characters in the final text; raw WPM counts everything typed. Accuracy is
// based on keypresses, so fixing a mistake still costs you.
export function computeStats(i: StatsInput): TestStats {
  const minutes = i.ms / 60000;
  return {
    wpm: minutes > 0 ? Math.round(i.correct / 5 / minutes) : 0,
    rawWpm: minutes > 0 ? Math.round(i.typed / 5 / minutes) : 0,
    accuracy: i.typed > 0 ? Math.round(((i.typed - i.errors) / i.typed) * 100) : 100,
    seconds: i.ms / 1000,
    correct: i.correct,
    incorrect: i.total - i.correct,
    typed: i.typed,
  };
}
