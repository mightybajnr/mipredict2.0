import { apiRequest } from "./api";

export const matchService = {
  getMatches({ status = "upcoming", competition = "", page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams();
    params.set("status", status);

    if (competition) {
      params.set("competition", competition);
    }

    params.set("page", String(page));
    params.set("limit", String(limit));

    return apiRequest(`/api/matches?${params.toString()}`);
  },

  getMatch(matchId) {
    return apiRequest(`/api/matches/${matchId}`);
  },
};
