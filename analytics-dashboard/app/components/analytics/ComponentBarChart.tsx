import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "./ChartCard";
import type { ComponentStats } from "~/lib/tracking-types";

interface ComponentBarChartProps {
  data: ComponentStats[];
}

export function ComponentBarChart({ data }: ComponentBarChartProps) {
  const { t } = useTranslation();

  return (
    <ChartCard title={t("analytics.charts.byComponent")} description={t("analytics.charts.byComponentDesc")}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis dataKey="componentName" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
            <Tooltip />
            <Bar dataKey="total" fill="var(--color-brand-600)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
