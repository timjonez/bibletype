export interface Bible {
  translation: string;
  books: Book[];
}

export interface Book {
  name: string;
  chapters: string[][];
}

export interface Passage {
  text: string;
  reference: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
}

export type CharState = "correct" | "incorrect" | "untyped";

export interface CharCell {
  char: string;
  state: CharState;
}

export interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  seconds: number;
  correct: number;
  incorrect: number;
  typed: number;
}

export interface HistoryEntry extends TestStats {
  reference: string;
  length: number;
  date: number;
}

export type Theme = "dark" | "light";
export type SourceMode = "random" | "picker";
