import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarDays, RefreshCw, Trophy } from "lucide-react";

import useAuth from "../hooks/useAuth.js";
import { matchService } from "../services/matchService.js";
import { predictionService } from "../services/predictionService.js";
import { formatKickoff } from "../utils/formatDate.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loader from "../components/ui/Loader.jsx";
import PredictionForm from "../components/matches/PredictionForm.jsx";
import StatusBadge from "../components/matches/StatusBadge.jsx";
import TeamCrest from "../components/matches/TeamCrest.jsx";

function TeamBlock({ name }) {
  return (
    <div className="min-w-0 text-center">
      <div className="mx-auto flex w-fit">
        <TeamCrest name={name} />
      </div>
      <p className="mt-3 break-words text-sm font-semibold sm:text-base">
        {name}
      </p>
    </div>
  );
}

export default function MatchDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [match, setMatch] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedKey, setLoadedKey] = useState(null);

  const requestKey = `${id}|${user?.id ?? "guest"}|${reloadKey}`;

  useEffect(() => {
    let active = true;

    Promise.all([
      matchService.getMatch(id),
      user
        ? predictionService
            .getMyMatchPrediction(id)
            .catch(() => ({ prediction: null }))
        : Promise.resolve({ prediction: null }),
    ])
      .then(([matchResult, predictionResult]) => {
        if (!active) return;
        setMatch(matchResult.match);
        setPrediction(predictionResult.prediction ?? null);
        setError("");
        setLoadedKey(requestKey);
      })
      .catch((err) => {
        if (!active) return;
        setMatch(null);
        setPrediction(null);
        setError(err.message || "Could not load this match.");
        setLoadedKey(requestKey);
      });

    return () => {
      active = false;
    };
  }, [id, requestKey, user]);

  const loading = loadedKey !== requestKey;

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  async function handlePredict(home, away) {
    try {
      setSubmitting(true);
      const result = await predictionService.submitPrediction(id, home, away);
      setPrediction(result.prediction);
      toast.success(result.updated ? "Prediction updated!" : "Prediction saved!");
    } catch (err) {
      toast.error(err.message || "Could not submit prediction.");
    } finally {
      setSubmitting(false);
    }
  }

  const finished = match?.status === "finished";
  const live = match?.status === "live";
  const hasScore =
    match && match.home_score !== null && match.away_score !== null;

  return (
    <div>
      <Link
        to="/matches"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary transition hover:text-brand"
      >
        <ArrowLeft size={16} />
        All matches
      </Link>

      {loading && (
        <div className="flex justify-center py-16 text-brand">
          <Loader className="h-8 w-8" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}

      {!loading && !error && match && (
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
              <Trophy size={15} className="shrink-0 text-brand" />
              <span className="truncate">{match.competition}</span>
            </span>

            <span className="flex items-center gap-2">
              <StatusBadge status={match.status} />
              <Button
                variant="ghost"
                size="sm"
                onClick={reload}
                aria-label="Refresh match"
              >
                <RefreshCw size={15} />
              </Button>
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <TeamBlock name={match.home_team} />
            <span className="font-display text-lg font-bold text-text-secondary sm:text-xl">
              {hasScore ? `${match.home_score} – ${match.away_score}` : "VS"}
            </span>
            <TeamBlock name={match.away_team} />
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-sm text-text-secondary">
            <CalendarDays size={15} className="shrink-0" />
            {formatKickoff(match.kickoff_at)}
          </p>

          {finished && hasScore && (
            <p className="mt-2 text-center font-display text-lg font-bold text-brand">
              Full time
            </p>
          )}

          {live && hasScore && (
            <p
              className="mt-2 text-center font-display text-lg font-bold text-danger"
              aria-live="polite"
            >
              Live
            </p>
          )}

          <div className="mx-auto mt-6 max-w-lg">
            {!user && (
              <div className="rounded-xl border border-dashed border-white/15 p-4 text-center">
                <p className="text-sm text-text-secondary">
                  <Link
                    to="/login"
                    className="font-semibold text-brand transition hover:text-brand-hover"
                  >
                    Sign in
                  </Link>{" "}
                  to make your prediction.
                </p>
              </div>
            )}

            {user && match.status === "scheduled" && (
              <PredictionForm
                key={prediction?.id ?? `match-${match.id}`}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                prediction={prediction}
                locked={false}
                submitting={submitting}
                onSubmit={handlePredict}
              />
            )}

            {user && match.status !== "scheduled" && (
              <div className="mt-5 border-t border-white/10 pt-4 text-center">
                <p className="text-sm font-semibold">Predictions closed</p>
                {prediction ? (
                  <p className="mt-2 text-sm text-text-secondary">
                    Your call was{" "}
                    <span className="font-display font-bold text-white">
                      {prediction.predicted_home_score}
                      <span className="mx-1 text-text-secondary">–</span>
                      {prediction.predicted_away_score}
                    </span>
                    {Number(prediction.points) > 0 && (
                      <span className="ml-2 font-semibold text-brand">
                        +{prediction.points} pts
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-text-secondary">
                    You did not make a prediction for this match.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
