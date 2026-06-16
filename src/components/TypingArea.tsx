import type { CharCell } from "../types";

interface Props {
  cells: CharCell[];
  caretIndex: number;
}

// Renders the target text one character at a time, coloured by typing state,
// with a blinking caret drawn on the current character. The reference is
// intentionally not shown here — it is revealed only on the results screen.
export function TypingArea({ cells, caretIndex }: Props) {
  return (
    <div className="typing-area">
      {cells.map((c, i) => (
        <span
          key={i}
          className={`char ${c.state}${i === caretIndex ? " caret" : ""}`}
        >
          {c.char}
        </span>
      ))}
    </div>
  );
}
