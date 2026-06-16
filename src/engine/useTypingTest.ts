import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CharCell, CharState, TestStats } from "../types";
import { computeStats } from "./stats";

export interface TypingTest {
  cells: CharCell[];
  caretIndex: number;
  started: boolean;
  finished: boolean;
  stats: TestStats;
  reset: () => void;
}

// Drives the typing experience for a single target string. Listens for global
// keystrokes: printable keys advance the cursor (wrong keys still advance and
// mark the position red), Backspace retreats, Ctrl/Alt+Backspace deletes a word.
// The timer starts on the first keystroke and the test finishes when every
// position is filled.
export function useTypingTest(target: string): TypingTest {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [, tick] = useState(0);

  const inputRef = useRef("");
  const typedRef = useRef(0);
  const errorRef = useRef(0);

  const started = startTime !== null;
  const finished = endTime !== null;

  const reset = useCallback(() => {
    inputRef.current = "";
    typedRef.current = 0;
    errorRef.current = 0;
    setInput("");
    setStartTime(null);
    setEndTime(null);
  }, []);

  // Start fresh whenever the target text changes.
  useEffect(() => {
    reset();
  }, [target, reset]);

  // Re-render a few times a second so the live timer / WPM stay current.
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => tick((t) => t + 1), 200);
    return () => clearInterval(id);
  }, [started, finished]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (endTime !== null || e.metaKey) return;
      const key = e.key;

      if (key === "Backspace") {
        e.preventDefault();
        const prev = inputRef.current;
        if (prev.length === 0) return;
        const next =
          e.ctrlKey || e.altKey ? prev.replace(/\s*\S*$/, "") : prev.slice(0, -1);
        inputRef.current = next;
        setInput(next);
        return;
      }

      // Ignore non-character keys and keyboard shortcuts.
      if (key.length !== 1 || e.ctrlKey || e.altKey) return;
      e.preventDefault();

      const prev = inputRef.current;
      if (prev.length >= target.length) return;

      const idx = prev.length;
      typedRef.current += 1;
      if (key !== target[idx]) errorRef.current += 1;
      if (idx === 0) setStartTime(performance.now());

      const next = prev + key;
      inputRef.current = next;
      setInput(next);
      if (next.length === target.length) setEndTime(performance.now());
    },
    [endTime, target],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const cells = useMemo<CharCell[]>(
    () =>
      Array.from(target).map((char, i) => {
        let state: CharState = "untyped";
        if (i < input.length) state = input[i] === char ? "correct" : "incorrect";
        return { char, state };
      }),
    [target, input],
  );

  const correct = useMemo(() => {
    let c = 0;
    for (let i = 0; i < input.length; i++) if (input[i] === target[i]) c++;
    return c;
  }, [input, target]);

  const elapsedMs =
    startTime === null ? 0 : (endTime ?? performance.now()) - startTime;

  const stats = computeStats({
    correct,
    total: input.length,
    typed: typedRef.current,
    errors: errorRef.current,
    ms: elapsedMs,
  });

  return { cells, caretIndex: input.length, started, finished, stats, reset };
}
