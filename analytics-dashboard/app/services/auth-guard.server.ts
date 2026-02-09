import { redirect } from "react-router";
import { getSessionData, getSession, sessionStorage } from "./session.server";
import { refreshApi, ApiError } from "./auth.server";
import { logger } from "~/lib/logger.server";
import { TOKEN_REFRESH_BUFFER } from "~/lib/constants";
import type { AuthResult } from "~/lib/types";

const log = logger.child({ component: "auth-guard" });

/**
 * Call from any protected route loader.
 * Returns session data (with potentially refreshed tokens) or throws a redirect to /login.
 */
export async function requireAuth(request: Request): Promise<AuthResult> {
  const sessionData = await getSessionData(request);

  if (!sessionData) {
    log.debug("No session data, redirecting to login");
    throw redirect("/login");
  }

  // Check if access token is about to expire
  const now = Math.floor(Date.now() / 1000);
  if (sessionData.expiresAt - now < TOKEN_REFRESH_BUFFER) {
    try {
      log.info("Access token expiring soon, refreshing");
      const refreshResult = await refreshApi(sessionData.refreshToken);
      const session = await getSession(request);

      session.set("accessToken", refreshResult.data.access_token);
      session.set("refreshToken", refreshResult.data.refresh_token);
      session.set("expiresAt", now + refreshResult.data.expires_in);

      log.info("Token refresh successful, session updated");
      return {
        ...sessionData,
        accessToken: refreshResult.data.access_token,
        refreshToken: refreshResult.data.refresh_token,
        expiresAt: now + refreshResult.data.expires_in,
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        log.warn({ code: error.code, status: error.status }, "Token refresh failed, destroying session");
        const session = await getSession(request);
        throw redirect("/login", {
          headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
          },
        });
      }
      throw error;
    }
  }

  return { ...sessionData, headers: undefined };
}
