// ── Auth user types ──────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

// ── API request types ────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// ── API response types ───────────────────────────────────────

export interface AuthSuccessResponse {
  success: true;
  data: {
    user: AuthUser;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export interface RefreshSuccessResponse {
  success: true;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

// ── Session types ────────────────────────────────────────────

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: SessionUser;
}

export interface AuthResult extends SessionData {
  headers?: HeadersInit;
}
