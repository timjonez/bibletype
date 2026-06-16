import type { HistoryEntry } from "../types";

interface Props {
  history: HistoryEntry[];
  onClear: () => void;
  onBack: () => void;
}

export function History({ history, onClear, onBack }: Props) {
  return (
    <div className="history">
      <div className="history-head">
        <h2>History</h2>
        <div className="group right">
          {history.length > 0 && <button onClick={onClear}>clear</button>}
          <button className="primary" onClick={onBack}>
            back
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="empty">No tests yet — go type some scripture.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>wpm</th>
              <th>acc</th>
              <th>raw</th>
              <th>passage</th>
              <th>when</th>
            </tr>
          </thead>
          <tbody>
            {history.map((e, i) => (
              <tr key={i}>
                <td className="num">{e.wpm}</td>
                <td className="num">{e.accuracy}%</td>
                <td className="num">{e.rawWpm}</td>
                <td>{e.reference}</td>
                <td className="when">{new Date(e.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
