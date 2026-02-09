import { TRACKING_ENDPOINTS } from "~/lib/api-endpoints";
import type { TrackEventPayload, AggregatedStats } from "~/lib/tracking-types";

export function trackEvent(trackingUrl: string, payload: TrackEventPayload): void {
  fetch(`${trackingUrl}${TRACKING_ENDPOINTS.track}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => { /* fire-and-forget */ });
}

export async function fetchStatsClient(trackingUrl: string): Promise<AggregatedStats | null> {
  try {
    const res = await fetch(`${trackingUrl}${TRACKING_ENDPOINTS.stats}`);
    if (!res.ok) return null;
    return (await res.json()) as AggregatedStats;
  } catch {
    return null;
  }
}

export function getStatsStreamUrl(trackingUrl: string): string {
  return `${trackingUrl}${TRACKING_ENDPOINTS.statsStream}`;
}

export async function fetchExportClient(
  trackingUrl: string,
  accessToken: string,
  query: string,
): Promise<Response> {
  return fetch(`${trackingUrl}${TRACKING_ENDPOINTS.export}?${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
