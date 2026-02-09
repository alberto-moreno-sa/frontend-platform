import { fetchStats } from "./tracking.server";
import { EMPTY_STATS } from "~/lib/tracking-types";
import { TRACKING_ENDPOINTS } from "~/lib/api-endpoints";

beforeEach(() => {
  jest.restoreAllMocks();
  globalThis.fetch = jest.fn();
});

describe("fetchStats", () => {
  it("fetches from the stats endpoint and returns data", async () => {
    const stats = { summary: { totalInteractions: 42 }, byComponent: [], byAction: {}, byPage: [], byDevice: { mobile: 0, desktop: 0, tablet: 0 }, topInteractions: [], timeline: [], generatedAt: "2026-01-01" };
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve(stats) });

    const result = await fetchStats();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(TRACKING_ENDPOINTS.stats));
    expect(result).toEqual(stats);
  });

  it("returns EMPTY_STATS on non-ok response", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    expect(await fetchStats()).toEqual(EMPTY_STATS);
  });

  it("returns EMPTY_STATS on fetch error", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("network"));
    expect(await fetchStats()).toEqual(EMPTY_STATS);
  });
});
