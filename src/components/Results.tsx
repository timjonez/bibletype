import type { TestStats } from "../types";

interface Props {
  stats: TestStats;
  reference: string;
  onNext: () => void;
  onRestart: () => void;
}

// The results screen. WPM and accuracy headline; the verse reference is
// revealed here (it was hidden during typing).
export function Results({ stats, reference, onNext, onRestart }: Props) {
  return (
    <div className="results">
      <div className="headline">
        <Stat big label="wpm" value={stats.wpm} />
        <Stat big label="acc" value={`${stats.accuracy}%`} />
      </div>

      <div className="reference">{reference}</div>

      <div className="detail">
        <Stat label="raw" value={stats.rawWpm} />
        <Stat label="time" value={`${stats.seconds.toFixed(1)}s`} />
        <Stat
          label="characters"
          value={`${stats.correct}/${stats.incorrect}`}
        />
      </div>

      <div className="actions">
        <button className="primary" onClick={onNext}>
          next passage
        </button>
        <button onClick={onRestart}>retry this one</button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  big,
}: {
  label: string;
  value: string | number;
  big?: boolean;
}) {
  return (
    <div className={`stat${big ? " big" : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
