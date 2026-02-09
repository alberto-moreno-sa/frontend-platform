import { useTranslation } from "react-i18next";

interface InteractionCounterProps {
  connected: boolean;
  liveCount: number;
  total: number;
}

export function InteractionCounter({ connected, liveCount, total }: InteractionCounterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${connected ? "animate-pulse bg-green-500" : "bg-red-500"}`} />
        <span className="text-xs font-medium text-text-tertiary">
          {connected ? t("analytics.counter.live") : t("analytics.counter.disconnected")}
        </span>
      </div>
      {liveCount > 0 && (
        <span className="text-xs font-medium text-brand-600">+{liveCount} {t("analytics.counter.live")}</span>
      )}
      <span className="text-xs text-text-quaternary">
        {t("analytics.counter.total")}: {total.toLocaleString()}
      </span>
    </div>
  );
}
