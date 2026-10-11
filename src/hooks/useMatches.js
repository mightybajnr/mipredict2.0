import { useCallback, useEffect, useState } from "react";

import { matchService } from "../services/matchService.js";

const DEFAULT_OPTIONS = {
  status: "upcoming",
  competition: "",
  limit: 100,
  pollMs: 0,
};

export default function useMatches(options = {}) {
  const { status, competition, limit, pollMs } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState({
    key: null,
    matches: [],
    pagination: null,
    error: "",
    updatedAt: null,
  });

  const requestKey = `${status}|${competition}|${limit}`;

  useEffect(() => {
    let active = true;

    matchService
      .getMatches({ status, competition, limit })
      .then((result) => {
        if (!active) return;
        setState({
          key: requestKey,
          matches: result.matches ?? [],
          pagination: result.pagination ?? null,
          error: "",
          updatedAt: new Date(),
        });
      })
      .catch((err) => {
        if (!active) return;
        setState({
          key: requestKey,
          matches: [],
          pagination: null,
          error: err.message || "Could not load matches.",
          updatedAt: new Date(),
        });
      });

    return () => {
      active = false;
    };
  }, [requestKey, reloadKey, status, competition, limit]);

  useEffect(() => {
    if (!pollMs) return undefined;

    const timer = window.setInterval(
      () => setReloadKey((key) => key + 1),
      pollMs
    );

    return () => window.clearInterval(timer);
  }, [pollMs]);

  // `loading` only flips on a new query (key change), so background refreshes
  // triggered by `reload` or live polling never blank out the current list.
  const loading = state.key !== requestKey;

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    matches: state.matches,
    pagination: state.pagination,
    loading,
    error: loading ? "" : state.error,
    updatedAt: loading ? null : state.updatedAt,
    reload,
  };
}
