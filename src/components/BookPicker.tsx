import type { Bible } from "../types";

interface Props {
  bible: Bible;
  book: string;
  chapter: number;
  onChange: (book: string, chapter: number) => void;
}

// Two dependent dropdowns: choosing a book resets the chapter to 1 and
// re-scopes the chapter list to that book's chapter count.
export function BookPicker({ bible, book, chapter, onChange }: Props) {
  const current = bible.books.find((b) => b.name === book) ?? bible.books[0];
  const chapterCount = current.chapters.length;

  return (
    <div className="picker">
      <select
        aria-label="Book"
        value={current.name}
        onChange={(e) => onChange(e.target.value, 1)}
      >
        {bible.books.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>
      <select
        aria-label="Chapter"
        value={Math.min(chapter, chapterCount)}
        onChange={(e) => onChange(current.name, Number(e.target.value))}
      >
        {Array.from({ length: chapterCount }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            Chapter {n}
          </option>
        ))}
      </select>
    </div>
  );
}
