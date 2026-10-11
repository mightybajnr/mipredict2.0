import { Link } from "react-router-dom";
import { CalendarDays, Trophy } from "lucide-react";

import Badge from "../ui/Badge.jsx";
import { formatKickoff } from "../../utils/formatDate.js";
import { getInitials } from "../../utils/initials.js";
import { STATUS_VARIANTS } from "../../utils/matchStatus.js";
import PredictionForm from "./PredictionForm.jsx";

function TeamCrest({ name }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:h-16 sm:w-16">
      <span className="font-display text-lg font-bold sm:text-2xl">
        {getInitials(name)}
      </span>
    </span>
  );
}

function TeamBlock({ name }) {
  return (
    <div className="min-w-0 text-center">
      <div className="mx-auto flex w-fit">
        <TeamCrest name={name} />
      </div>
      <p className="mt-3 truncate text-sm font-semibold sm:text-base">{name}</p>
    </div>
  );
}

export default function MatchCard({
  match,
  prediction,
  user,
  locked,
  submitting,
  onSubmit,
}) {
  const finished = match.status === "finished";
  const live = match.status === "live";
  const hasScore = match.home_score !== null && match.away_score !== null;

  return (
    <article className="rounded-2xl border border-white/10 bg-surface p-5 transition hover:border-white/15 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
          <Trophy size={15} className="shrink-0 text-brand" />
          <span className="truncate">{match.competition}</span>
        </span>

        <Badge variant={STATUS_VARIANTS[match.status]}>
          {match.status}
        </Badge>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock name={match.home_team} />
        <span className="text-xs font-bold text-text-secondary sm:text-sm">
          VS
        </span>
        <TeamBlock name={match.away_team} />
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-secondary sm:text-sm">
        <CalendarDays size={14} className="shrink-0" />
        {formatKickoff(match.kickoff_at)}
      </p>

      {finished && hasScore && (
        <p className="mt-3 text-center font-display text-lg font-bold text-brand">
          Full time: {match.home_score} – {match.away_score}
        </p>
      )}

      {live && hasScore && (
        <p className="mt-3 text-center font-display text-lg font-bold text-danger">
          Live: {match.home_score} – {match.away_score}
        </p>
      )}

      {user ? (
        <PredictionForm
          key={prediction?.id ?? `match-${match.id}`}
          homeTeam={match.home_team}
          awayTeam={match.away_team}
          prediction={prediction}
          locked={locked}
          submitting={submitting}
          onSubmit={(home, away) => onSubmit(home, away)}
        />
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-white/15 p-4 text-center">
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
    </article>
  );
}