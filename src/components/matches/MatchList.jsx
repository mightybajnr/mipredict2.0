import MatchCard from "./MatchCard.jsx";

export default function MatchList({
  matches,
  predictionsByMatchId,
  user,
  submittingId,
  onSubmit,
}) {
  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          prediction={predictionsByMatchId[match.id]}
          user={user}
          locked={match.status !== "scheduled"}
          submitting={submittingId === match.id}
          onSubmit={(home, away) => onSubmit(match, home, away)}
        />
      ))}
    </div>
  );
}