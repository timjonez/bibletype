import type { Bible } from "../types";
import { LENGTH_OPTIONS, type Settings } from "../storage/settings";
import { BookPicker } from "./BookPicker";

interface Props {
  bible: Bible;
  settings: Settings;
  bestWpm: number;
  onLength: (length: number) => void;
  onSource: (source: Settings["source"]) => void;
  onPick: (book: string, chapter: number) => void;
  onToggleTheme: () => void;
  onShowHistory: () => void;
  onNext: () => void;
}

export function ConfigBar({
  bible,
  settings,
  bestWpm,
  onLength,
  onSource,
  onPick,
  onToggleTheme,
  onShowHistory,
  onNext,
}: Props) {
  return (
    <div className="config">
      <div className="config-row">
        <div className="group" role="group" aria-label="Passage length">
          {LENGTH_OPTIONS.map((n) => (
            <button
              key={n}
              className={settings.length === n ? "active" : ""}
              onClick={() => onLength(n)}
            >
              {n} {n === 1 ? "verse" : "verses"}
            </button>
          ))}
        </div>

        <div className="group" role="group" aria-label="Passage source">
          <button
            className={settings.source === "random" ? "active" : ""}
            onClick={() => onSource("random")}
          >
            random
          </button>
          <button
            className={settings.source === "picker" ? "active" : ""}
            onClick={() => onSource("picker")}
          >
            choose
          </button>
        </div>

        <div className="group right">
          <span className="best" title="Best WPM">
            best {bestWpm}
          </span>
          <button onClick={onShowHistory}>history</button>
          <button onClick={onToggleTheme} title="Toggle theme">
            {settings.theme === "dark" ? "☀" : "☾"}
          </button>
          <button className="primary" onClick={onNext} title="New passage (Tab)">
            next
          </button>
        </div>
      </div>

      {settings.source === "picker" && (
        <BookPicker
          bible={bible}
          book={settings.book}
          chapter={settings.chapter}
          onChange={onPick}
        />
      )}
    </div>
  );
}
