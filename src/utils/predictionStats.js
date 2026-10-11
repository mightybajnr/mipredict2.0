export function computePredictionStats(predictions = []) {
  let resolved = 0;
  let correct = 0;
  let points = 0;

  for (const prediction of predictions) {
    points += Number(prediction.points) || 0;

    if (prediction.status === "finished") {
      resolved += 1;

      const predictedCorrect =
        Number(prediction.predicted_home_score) ===
          Number(prediction.home_score) &&
        Number(prediction.predicted_away_score) ===
          Number(prediction.away_score);

      if (predictedCorrect) correct += 1;
    }
  }

  return {
    total: predictions.length,
    resolved,
    correct,
    accuracy: resolved ? Math.round((correct / resolved) * 100) : null,
    points,
  };
}

export function isPredictionCorrect(prediction) {
  return (
    prediction.status === "finished" &&
    Number(prediction.predicted_home_score) === Number(prediction.home_score) &&
    Number(prediction.predicted_away_score) === Number(prediction.away_score)
  );
}