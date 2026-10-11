import { useEffect, useState } from "react";
import { ShieldAlert, Trophy } from "lucide-react";

import useAuth from "../hooks/useAuth.js";
import { leaderboardService } from "../services/leaderboardService.js";
import { formatPercent, formatPoints } from "../utils/formatPoints.js";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loader from "../components/ui/Loader.jsx";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable.jsx";

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState("");
  const [myEntry, setMyEntry] = useState(null);
  const [myError, setMyError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    leaderboardService
      .getLeaderboard()
      .then((result) => {
        if (active) {
          setEntries(result.leaderboard ?? []);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setEntries(null);
          setError(err.message || "Could not load the leaderboard.");
        }
      });

    leaderboardService
      .getLeaderboardMe()
      .then((result) => {
        if (active) {
          setMyEntry(result.entry ?? null);
          setMyError("");
        }
      })
      .catch((err) => {
        if (active) {
          setMyEntry(null);
          setMyError(err.message || "");
        }
      });

    return () => {
      active = false;
    };
  }, [user, reloadKey]);

  const loading = entries === null && !error;
  const loadingMine = myEntry === null && !myError;

  function reload() {
    setEntries(null);
    setError("");
    setMyEntry(null);
    setMyError("");
    setReloadKey((key) => key + 1);
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
          Rankings
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          Leaderboard
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Points are awarded as predictions are scored after matches finish.
        </p>
      </div>

      <Card className="mb-6 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Your standing</h2>

        {loadingMine && (
          <div className="flex justify-center py-8 text-brand">
            <Loader className="h-6 w-6" />
          </div>
        )}

        {!loadingMine && !myError && myEntry && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Rank
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-brand">
                #{myEntry.rank}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Points
              </p>
              <p className="mt-1 font-display text-2xl font-bold">
                {formatPoints(myEntry.total_points)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Accuracy
              </p>
              <p className="mt-1 font-display text-2xl font-bold">
                {formatPercent(myEntry.accuracy)}
              </p>
            </div>
          </div>
        )}

        {!loadingMine && !myError && !myEntry && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-pitch p-4 text-sm text-text-secondary">
            <ShieldAlert size={18} className="shrink-0 text-brand" />
            You are not ranked yet. Make a prediction and get scored to join the
            leaderboard.
          </div>
        )}

        {!loadingMine && myError && (
          <p className="mt-4 text-sm text-text-secondary">
            Could not load your standing.
          </p>
        )}
      </Card>

      {loading && (
        <div className="flex justify-center py-16 text-brand">
          <Loader className="h-8 w-8" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}

      {!loading && !error && entries.length === 0 && (
        <EmptyState
          icon={Trophy}
          title="The leaderboard is empty"
          description="Once players start predicting and matches are scored, rankings appear here."
        />
      )}

      {!loading && !error && entries.length > 0 && (
        <LeaderboardTable entries={entries} currentUserId={user.id} />
      )}
    </div>
  );
}