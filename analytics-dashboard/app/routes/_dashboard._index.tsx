import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { data } from "react-router";
import { requireAuth } from "~/services/auth-guard.server";
import { fetchStats } from "~/services/tracking.server";
import { getEnv } from "~/lib/api-client.server";
import { useTrackingStats } from "~/hooks/useTrackingStats";
import { useTrackEvent } from "~/hooks/useTrackEvent";
import { KpiCards } from "~/components/analytics/KpiCards";
import { InteractionCounter } from "~/components/analytics/InteractionCounter";
import { TimelineChart } from "~/components/analytics/TimelineChart";
import { ComponentBarChart } from "~/components/analytics/ComponentBarChart";
import { ActionPieChart } from "~/components/analytics/ActionPieChart";
import { DevicePieChart } from "~/components/analytics/DevicePieChart";
import { TopInteractionsTable } from "~/components/analytics/TopInteractionsTable";
import { ActivityFeed } from "~/components/analytics/ActivityFeed";
import { TestPlayground } from "~/components/analytics/TestPlayground";
import { ExportButtons } from "~/components/analytics/ExportButtons";

export const meta: MetaFunction = () => [{ title: "Dashboard | Analytics" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = await requireAuth(request);
  const initialStats = await fetchStats();
  const { TRACKING_SERVICE_PUBLIC_URL } = getEnv();

  return data(
    {
      initialStats,
      trackingUrl: TRACKING_SERVICE_PUBLIC_URL,
      accessToken: auth.accessToken,
    },
    auth.headers ? { headers: auth.headers } : undefined,
  );
}

export default function DashboardIndex() {
  const { initialStats, trackingUrl, accessToken } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const { stats, activityFeed, liveCount, connected } = useTrackingStats(initialStats, trackingUrl);
  const track = useTrackEvent(trackingUrl);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{t("analytics.title")}</h1>
          <p className="mt-1 text-sm text-text-tertiary">{t("analytics.subtitle")}</p>
        </div>
        <div className="flex items-center gap-4">
          <InteractionCounter connected={connected} liveCount={liveCount} total={stats.summary.totalInteractions} />
          <ExportButtons trackingUrl={trackingUrl} accessToken={accessToken} />
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards summary={stats.summary} />

      {/* Timeline */}
      <TimelineChart data={stats.timeline} />

      {/* Component bar chart */}
      <ComponentBarChart data={stats.byComponent} />

      {/* Action + Device pie charts side by side */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ActionPieChart data={stats.byAction} />
        <DevicePieChart data={stats.byDevice} />
      </div>

      {/* Table + Feed row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopInteractionsTable data={stats.topInteractions} />
        <ActivityFeed events={activityFeed} />
      </div>

      {/* Playground */}
      <TestPlayground onTrack={track} />
    </div>
  );
}
