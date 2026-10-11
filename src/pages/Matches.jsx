import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarDays, Search } from "lucide-react";

import useAuth from "../hooks/useAuth.js";
import useMatches from "../hooks/useMatches.js";
import { predictionService } from "../services/predictionService.js";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loader from "../components/ui/Loader.jsx";
import MatchFilters from "../components/matches/MatchFilters.jsx";
import MatchList from "../components/matches/MatchList.jsx";

function buildPredictionsMap(predictions) {
  const map = {};

  for (const prediction of predictions) {
    map[prediction.match_id] = prediction;
  }

  return map;
}

export default function Matches() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("upcoming");
  const { matches, loading, error, reload } = useMatches(filter);

  const [predictions, setPredictions] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  useEffect(() => {
    if (!user) return undefined;

    let active = true;

    predictionService
      .getMyPredictions()
      .then((result) => {
        if (!active) return;
        setPredictions(buildPredictionsMap(result.predictions ?? []));
      })
      .catch(() => {
        if (active) setPredictions({});
      });

    return () => {
      active = false;
    };
  }, [user]);

  const visibleMatches = useMemo(() => {
    if (!query) return matches;

    return matches.filter((match) =>
      [match.home_team, match.away_team, match.competition].some((value) =>
        value?.toLowerCase().includes(query)
      )
    );
  }, [matches, query]);

  async function handlePredict(match, home, away) {
    try {
      setSubmittingId(match.id);
      const result = await predictionService.submitPrediction(
        match.id,
        home,
        away
      );
      setPredictions((previous) => ({
        ...previous,
        [match.id]: result.prediction,
      }));
      toast.success("Prediction saved!");
    } catch (err) {
      toast.error(err.message || "Could not submit prediction.");
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
          Fixtures
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          Matches
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Pick the exact score before kickoff.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <MatchFilters value={filter} onChange={setFilter} />

        {query && (
          <p className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Search size={14} />
            Results for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-16 text-brand">
          <Loader className="h-8 w-8" />
        </div>
      )}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={reload} />
      )}

      {!loading && !error && visibleMatches.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title={query ? "No matches found" : "No matches available yet"}
          description={
            query
              ? `Nothing matches "${query}" in this view.`
              : "Check back when new fixtures are added."
          }
        />
      )}

      {!loading && !error && visibleMatches.length > 0 && (
        <MatchList
          matches={visibleMatches}
          predictionsByMatchId={predictions}
          user={user}
          submittingId={submittingId}
          onSubmit={handlePredict}
        />
      )}
    </div>
  );
}