import { getEnv } from "~/lib/api-client.server";
import { TRACKING_ENDPOINTS } from "~/lib/api-endpoints";
import { logger } from "~/lib/logger.server";
import type { AggregatedStats } from "~/lib/tracking-types";
import { EMPTY_STATS } from "~/lib/tracking-types";

const log = logger.child({ component: "tracking" });

function getTrackingUrl() {
  return getEnv().TRACKING_SERVICE_URL;
}

export async function fetchStats(): Promise<AggregatedStats> {
  try {
    const res = await fetch(`${getTrackingUrl()}${TRACKING_ENDPOINTS.stats}`);
    if (!res.ok) {
      log.warn({ status: res.status }, "Failed to fetch stats, returning empty");
      return EMPTY_STATS;
    }
    return (await res.json()) as AggregatedStats;
  } catch (error) {
    log.warn({ err: error }, "Stats fetch error, returning empty");
    return EMPTY_STATS;
  }
}
