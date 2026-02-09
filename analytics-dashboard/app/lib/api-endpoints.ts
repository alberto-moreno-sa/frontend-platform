// ── Auth service endpoints (server-side only) ───────────────

export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  refresh: "/api/auth/refresh",
  logout: "/api/auth/logout",
} as const;

// ── Tracking service endpoints ───────────────────────────────

export const TRACKING_ENDPOINTS = {
  track: "/api/components/track",
  stats: "/api/components/stats",
  statsStream: "/api/components/stats/stream",
  export: "/api/components/export",
} as const;
