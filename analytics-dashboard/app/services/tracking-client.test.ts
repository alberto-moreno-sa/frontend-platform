import { trackEvent, fetchStatsClient, getStatsStreamUrl, fetchExportClient } from "./tracking-client";
import { TRACKING_ENDPOINTS } from "~/lib/api-endpoints";

const BASE = "http://localhost:3002";

beforeEach(() => {
  jest.restoreAllMocks();
  globalThis.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
});

describe("trackEvent", () => {
  it("sends POST to the track endpoint", () => {
    const payload = { componentName: "Button", variant: "primary", action: "click" } as never;
    trackEvent(BASE, payload);

    expect(fetch).toHaveBeenCalledWith(
      `${BASE}${TRACKING_ENDPOINTS.track}`,
      expect.objectContaining({ method: "POST", headers: { "Content-Type": "application/json" } }),
    );
  });

  it("serializes payload as JSON body", () => {
    const payload = { componentName: "Input", variant: "default", action: "focus" } as never;
    trackEvent(BASE, payload);

    const call = (fetch as jest.Mock).mock.calls[0][1];
    expect(JSON.parse(call.body)).toMatchObject({ componentName: "Input", action: "focus" });
  });

  it("does not throw on fetch failure", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("network"));
    expect(() => trackEvent(BASE, {} as never)).not.toThrow();
  });
});

describe("fetchStatsClient", () => {
  it("fetches from the stats endpoint", async () => {
    const stats = { summary: { totalInteractions: 10 } };
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve(stats) });

    const result = await fetchStatsClient(BASE);
    expect(fetch).toHaveBeenCalledWith(`${BASE}${TRACKING_ENDPOINTS.stats}`);
    expect(result).toEqual(stats);
  });

  it("returns null on non-ok response", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    expect(await fetchStatsClient(BASE)).toBeNull();
  });

  it("returns null on fetch error", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("network"));
    expect(await fetchStatsClient(BASE)).toBeNull();
  });
});

describe("getStatsStreamUrl", () => {
  it("returns the SSE stream URL", () => {
    expect(getStatsStreamUrl(BASE)).toBe(`${BASE}${TRACKING_ENDPOINTS.statsStream}`);
  });
});

describe("fetchExportClient", () => {
  it("fetches from the export endpoint with auth header", async () => {
    await fetchExportClient(BASE, "my-token", "format=csv");

    expect(fetch).toHaveBeenCalledWith(
      `${BASE}${TRACKING_ENDPOINTS.export}?format=csv`,
      { headers: { Authorization: "Bearer my-token" } },
    );
  });

  it("includes from/to params when provided", async () => {
    await fetchExportClient(BASE, "tk", "format=json&from=2026-01-01T00:00:00.000Z");

    const url = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain("format=json");
    expect(url).toContain("from=2026-01-01T00:00:00.000Z");
  });
});
