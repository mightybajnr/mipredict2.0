import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Target } from "lucide-react";

import useAuth from "../hooks/useAuth.js";
import { predictionService } from "../services/predictionService.js";
import { isPredictionCorrect } from "../utils/predictionStats.js";
import { formatKickoff } from "../utils/formatDate.js";
import { formatPoints } from "../utils/formatPoints.js";
import { STATUS_VARIANTS } from "../utils/matchStatus.js";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loader from "../components/ui/Loader.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

function matchesFilter(prediction, filter) {
  switch (filter) {
    case "upcoming":
      return prediction.status === "scheduled";
    case "pending":
      return prediction.status === "live";
    case "completed":
      return prediction.status === "finished";
    default:
      return true;
  }
}

export default function Predictions() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;

    predictionService
      .getMyPredictions()
      .then((result) => {
        if (active) {
          setPredictions(result.predictions ?? []);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setPredictions(null);
          setError(err.message || "Could not load predictions.");
        }
      });

    return () => {
      active = false;
    };
  }, [user, reloadKey]);

  const loading = predictions === null && !error;
  const visible = predictions?.filter((p) => matchesFilter(p, filter)) ?? [];

  function reload() {
    setPredictions(null);
    setError("");
    setReloadKey((key) => key + 1);
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
          Your calls
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          My Predictions
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Every score you&apos;ve called, and how it played out.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Prediction filters"
        className="mb-5 inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-surface p-1"
      >
        {FILTERS.map((filterOption) => (
          <button
            key={filterOption.value}
            type="button"
            role="tab"
            aria-selected={filter === filterOption.value}
            onClick={() => setFilter(filterOption.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
              filter === filterOption.value
                ? "bg-brand text-pitch"
                : "text-text-secondary hover:text-white"
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-16 text-brand">
          <Loader className="h-8 w-8" />
        </div>
      )}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={reload} />
      )}

      {!loading && !error && visible.length === 0 && (
        <EmptyState
          icon={Target}
          title={filter === "all" ? "No predictions yet" : "Nothing here"}
          description={
            filter === "all"
              ? "Predict the score of an upcoming match and it will show up here."
              : "No predictions match this view right now."
          }
          action={
            <Link
              to="/matches"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-pitch transition hover:bg-brand-hover"
            >
              Browse matches
            </Link>
          }
        />
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="space-y-4">
          {visible.map((prediction) => {
            const correct = isPredictionCorrect(prediction);
            const finished = prediction.status === "finished";
            const showPoints = finished && Number(prediction.points) > 0;

            return (
              <Card key={prediction.id} className="p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-text-secondary">
                    {prediction.competition}
                  </span>
                  <span className="flex items-center gap-2">
                    {correct && <Badge variant="success">Exact</Badge>}
                    <Badge variant={STATUS_VARIANTS[prediction.status]}>
                      {prediction.status}
                    </Badge>
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <p className="break-words text-center font-display font-bold sm:text-lg">
                    {prediction.home_team}
                  </p>
                  <span className="text-xs font-bold text-text-secondary sm:text-sm">
                    VS
                  </span>
                  <p className="break-words text-center font-display font-bold sm:text-lg">
                    {prediction.away_team}
                  </p>
                </div>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-text-secondary sm:text-sm">
                  <CalendarDays size={14} />
                  {formatKickoff(prediction.kickoff_at)}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-sm">
                  <span className="text-text-secondary">Your call</span>
                  <span className="font-display text-base font-bold">
                    {prediction.predicted_home_score}
                    <span className="mx-1 text-text-secondary">–</span>
                    {prediction.predicted_away_score}
                  </span>

                  {finished && (
                    <>
                      <span className="text-text-secondary">Full time</span>
                      <span className="font-display text-base font-bold">
                        {prediction.home_score}
                        <span className="mx-1 text-text-secondary">–</span>
                        {prediction.away_score}
                      </span>
                    </>
                  )}

                  {showPoints && (
                    <span className="font-semibold text-brand">
                      +{formatPoints(prediction.points)} pts
                    </span>
                  )}

                  {finished && !showPoints && Number(prediction.points) === 0 && (
                    <span className="text-xs text-text-secondary">
                      0 points
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}