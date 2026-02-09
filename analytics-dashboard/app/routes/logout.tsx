import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSessionData, destroyUserSession } from "~/services/session.server";
import { logoutApi } from "~/services/auth.server";
import { logger } from "~/lib/logger.server";

const log = logger.child({ component: "logout-action" });

export async function action({ request }: ActionFunctionArgs) {
  const sessionData = await getSessionData(request);

  if (sessionData) {
    try {
      await logoutApi(sessionData.accessToken);
    } catch (error) {
      log.warn({ err: error }, "Logout API call failed, destroying session anyway");
    }
  }

  log.info("User logged out");
  return destroyUserSession(request);
}

// GET /logout redirects to login
export function loader() {
  return redirect("/login");
}
