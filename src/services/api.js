const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// The CSRF token lives in memory, never in localStorage/sessionStorage.
// It is seeded from the JSON body returned by the API (GET /api/csrf-token
// and GET /api/auth/me). We deliberately do NOT read document.cookie: on a
// cross-origin deployment (mipredict.com vs api.mipredict.com) the XSRF-TOKEN
// cookie belongs to the API host and cannot be read by the frontend, and a
// stale parent-domain cookie could otherwise be mistaken for the real token.
let csrfTokenCache = "";
let csrfRefreshPromise = null;

function getCsrfToken() {
  return csrfTokenCache;
}

function setCsrfToken(value) {
  if (value && typeof value === "string") {
    csrfTokenCache = value;
  }
}

// Uncached bootstrap. The cache-buster query plus cache: "no-store" ensure a
// CDN/proxy can never serve a previously cached token (which would no longer
// match this client's own Set-Cookie and cause a permanent CSRF failure).
async function bootstrapCsrfToken() {
  const response = await fetch(
    `${API_BASE_URL}/api/csrf-token?_=${Date.now()}`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => ({}));
  setCsrfToken(data?.csrfToken);
  return data?.csrfToken ?? "";
}

function ensureCsrfToken() {
  if (getCsrfToken()) return Promise.resolve(getCsrfToken());

  if (!csrfRefreshPromise) {
    csrfRefreshPromise = bootstrapCsrfToken().finally(() => {
      csrfRefreshPromise = null;
    });
  }

  return csrfRefreshPromise;
}

async function sendRequest(path, { method, headers, body }) {
  return fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    cache: "no-store",
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
  // session operations. If another tab rotated it (or a proxy served a stale
  // token), fetch an uncached token and retry once instead of failing.
  if (!response.ok && response.status === 403 && UNSAFE_METHODS.has(method)) {
    const freshToken = await bootstrapCsrfToken();
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