import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { CalendarDays, RefreshCw, Search } from "lucide-react";

import useAuth from "../hooks/useAuth.js";
import useMatches from "../hooks/useMatches.js";
import { predictionService } from "../services/predictionService.js";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loader from "../components/ui/Loader.jsx";
import MatchFilters from "../components/matches/MatchFilters.jsx";
import MatchList from "../components/matches/MatchList.jsx";

const LIVE_REFRESH_MS = 60000;

const FIELD_CLASSES =
  "w-full rounded-xl border border-white/10 bg-pitch px-4 py-3 text-sm text-white outline-none transition placeholder:text-text-secondary/60 focus:border-brand/70";

function buildPredictionsMap(predictions) {
  const map = {};

  for (const prediction of predictions) {
    map[prediction.match_id] = prediction;
  }

  return map;
}

function matchesDate(value, dateFilter, customDate) {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) return true;

  switch (dateFilter) {
    case "today":
      return isSameDay(date, new Date());
    case "tomorrow":
      return isSameDay(date, addDays(new Date(), 1));
    case "custom":
      return customDate ? isSameDay(date, parseISO(customDate)) : true;
    default:
      return true;
  }
}

export default function Matches() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState("upcoming");
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [competition, setCompetition] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");

  const { matches, pagination, loading, error, updatedAt, reload } = useMatches({
    status: filter,
    limit: 100,
    pollMs: filter === "live" ? LIVE_REFRESH_MS : 0,
  });

  const [predictions, setPredictions] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

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

  const competitions = useMemo(() => {
    const names = new Set();

    for (const match of matches) {
      if (match.competition) names.add(match.competition);
    }

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [matches]);

  const visibleMatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return matches.filter((match) => {
      if (competition !== "all" && match.competition !== competition) {
        return false;
      }

      if (!matchesDate(match.kickoff_at, dateFilter, customDate)) {
        return false;
      }

      if (!query) return true;

      return [match.home_team, match.away_team, match.competition].some(
        (value) => value?.toLowerCase().includes(query)
      );
    });
  }, [matches, competition, dateFilter, customDate, search]);

  function handleSearchChange(value) {
    setSearch(value);

    const next = new URLSearchParams(searchParams);

    if (value.trim()) {
      next.set("q", value);
    } else {
      next.delete("q");
    }

    setSearchParams(next, { replace: true });
  }

  function resetFilters() {
    setSearch("");
    setCompetition("all");
    setDateFilter("all");
    setCustomDate("");
    setSearchParams({}, { replace: true });
  }

  const filtersActive =
    Boolean(search.trim()) || competition !== "all" || dateFilter !== "all";

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
      toast.success(result.updated ? "Prediction updated!" : "Prediction saved!");
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

      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MatchFilters value={filter} onChange={setFilter} />

          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={loading}
            aria-label="Refresh matches"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : undefined}
            />
            Refresh
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search teams or competitions"
              aria-label="Search matches by team or competition"
              className={`${FIELD_CLASSES} pl-9`}
            />
          </div>

          <select
            value={competition}
            onChange={(event) => setCompetition(event.target.value)}
            aria-label="Filter by competition"
            className={FIELD_CLASSES}
          >
            <option value="all">All competitions</option>
            {competitions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              aria-label="Filter by date"
              className={FIELD_CLASSES}
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="custom">Pick a date</option>
            </select>

            {dateFilter === "custom" && (
              <input
                type="date"
                value={customDate}
                onChange={(event) => setCustomDate(event.target.value)}
                aria-label="Pick a date"
                className={FIELD_CLASSES}
              />
            )}
          </div>
        </div>

        {!loading && !error && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
            <span>
              {visibleMatches.length} match
              {visibleMatches.length === 1 ? "" : "es"}
              {filtersActive ? " after filters" : ""}
            </span>

            {updatedAt && <span>Updated {format(updatedAt, "HH:mm")}</span>}

            {pagination && pagination.total > matches.length && (
              <span>
                Showing first {matches.length} of {pagination.total}
              </span>
            )}

            {filtersActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="font-semibold text-brand transition hover:text-brand-hover"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-16 text-brand">
          <Loader className="h-8 w-8" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}

      {!loading && !error && visibleMatches.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title={
            filtersActive ? "No matches found" : "No matches available yet"
          }
          description={
            filtersActive
              ? "Try a different competition, date, or search term."
              : "Check back when new fixtures are added."
          }
          action={
            filtersActive ? (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            ) : undefined
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
