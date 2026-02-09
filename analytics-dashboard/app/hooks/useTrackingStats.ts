import { useState, useCallback, useEffect, useRef } from "react";
import { useSSE } from "./useSSE";
import { fetchStatsClient, getStatsStreamUrl } from "~/services/tracking-client";
import type { AggregatedStats, LiveInteractionEvent, ComponentStats } from "~/lib/tracking-types";

const MAX_FEED_ITEMS = 50;
const REFRESH_INTERVAL_MS = 10_000;

function updateByComponent(prev: ComponentStats[], componentName: string, variant: string): ComponentStats[] {
  const existing = prev.find((c) => c.componentName === componentName);
  if (existing) {
    const variantExists = existing.variants.find((v) => v.variant === variant);
    return prev.map((c) =>
      c.componentName === componentName
        ? {
            ...c,
            total: c.total + 1,
            variants: variantExists
              ? c.variants.map((v) => (v.variant === variant ? { ...v, count: v.count + 1 } : v))
              : [...c.variants, { variant, count: 1 }],
          }
        : c,
    );
  }
  return [...prev, { componentName, total: 1, variants: [{ variant, count: 1 }] }];
}

export function useTrackingStats(
  initialStats: AggregatedStats,
  trackingUrl: string,
) {
  const [stats, setStats] = useState<AggregatedStats>(initialStats);
  const [activityFeed, setActivityFeed] = useState<LiveInteractionEvent[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Full stats refresh from the SSE initial snapshot
  const handleMessage = useCallback((data: unknown) => {
    const d = data as AggregatedStats;
    if (d?.summary) setStats(d);
  }, []);

  // Individual interaction event — update all sections optimistically
  const handleEvent = useCallback((_name: string, data: unknown) => {
    const event = data as LiveInteractionEvent;
    if (!event?.componentName) return;

    setActivityFeed((prev) => [event, ...prev].slice(0, MAX_FEED_ITEMS));
    setLiveCount((c) => c + 1);

    setStats((prev) => ({
      ...prev,
      summary: {
        ...prev.summary,
        totalInteractions: prev.summary.totalInteractions + 1,
        interactionsLastHour: prev.summary.interactionsLastHour + 1,
        interactionsLast24h: prev.summary.interactionsLast24h + 1,
      },
      byAction: {
        ...prev.byAction,
        [event.action]: (prev.byAction[event.action] || 0) + 1,
      },
      byComponent: updateByComponent(prev.byComponent, event.componentName, event.variant),
      byDevice: {
        ...prev.byDevice,
        desktop: prev.byDevice.desktop + 1,
      },
    }));
  }, []);

  const { connected } = useSSE({
    url: trackingUrl ? getStatsStreamUrl(trackingUrl) : "",
    onMessage: handleMessage,
    onEvent: handleEvent,
  });

  // Periodic full stats refresh for accurate chart data (timeline, etc.)
  useEffect(() => {
    if (!trackingUrl) return;

    refreshTimerRef.current = setInterval(async () => {
      const fresh = await fetchStatsClient(trackingUrl);
      if (fresh?.summary) setStats(fresh);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(refreshTimerRef.current);
  }, [trackingUrl]);

  return { stats, activityFeed, liveCount, connected };
}
