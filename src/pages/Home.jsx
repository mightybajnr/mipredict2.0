import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Crosshair,
  Percent,
  Target,
  Trophy,
} from "lucide-react";

import useAuth from "../hooks/useAuth.js";
import { dashboardService } from "../services/dashboardService.js";
import { leaderboardService } from "../services/leaderboardService.js";
import { formatKickoff } from "../utils/formatDate.js";
import { formatPoints } from "../utils/formatPoints.js";
import { STATUS_VARIANTS } from "../utils/matchStatus.js";
import Avatar from "../components/ui/Avatar.jsx";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loader from "../components/ui/Loader.jsx";
import StatCard from "../components/ui/StatCard.jsx";

export default function Home() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [leaderboard, setLeaderboard] = useState(null);
  const [leaderboardError, setLeaderboardError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    dashboardService
      .getMyDashboard()
      .then((result) => {
        if (active) {
          setDashboard(result);
          setDashboardError("");
        }
      })
      .catch((err) => {
        if (active) {
          setDashboard(null);
          setDashboardError(err.message || "Could not load your dashboard.");
        }
      });

    return () => {
      active = false;
    };
  }, [user, reloadKey]);

  useEffect(() => {
    let active = true;

    leaderboardService
      .getLeaderboard()
      .then((result) => {
        if (active) {
          setLeaderboard(result.leaderboard ?? []);
          setLeaderboardError("");
        }
      })
      .catch((err) => {
        if (active) {
          setLeaderboard(null);
          setLeaderboardError(err.message || "Leaderboard unavailable.");
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  function reload() {
    setDashboard(null);
    setDashboardError("");
    setLeaderboard(null);
    setLeaderboardError("");
    setReloadKey((key) => key + 1);
  }

  const loadingDashboard = dashboard === null && !dashboardError;
  const stats = dashboard?.stats ?? null;
  const upcoming = dashboard?.upcomingMatches ?? [];
  const recentActivity = dashboard?.recentPredictions ?? [];
  const rank = dashboard?.rank ?? null;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Good to see you,{" "}
            <span className="text-brand">{user?.name?.split(" ")[0] || "player"}</span>
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Keep your predictions on track for the next matchday.
          </p>
        </div>

        <Link
          to="/matches"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-pitch transition hover:bg-brand-hover"
        >
          Make a prediction
          <ArrowRight size={16} />
        </Link>
      </div>

      {!loadingDashboard && dashboardError && (
        <ErrorMessage
          className="mb-6"
          message={dashboardError}
          onRetry={reload}
        />
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={Crosshair}
          label="Predictions"
          value={loadingDashboard ? "—" : (stats?.total ?? 0)}
        />
        <StatCard
          icon={Target}
          label="Correct"
          value={loadingDashboard ? "—" : (stats?.correct ?? 0)}
          hint={stats?.resolved ? `${stats.resolved} resolved` : "Pending"}
        />
        <StatCard
          icon={Percent}
          label="Accuracy"
          value={
            loadingDashboard
              ? "—"
              : stats?.accuracy === null
                ? "—"
                : `${stats.accuracy}%`
          }
          hint={stats?.resolved ? "Resolved predictions" : "No results yet"}
        />
        <StatCard
          icon={Trophy}
          label="Points"
          value={loadingDashboard ? "—" : formatPoints(stats?.points ?? 0)}
          hint={
            rank ? `Rank #${rank} on the leaderboard` : "On the leaderboard"
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">
              Upcoming matches
            </h2>
            <Link
              to="/matches"
              className="text-sm font-semibold text-brand transition hover:text-brand-hover"
            >
              View all
            </Link>
          </div>

          {loadingDashboard ? (
            <div className="flex justify-center py-10 text-brand">
              <Loader className="h-6 w-6" />
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((match) => (
                <Link
                  key={match.id}
                  to={`/matches?q=${encodeURIComponent(match.home_team)}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-pitch p-3 transition hover:border-brand/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-bold">
                    {match.home_team.slice(0, 3).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1 truncate text-sm font-medium">
                    <p className="truncate">
                      {match.home_team}
                      <span className="mx-1 text-text-secondary">vs</span>
                      {match.away_team}
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {formatKickoff(match.kickoff_at)}
                    </p>
                  </div>
                  <ArrowRight size={15} className="shrink-0 text-text-secondary" />
                </Link>
              ))}

              {!upcoming.length && (
                <EmptyState
                  icon={CalendarDays}
                  title="No upcoming matches"
                  description="New fixtures will appear here as soon as they are added."
                />
              )}
            </div>
          )}
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">
              Recent predictions
            </h2>
            <Link
              to="/predictions"
              className="text-sm font-semibold text-brand transition hover:text-brand-hover"
            >
              View all
            </Link>
          </div>

          {loadingDashboard && (
            <div className="flex justify-center py-10 text-brand">
              <Loader className="h-6 w-6" />
            </div>
          )}

          {!loadingDashboard && !dashboardError && recentActivity.length === 0 && (
            <EmptyState
              icon={Crosshair}
              title="No predictions yet"
              description="Head over to Matches and make your first call before kickoff."
            />
          )}

          {!loadingDashboard && !dashboardError && recentActivity.length > 0 && (
            <div className="space-y-3">
              {recentActivity.map((prediction) => (
                <div
                  key={prediction.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-pitch p-3"
                >
                  <div className="min-w-0 grow basis-full sm:basis-0">
                    <p className="truncate text-sm font-medium">
                      {prediction.home_team}
                      <span className="mx-1 text-text-secondary">vs</span>
                      {prediction.away_team}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-text-secondary">
                      {prediction.competition}
                    </p>
                  </div>
                  <div className="ml-auto flex shrink-0 items-center gap-x-3">
                    <span className="font-display text-sm font-bold">
                      {prediction.predicted_home_score}
                      <span className="mx-1 text-text-secondary">–</span>
                      {prediction.predicted_away_score}
                    </span>
                    <Badge variant={STATUS_VARIANTS[prediction.status]}>
                      {prediction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold">Leaderboard</h2>
          <Link
            to="/leaderboard"
            className="text-sm font-semibold text-brand transition hover:text-brand-hover"
          >
            View all
          </Link>
        </div>

        {leaderboardError ? (
          <ErrorMessage message={leaderboardError} />
        ) : (
          <div>
            {leaderboard === null && !leaderboardError && (
              <div className="flex justify-center py-10 text-brand">
                <Loader className="h-6 w-6" />
              </div>
            )}

            {leaderboard !== null && leaderboard.length === 0 && (
              <EmptyState
                icon={Trophy}
                title="The leaderboard is empty"
                description="Points start counting once predictions are scored."
              />
            )}

            {leaderboard !== null && leaderboard.length > 0 && (
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${
                      entry.user_id === user.id
                        ? "border-brand/40 bg-brand/10"
                        : "border-white/10 bg-pitch"
                    }`}
                  >
                    <span className="w-6 shrink-0 text-center font-display text-sm font-bold text-text-secondary">
                      {entry.rank}
                    </span>
                    <Avatar name={entry.name} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {entry.name}
                      {entry.user_id === user.id && (
                        <span className="ml-2 text-xs font-semibold text-brand">
                          You
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 font-display text-sm font-bold text-brand">
                      {formatPoints(entry.total_points)} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}