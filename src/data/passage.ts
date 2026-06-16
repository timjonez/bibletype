import type { Bible, Book, Passage } from "../types";

export interface PassageRequest {
  length: number;
  /** Optional book name; random book when omitted. */
  book?: string;
  /** 1-based chapter; random chapter when omitted. */
  chapter?: number;
  /** 1-based start verse; random valid start when omitted. */
  startVerse?: number;
}

const randInt = (n: number) => Math.floor(Math.random() * n);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// Builds a passage of up to `length` consecutive verses. When the chosen
// chapter has fewer verses than requested, the whole chapter is used.
export function buildPassage(bible: Bible, req: PassageRequest): Passage {
  const length = Math.max(1, req.length);

  const book: Book = req.book
    ? bible.books.find((b) => b.name === req.book) ?? bible.books[0]
    : bible.books[randInt(bible.books.length)];

  const chapterIdx =
    req.chapter != null
      ? clamp(req.chapter - 1, 0, book.chapters.length - 1)
      : randInt(book.chapters.length);
  const verses = book.chapters[chapterIdx];

  const maxStart = Math.max(0, verses.length - length);
  const start =
    req.startVerse != null
      ? clamp(req.startVerse - 1, 0, verses.length - 1)
      : randInt(maxStart + 1);
  const slice = verses.slice(start, start + length);

  const firstVerse = start + 1;
  const lastVerse = start + slice.length;
  return {
    text: slice.join(" "),
    reference: makeReference(book.name, chapterIdx + 1, firstVerse, lastVerse),
    book: book.name,
    chapter: chapterIdx + 1,
    startVerse: firstVerse,
    endVerse: lastVerse,
  };
}

function makeReference(book: string, chapter: number, first: number, last: number): string {
  return last > first
    ? `${book} ${chapter}:${first}–${last}`
    : `${book} ${chapter}:${first}`;
}
