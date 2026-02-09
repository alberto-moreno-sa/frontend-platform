import { useTranslation } from "react-i18next";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartCard } from "./ChartCard";
import type { ActionStats } from "~/lib/tracking-types";

const COLORS = [
  "var(--color-brand-600)",
  "var(--color-brand-400)",
  "var(--color-brand-300)",
  "var(--color-brand-200)",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#ddd6fe",
];

interface ActionPieChartProps {
  data: ActionStats;
}

export function ActionPieChart({ data }: ActionPieChartProps) {
  const { t } = useTranslation();

  const chartData = Object.entries(data)
    .map(([name, value], idx) => ({ name, value, fill: COLORS[idx % COLORS.length] }))
    .sort((a, b) => b.value - a.value);

  return (
    <ChartCard title={t("analytics.charts.byAction")} description={t("analytics.charts.byActionDesc")}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2} />
            <Tooltip />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
