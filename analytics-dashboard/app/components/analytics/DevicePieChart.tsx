import { useTranslation } from "react-i18next";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartCard } from "./ChartCard";
import type { DeviceStats } from "~/lib/tracking-types";

const COLORS = ["var(--color-brand-600)", "var(--color-brand-400)", "var(--color-brand-200)"];

interface DevicePieChartProps {
  data: DeviceStats;
}

export function DevicePieChart({ data }: DevicePieChartProps) {
  const { t } = useTranslation();

  const chartData = [
    { name: t("analytics.device.desktop"), value: data.desktop, fill: COLORS[0] },
    { name: t("analytics.device.mobile"), value: data.mobile, fill: COLORS[1] },
    { name: t("analytics.device.tablet"), value: data.tablet, fill: COLORS[2] },
  ].filter((d) => d.value > 0);

  return (
    <ChartCard title={t("analytics.charts.byDevice")} description={t("analytics.charts.byDeviceDesc")}>
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
