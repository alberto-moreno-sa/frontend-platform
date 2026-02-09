import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@ui-kit/react";
import type { StatsSummary } from "~/lib/tracking-types";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

interface KpiCardProps {
  label: string;
  value: number;
}

function KpiCard({ label, value }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">{label}</p>
        <p className="mt-1 text-2xl font-bold text-text-primary">{formatNumber(value)}</p>
      </CardContent>
    </Card>
  );
}

interface KpiCardsProps {
  summary: StatsSummary;
}

export function KpiCards({ summary }: KpiCardsProps) {
  const { t } = useTranslation();

  const kpis = [
    { label: t("analytics.kpi.totalInteractions"), value: summary.totalInteractions },
    { label: t("analytics.kpi.uniqueSessions"), value: summary.uniqueSessions },
    { label: t("analytics.kpi.last24h"), value: summary.interactionsLast24h },
    { label: t("analytics.kpi.lastHour"), value: summary.interactionsLastHour },
    { label: t("analytics.kpi.avgPerSession"), value: Math.round(summary.avgInteractionsPerSession) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} />
      ))}
    </div>
  );
}
