import { useTranslation } from "react-i18next";
import { Badge } from "@ui-kit/react";
import { ChartCard } from "./ChartCard";
import type { LiveInteractionEvent } from "~/lib/tracking-types";

const ACTION_INTENT: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  click: "default",
  submit: "success",
  hover: "secondary",
  focus: "warning",
  blur: "secondary",
  view: "default",
  change: "success",
  scroll: "secondary",
};

interface ActivityFeedProps {
  events: LiveInteractionEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const { t } = useTranslation();

  return (
    <ChartCard title={t("analytics.feed.title")} description={t("analytics.feed.description")}>
      <div className="h-72 overflow-y-auto">
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-quaternary">{t("analytics.feed.empty")}</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event, idx) => (
              <li key={idx} className="flex items-center gap-2 rounded-md border border-border-secondary px-3 py-2 text-sm">
                <Badge intent={ACTION_INTENT[event.action] ?? "default"} size="small">
                  {event.action}
                </Badge>
                <span className="font-medium text-text-primary">{event.componentName}</span>
                <span className="text-text-tertiary">.{event.variant}</span>
                <span className="ml-auto text-xs text-text-quaternary">{t("analytics.feed.justNow")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ChartCard>
  );
}
