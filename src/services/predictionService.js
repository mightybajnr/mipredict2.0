import { apiRequest } from "./api";

export const predictionService = {
  getMyPredictions(status = "all") {
    return apiRequest(`/api/predictions/me?status=${encodeURIComponent(status)}`);
  },

  getMyMatchPrediction(matchId) {
    return apiRequest(`/api/matches/${matchId}/predictions/me`);
  },

  submitPrediction(matchId, homeScore, awayScore) {
    return apiRequest(`/api/matches/${matchId}/predictions`, {
      method: "POST",
      body: JSON.stringify({
        predicted_home_score: Number(homeScore),
        predicted_away_score: Number(awayScore),
      }),
    });
  },
};