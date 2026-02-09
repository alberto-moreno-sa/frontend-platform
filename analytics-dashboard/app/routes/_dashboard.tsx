import { Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { requireAuth } from "~/services/auth-guard.server";
import { DashboardShell } from "~/components/layout/DashboardShell";

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = await requireAuth(request);

  return data({ user: auth.user }, auth.headers ? { headers: auth.headers } : undefined);
}

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <DashboardShell user={user}>
      <Outlet />
    </DashboardShell>
  );
}
