import { apiRequest } from "./api";

export const matchService = {
  getMatches(status = "upcoming") {
    return apiRequest(`/api/matches?status=${encodeURIComponent(status)}`);
  },

  getMatch(matchId) {
    return apiRequest(`/api/matches/${matchId}`);
  },
};