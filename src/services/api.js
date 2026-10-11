const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// The CSRF token lives in memory, never in localStorage/sessionStorage.
// It is seeded from the X-CSRF-Token value returned by the API (e.g. in
// GET /api/auth/me), which works even when the frontend and API are on
// different origins (mipredict.com vs api.mipredict.com), where
// document.cookie cannot be read by the frontend.
let csrfTokenCache = "";
let csrfRefreshPromise = null;

function getCsrfToken() {
  if (csrfTokenCache) return csrfTokenCache;

  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }

  return "";
}

function setCsrfToken(value) {
  if (value && typeof value === "string") {
    csrfTokenCache = value;
  }
}

async function refreshCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  setCsrfToken(data?.csrfToken);
  return data?.csrfToken ?? "";
}

function ensureCsrfToken() {
  if (getCsrfToken()) return Promise.resolve(getCsrfToken());

  if (!csrfRefreshPromise) {
    csrfRefreshPromise = refreshCsrfToken().finally(() => {
      csrfRefreshPromise = null;
    });
  }

  return csrfRefreshPromise;
}

async function sendRequest(path, { method, headers, body }) {
  return fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers,
    body,
  });
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (UNSAFE_METHODS.has(method)) {
    await ensureCsrfToken();
    const token = getCsrfToken();
    if (token) headers["X-CSRF-Token"] = token;
  }

  let response = await sendRequest(path, {
    method,
    headers,
    body: options.body,
  });

  let data = await response.json().catch(() => ({}));
  setCsrfToken(data?.csrfToken);

  // The server rotates the CSRF token on signup/login/logout and other
  // session operations. If another tab rotated it, retry once with the
  // freshly returned token instead of failing the request.
  if (!response.ok && response.status === 403 && UNSAFE_METHODS.has(method)) {
    const freshToken = await refreshCsrfToken();
    if (freshToken && freshToken !== headers["X-CSRF-Token"]) {
      headers["X-CSRF-Token"] = freshToken;
      response = await sendRequest(path, { method, headers, body: options.body });
      data = await response.json().catch(() => ({}));
      setCsrfToken(data?.csrfToken);
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}