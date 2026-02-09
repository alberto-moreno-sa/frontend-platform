import { useTranslation } from "react-i18next";
import { ChartCard } from "./ChartCard";
import type { TopInteraction } from "~/lib/tracking-types";

interface TopInteractionsTableProps {
  data: TopInteraction[];
}

export function TopInteractionsTable({ data }: TopInteractionsTableProps) {
  const { t } = useTranslation();

  return (
    <ChartCard title={t("analytics.table.topInteractions")} description={t("analytics.table.topInteractionsDesc")}>
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-secondary text-xs font-medium uppercase tracking-wider text-text-tertiary">
              <th className="px-2 pb-2">{t("analytics.table.component")}</th>
              <th className="px-2 pb-2">{t("analytics.table.variant")}</th>
              <th className="px-2 pb-2">{t("analytics.table.action")}</th>
              <th className="px-2 pb-2 text-right">{t("analytics.table.count")}</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-2 py-6 text-center text-sm text-text-quaternary">
                  {t("analytics.table.noData")}
                </td>
              </tr>
            ) : (
              data.slice(0, 10).map((item, idx) => (
                <tr key={idx} className="border-b border-border-secondary last:border-0">
                  <td className="px-2 py-2 font-medium text-text-primary">{item.componentName}</td>
                  <td className="px-2 py-2 text-text-secondary">{item.variant}</td>
                  <td className="px-2 py-2 text-text-secondary">{item.action}</td>
                  <td className="px-2 py-2 text-right font-mono text-text-primary">{item.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
