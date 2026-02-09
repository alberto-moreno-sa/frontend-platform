import { getEnv, apiFetch, ApiError } from "~/lib/api-client.server";
import { AUTH_ENDPOINTS } from "~/lib/api-endpoints";
import { logger } from "~/lib/logger.server";
import type {
  LoginRequest,
  RegisterRequest,
  AuthSuccessResponse,
  RefreshSuccessResponse,
} from "~/lib/types";

const log = logger.child({ component: "auth" });
const env = getEnv();
const AUTH_URL = env.AUTH_SERVICE_URL;

export { ApiError };

export async function loginApi(data: LoginRequest): Promise<AuthSuccessResponse> {
  log.debug({ email: data.email }, "Login attempt");
  const result = await apiFetch<AuthSuccessResponse>(`${AUTH_URL}${AUTH_ENDPOINTS.login}`, {
    method: "POST",
    body: data,
  });
  log.info({ userId: result.data.user.id }, "Login successful");
  return result;
}

export async function registerApi(data: RegisterRequest): Promise<AuthSuccessResponse> {
  log.debug({ email: data.email }, "Register attempt");
  const result = await apiFetch<AuthSuccessResponse>(`${AUTH_URL}${AUTH_ENDPOINTS.register}`, {
    method: "POST",
    body: data,
  });
  log.info({ userId: result.data.user.id }, "Registration successful");
  return result;
}

export async function refreshApi(refreshToken: string): Promise<RefreshSuccessResponse> {
  log.debug("Token refresh attempt");
  const result = await apiFetch<RefreshSuccessResponse>(`${AUTH_URL}${AUTH_ENDPOINTS.refresh}`, {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  log.debug("Token refresh successful");
  return result;
}

export async function logoutApi(accessToken: string): Promise<void> {
  try {
    await fetch(`${AUTH_URL}${AUTH_ENDPOINTS.logout}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    log.info("Logout API call successful");
  } catch (error) {
    log.warn({ err: error }, "Logout API call failed, session destroyed locally");
  }
}
