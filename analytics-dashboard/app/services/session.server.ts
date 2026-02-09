import { createCookieSessionStorage, redirect } from "react-router";
import { getEnv } from "~/lib/api-client.server";
import { logger } from "~/lib/logger.server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "~/lib/constants";
import type { SessionData } from "~/lib/types";

const log = logger.child({ component: "session" });

const env = getEnv();

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function createUserSession(data: SessionData, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("accessToken", data.accessToken);
  session.set("refreshToken", data.refreshToken);
  session.set("expiresAt", data.expiresAt);
  session.set("user", data.user);

  log.debug({ userId: data.user.id, redirectTo }, "Creating user session");
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function destroyUserSession(request: Request) {
  const session = await getSession(request);
  log.debug("Destroying user session");
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getSessionData(request: Request): Promise<SessionData | null> {
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken) return null;

  return {
    accessToken: session.get("accessToken"),
    refreshToken: session.get("refreshToken"),
    expiresAt: session.get("expiresAt"),
    user: session.get("user"),
  };
}
