import { useEffect, useState } from "react";
import type { Bible } from "../types";

interface BibleState {
  bible: Bible | null;
  error: string | null;
}

// Loads the bundled KJV text once. The ~4MB JSON lives in public/ and is
// fetched at runtime rather than imported, to keep the JS bundle small.
export function useBible(): BibleState {
  const [state, setState] = useState<BibleState>({ bible: null, error: null });

  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}kjv.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Bible>;
      })
      .then((bible) => active && setState({ bible, error: null }))
      .catch((e) =>
        active && setState({ bible: null, error: `Failed to load Bible text: ${e}` }),
      );
    return () => {
      active = false;
    };
  }, []);

  return state;
}
