import { apiRequest } from "./api";

export const authService = {
  signup({ name, email, password }) {
    return apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login({ email, password }) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  me() {
    return apiRequest("/api/auth/me");
  },

  logout() {
    return apiRequest("/api/auth/logout", {
      method: "POST",
    });
  },
};
