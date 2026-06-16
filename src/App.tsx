import { useCallback, useEffect, useState } from "react";
import type { Passage, TestStats } from "./types";
import { useBible } from "./data/useBible";
import { buildPassage, type PassageRequest } from "./data/passage";
import { ConfigBar } from "./components/ConfigBar";
import { TestScreen } from "./components/TestScreen";
import { Results } from "./components/Results";
import { History } from "./components/History";
import {
  applyTheme,
  loadSettings,
  saveSettings,
  type Settings,
} from "./storage/settings";
import { bestWpm, clearHistory, loadHistory, saveResult } from "./storage/history";

function toRequest(s: Settings): PassageRequest {
  return s.source === "picker"
    ? { length: s.length, book: s.book, chapter: s.chapter }
    : { length: s.length };
}

export default function App() {
  const { bible, error } = useBible();
  const [settings, setSettings] = useState(loadSettings);
  const [passage, setPassage] = useState<Passage | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ stats: TestStats; reference: string } | null>(null);
  const [history, setHistory] = useState(loadHistory);
  const [view, setView] = useState<"test" | "history">("test");

  useEffect(() => applyTheme(settings.theme), [settings.theme]);

  // Builds a fresh passage from the given settings (defaults to current).
  const nextPassage = useCallback(
    (s: Settings = settings) => {
      if (!bible) return;
      setPassage(buildPassage(bible, toRequest(s)));
      setResult(null);
      setAttempt((a) => a + 1);
    },
    [bible, settings],
  );

  // First passage once the text has loaded.
  useEffect(() => {
    if (bible && !passage) nextPassage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bible]);

  // Updates and persists settings; rebuilds the passage when a
  // passage-affecting field (length / source / book / chapter) changes.
  const updateSettings = useCallback(
    (patch: Partial<Settings>, rebuild: boolean) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      saveSettings(next);
      if (rebuild && bible) {
        setPassage(buildPassage(bible, toRequest(next)));
        setResult(null);
        setAttempt((a) => a + 1);
      }
    },
    [bible, settings],
  );

  const onComplete = useCallback(
    (stats: TestStats) => {
      if (!passage) return;
      setHistory(
        saveResult({
          ...stats,
          reference: passage.reference,
          length: settings.length,
          date: Date.now(),
        }),
      );
      setResult({ stats, reference: passage.reference });
    },
    [passage, settings.length],
  );

  // Tab starts a new passage, mirroring Monkeytype's restart shortcut.
  useEffect(() => {
    if (view !== "test") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        nextPassage();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, nextPassage]);

  if (error) {
    return (
      <main className="app">
        <p className="error">{error}</p>
      </main>
    );
  }

  if (!bible || !passage) {
    return (
      <main className="app">
        <p className="loading">Loading scripture…</p>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="brand">
        <span className="logo">bible</span>type
        <span className="translation">KJV</span>
      </header>

      {view === "history" ? (
        <History
          history={history}
          onClear={() => {
            clearHistory();
            setHistory([]);
          }}
          onBack={() => setView("test")}
        />
      ) : (
        <>
          <ConfigBar
            bible={bible}
            settings={settings}
            bestWpm={bestWpm(history)}
            onLength={(length) => updateSettings({ length }, true)}
            onSource={(source) => updateSettings({ source }, true)}
            onPick={(book, chapter) => updateSettings({ book, chapter }, true)}
            onToggleTheme={() =>
              updateSettings(
                { theme: settings.theme === "dark" ? "light" : "dark" },
                false,
              )
            }
            onShowHistory={() => setView("history")}
            onNext={() => nextPassage()}
          />

          {result ? (
            <Results
              stats={result.stats}
              reference={result.reference}
              onNext={() => nextPassage()}
              onRestart={() => {
                setResult(null);
                setAttempt((a) => a + 1);
              }}
            />
          ) : (
            <TestScreen
              key={`${passage.reference}#${attempt}`}
              passage={passage}
              onComplete={onComplete}
            />
          )}
        </>
      )}
    </main>
  );
}
