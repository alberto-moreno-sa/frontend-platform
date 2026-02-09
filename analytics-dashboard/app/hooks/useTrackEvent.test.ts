import { renderHook, act } from "@testing-library/react";
import { useTrackEvent } from "./useTrackEvent";

jest.mock("~/services/tracking-client", () => ({
  trackEvent: jest.fn(),
}));

import { trackEvent } from "~/services/tracking-client";

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});

describe("useTrackEvent", () => {
  it("returns a function", () => {
    const { result } = renderHook(() => useTrackEvent("http://localhost:3002"));
    expect(typeof result.current).toBe("function");
  });

  it("calls trackEvent with the correct trackingUrl and payload", () => {
    const { result } = renderHook(() => useTrackEvent("http://localhost:3002"));

    act(() => {
      result.current("Button", "primary", "click");
    });

    expect(trackEvent).toHaveBeenCalledWith(
      "http://localhost:3002",
      expect.objectContaining({
        componentName: "Button",
        variant: "primary",
        action: "click",
      }),
    );
  });

  it("includes browser metadata in the payload", () => {
    const { result } = renderHook(() => useTrackEvent("http://localhost:3002"));

    act(() => {
      result.current("Input", "default", "focus");
    });

    const payload = (trackEvent as jest.Mock).mock.calls[0][1];
    expect(payload).toHaveProperty("timestamp");
    expect(payload).toHaveProperty("sessionId");
    expect(payload).toHaveProperty("pageUrl");
    expect(payload).toHaveProperty("userAgent");
    expect(payload).toHaveProperty("language");
    expect(payload).toHaveProperty("viewport");
  });

  it("does not call trackEvent when trackingUrl is empty", () => {
    const { result } = renderHook(() => useTrackEvent(""));

    act(() => {
      result.current("Button", "primary", "click");
    });

    expect(trackEvent).not.toHaveBeenCalled();
  });
});
