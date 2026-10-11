import { apiRequest } from "./api";

export const userService = {
  getMe() {
    return apiRequest("/api/users/me");
  },
};