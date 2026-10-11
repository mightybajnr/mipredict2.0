import { apiRequest } from "./api";

export const dashboardService = {
  getMyDashboard() {
    return apiRequest("/api/dashboard/me");
  },
};