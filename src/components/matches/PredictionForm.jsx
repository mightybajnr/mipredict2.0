import { useState } from "react";

import Button from "../ui/Button.jsx";

function parseScore(value) {
  if (value === "") return null;

  const score = Number(value);

  if (!Number.isInteger(score) || score < 0 || score > 99) return null;

  return score;
}

export default function PredictionForm({
  homeTeam,
  awayTeam,
  prediction,
  locked,
  submitting,
  onSubmit,
}) {
  const [home, setHome] = useState(
    prediction ? String(prediction.predicted_home_score) : ""
  );
  const [away, setAway] = useState(
    prediction ? String(prediction.predicted_away_score) : ""
  );
  const [error, setError] = useState("");

  const disabled = locked || submitting;

  function handleSubmit(event) {
    event.preventDefault();

    const homeScore = parseScore(home);
    const awayScore = parseScore(away);

    if (homeScore === null || awayScore === null) {
      setError("Enter valid scores between 0 and 99.");
      return;
    }

    setError("");
    onSubmit(homeScore, awayScore);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 border-t border-white/10 pt-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">Your prediction</span>
        {locked && (
          <span className="text-xs text-text-secondary">Locked</span>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <input
          aria-label={`Predicted score for ${homeTeam}`}
          type="number"
          min="0"
          max="99"
          step="1"
          inputMode="numeric"
          disabled={disabled}
          value={home}
          onChange={(event) => setHome(event.target.value)}
          className="w-20 rounded-xl border border-white/10 bg-pitch p-3 text-center text-lg text-text-primary outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="font-bold text-text-secondary">–</span>
        <input
          aria-label={`Predicted score for ${awayTeam}`}
          type="number"
          min="0"
          max="99"
          step="1"
          inputMode="numeric"
          disabled={disabled}
          value={away}
          onChange={(event) => setAway(event.target.value)}
          className="w-20 rounded-xl border border-white/10 bg-pitch p-3 text-center text-lg text-text-primary outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-danger">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="mt-4 w-full"
        loading={submitting}
        disabled={locked}
      >
        {locked
          ? "Predictions closed"
          : prediction
            ? "Update prediction"
            : "Submit prediction"}
      </Button>
    </form>
  );
}
