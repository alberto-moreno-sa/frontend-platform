import { renderHook, act } from "@testing-library/react";
import { useTrackingStats } from "./useTrackingStats";
import { EMPTY_STATS } from "~/lib/tracking-types";
import type { AggregatedStats } from "~/lib/tracking-types";

jest.mock("~/services/tracking-client", () => ({
  fetchStatsClient: jest.fn(),
  getStatsStreamUrl: jest.fn((url: string) => `${url}/api/components/stats/stream`),
}));

jest.mock("./useSSE", () => ({
  useSSE: jest.fn(() => ({ connected: true })),
}));

import { fetchStatsClient } from "~/services/tracking-client";
import { useSSE } from "./useSSE";

const mockStats: AggregatedStats = {
  ...EMPTY_STATS,
  summary: { ...EMPTY_STATS.summary, totalInteractions: 100 },
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useTrackingStats", () => {
  it("returns initial stats", () => {
    const { result } = renderHook(() => useTrackingStats(mockStats, "http://localhost:3002"));
    expect(result.current.stats.summary.totalInteractions).toBe(100);
  });

  it("returns connected status from useSSE", () => {
    const { result } = renderHook(() => useTrackingStats(mockStats, "http://localhost:3002"));
    expect(result.current.connected).toBe(true);
  });

  it("initializes empty activity feed and zero live count", () => {
    const { result } = renderHook(() => useTrackingStats(mockStats, "http://localhost:3002"));
    expect(result.current.activityFeed).toEqual([]);
    expect(result.current.liveCount).toBe(0);
  });

  it("passes correct SSE URL from getStatsStreamUrl", () => {
    renderHook(() => useTrackingStats(mockStats, "http://localhost:3002"));
    expect(useSSE).toHaveBeenCalledWith(
      expect.objectContaining({ url: "http://localhost:3002/api/components/stats/stream" }),
    );
  });

  it("refreshes stats periodically", async () => {
    const freshStats = { ...mockStats, summary: { ...mockStats.summary, totalInteractions: 200 } };
    (fetchStatsClient as jest.Mock).mockResolvedValue(freshStats);

    const { result } = renderHook(() => useTrackingStats(mockStats, "http://localhost:3002"));

    await act(async () => {
      jest.advanceTimersByTime(10_000);
    });

    expect(fetchStatsClient).toHaveBeenCalledWith("http://localhost:3002");
    expect(result.current.stats.summary.totalInteractions).toBe(200);
  });

  it("handles SSE message callback (full stats refresh)", () => {
    let capturedOnMessage: ((data: unknown) => void) | undefined;
    (useSSE as jest.Mock).mockImplementation((opts: { onMessage: (data: unknown) => void }) => {
      capturedOnMessage = opts.onMessage;
      return { connected: true };
    });

    const { result } = renderHook(() => useTrackingStats(mockStats, "http://localhost:3002"));

    const updatedStats = { ...mockStats, summary: { ...mockStats.summary, totalInteractions: 500 } };
    act(() => {
      capturedOnMessage?.(updatedStats);
    });

    expect(result.current.stats.summary.totalInteractions).toBe(500);
  });

  it("handles SSE event callback (single interaction)", () => {
    let capturedOnEvent: ((name: string, data: unknown) => void) | undefined;
    (useSSE as jest.Mock).mockImplementation((opts: { onEvent: (name: string, data: unknown) => void }) => {
      capturedOnEvent = opts.onEvent;
      return { connected: true };
    });

    const { result } = renderHook(() => useTrackingStats(mockStats, "http://localhost:3002"));

    act(() => {
      capturedOnEvent?.("interaction", {
        componentName: "Button",
        variant: "primary",
        action: "click",
        pageUrl: "/",
        timestamp: "2026-01-01T00:00:00Z",
      });
    });

    expect(result.current.liveCount).toBe(1);
    expect(result.current.activityFeed).toHaveLength(1);
    expect(result.current.stats.summary.totalInteractions).toBe(101);
  });
});
