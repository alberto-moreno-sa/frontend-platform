import { useTranslation } from "react-i18next";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "./ChartCard";
import type { TimelineEntry } from "~/lib/tracking-types";

interface TimelineChartProps {
  data: TimelineEntry[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const { t } = useTranslation();

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.hour).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <ChartCard title={t("analytics.charts.timeline")} description={t("analytics.charts.timelineDesc")}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-600)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-brand-600)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="var(--color-brand-600)" fill="url(#colorCount)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
