import { Outlet } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSessionData } from "~/services/session.server";

// If user is already logged in, redirect to dashboard
export async function loader({ request }: LoaderFunctionArgs) {
  const sessionData = await getSessionData(request);
  if (sessionData) {
    throw redirect("/");
  }
  return null;
}

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-[360px]">
        <Outlet />
      </div>
    </div>
  );
}
