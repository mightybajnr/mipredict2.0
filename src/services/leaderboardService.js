import { apiRequest } from "./api";

export const leaderboardService = {
  getLeaderboard() {
    return apiRequest("/api/leaderboard");
  },

  getLeaderboardMe() {
    return apiRequest("/api/leaderboard/me");
  },
};