import { useCallback, useEffect, useState } from "react";

import { matchService } from "../services/matchService.js";

export default function useMatches(filter = "upcoming") {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState({
    filter: null,
    reloadKey: -1,
    matches: [],
    error: "",
  });

  useEffect(() => {
    let active = true;

    matchService
      .getMatches(filter)
      .then((result) => {
        if (!active) return;
        setState({
          filter,
          reloadKey,
          matches: result.matches ?? [],
          error: "",
        });
      })
      .catch((err) => {
        if (!active) return;
        setState({
          filter,
          reloadKey,
          matches: [],
          error: err.message || "Could not load matches.",
        });
      });

    return () => {
      active = false;
    };
  }, [filter, reloadKey]);

  const loading = state.filter !== filter || state.reloadKey !== reloadKey;

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    matches: state.matches,
    loading,
    error: loading ? "" : state.error,
    reload,
  };
}
