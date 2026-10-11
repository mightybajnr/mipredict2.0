import Avatar from "../ui/Avatar.jsx";
import { formatPoints, formatPercent } from "../../utils/formatPoints.js";

const GRID =
  "grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[2.5rem_1fr_6rem_6rem_6rem]";

export default function LeaderboardTable({ entries = [], currentUserId }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
      <div
        className={`${GRID} border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary`}
      >
        <span>#</span>
        <span>Player</span>
        <span className="hidden text-center sm:block">Correct</span>
        <span className="hidden text-center sm:block">Accuracy</span>
        <span className="text-right">Points</span>
      </div>

      <div className="divide-y divide-white/5">
        {entries.map((entry) => {
          const isYou = entry.user_id === currentUserId;

          return (
            <div
              key={entry.user_id}
              className={`${GRID} px-4 py-3 ${
                isYou ? "bg-brand/10" : ""
              }`}
            >
              <span className="font-display text-sm font-bold text-text-secondary">
                {entry.rank}
              </span>

              <span className="flex min-w-0 items-center gap-3">
                <Avatar name={entry.name} size="sm" />
                <span className="truncate text-sm font-medium">
                  {entry.name}
                  {isYou && (
                    <span className="ml-2 text-xs font-semibold text-brand">
                      You
                    </span>
                  )}
                </span>
              </span>

              <span className="hidden text-center text-sm text-text-secondary sm:block">
                {entry.correct_predictions}
              </span>
              <span className="hidden text-center text-sm text-text-secondary sm:block">
                {formatPercent(entry.accuracy)}
              </span>
              <span className="text-right font-display text-sm font-bold text-brand">
                {formatPoints(entry.total_points)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}