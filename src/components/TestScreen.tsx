import { useEffect, useRef } from "react";
import type { Passage, TestStats } from "../types";
import { useTypingTest } from "../engine/useTypingTest";
import { TypingArea } from "./TypingArea";

interface Props {
  passage: Passage;
  onComplete: (stats: TestStats) => void;
}

// Hosts the typing engine for one passage and reports the final stats once,
// when the test completes. Remounted (via key) by the parent to restart.
export function TestScreen({ passage, onComplete }: Props) {
  const test = useTypingTest(passage.text);
  const reported = useRef(false);

  useEffect(() => {
    if (test.finished && !reported.current) {
      reported.current = true;
      onComplete(test.stats);
    }
  }, [test.finished, test.stats, onComplete]);

  const progress = passage.text.length
    ? Math.round((test.caretIndex / passage.text.length) * 100)
    : 0;

  return (
    <div className="test-screen">
      <div className="livebar">
        <span>{test.stats.wpm} wpm</span>
        <span>{test.stats.seconds.toFixed(0)}s</span>
        <span>{progress}%</span>
      </div>
      <TypingArea cells={test.cells} caretIndex={test.caretIndex} />
      <p className="hint">type the passage · Tab for a new one</p>
    </div>
  );
}
