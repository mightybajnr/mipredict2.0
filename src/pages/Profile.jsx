import { useEffect, useState } from "react";
import { LogOut, Mail, Percent, Target, Trophy, UserRound } from "lucide-react";

import useAuth from "../hooks/useAuth.js";
import { predictionService } from "../services/predictionService.js";
import { userService } from "../services/userService.js";
import { computePredictionStats } from "../utils/predictionStats.js";
import { formatPoints } from "../utils/formatPoints.js";
import Avatar from "../components/ui/Avatar.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loader from "../components/ui/Loader.jsx";
import StatCard from "../components/ui/StatCard.jsx";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileUser, setProfileUser] = useState(user);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    userService
      .getMe()
      .then((result) => {
        if (active) setProfileUser(result.user ?? user);
      })
      .catch(() => {
        if (active) setProfileUser(user);
      });

    return () => {
      active = false;
    };
  }, [user]);

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
          setError(err.message || "Could not load your statistics.");
        }
      });

    return () => {
      active = false;
    };
  }, [user, reloadKey]);

  const loading = predictions === null && !error;
  const stats = predictions ? computePredictionStats(predictions) : null;

  function reload() {
    setPredictions(null);
    setError("");
    setReloadKey((key) => key + 1);
  }

  const displayUser = profileUser ?? user;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
          Account
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          Profile
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={displayUser?.name || displayUser?.email} size="lg" />

            <h2 className="mt-4 font-display text-xl font-bold">
              {displayUser?.name || "Player"}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
              <Mail size={14} />
              {displayUser?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-text-secondary transition hover:border-danger/50 hover:bg-danger/10 hover:text-danger"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </Card>

        <div className="min-w-0">
          {loading && (
            <div className="flex justify-center py-16 text-brand">
              <Loader className="h-8 w-8" />
            </div>
          )}

          {!loading && error && (
            <ErrorMessage message={error} onRetry={reload} />
          )}

          {!loading && !error && (
            <div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard
                  icon={UserRound}
                  label="Predictions"
                  value={stats?.total ?? 0}
                />
                <StatCard
                  icon={Target}
                  label="Correct"
                  value={stats?.correct ?? 0}
                />
                <StatCard
                  icon={Percent}
                  label="Accuracy"
                  value={
                    stats?.accuracy === null ? "—" : `${stats.accuracy}%`
                  }
                />
                <StatCard
                  icon={Trophy}
                  label="Points"
                  value={formatPoints(stats?.points ?? 0)}
                />
              </div>

              {stats?.total === 0 && (
                <EmptyState
                  className="mt-6"
                  icon={UserRound}
                  title="No statistics yet"
                  description="Make your first prediction and your progress will appear here."
                />
              )}

              <Card className="mt-6 p-5 sm:p-6">
                <h2 className="font-display text-lg font-semibold">
                  Account information
                </h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <dt className="text-text-secondary">Name</dt>
                    <dd className="font-semibold">{displayUser?.name}</dd>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <dt className="text-text-secondary">Email</dt>
                    <dd className="font-semibold">{displayUser?.email}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}