import { renderHook, act } from "@testing-library/react";
import { useSSE } from "./useSSE";

let mockEventSource: {
  onopen: (() => void) | null;
  onmessage: ((e: { data: string }) => void) | null;
  onerror: (() => void) | null;
  addEventListener: jest.Mock;
  close: jest.Mock;
};

beforeEach(() => {
  jest.useFakeTimers();
  mockEventSource = {
    onopen: null,
    onmessage: null,
    onerror: null,
    addEventListener: jest.fn(),
    close: jest.fn(),
  };
  globalThis.EventSource = jest.fn(() => mockEventSource) as unknown as typeof EventSource;
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useSSE", () => {
  it("creates an EventSource with the given URL", () => {
    renderHook(() => useSSE({ url: "http://localhost:3002/stream" }));
    expect(EventSource).toHaveBeenCalledWith("http://localhost:3002/stream");
  });

  it("does not create EventSource when url is empty", () => {
    renderHook(() => useSSE({ url: "" }));
    expect(EventSource).not.toHaveBeenCalled();
  });

  it("sets connected to true on open", () => {
    const { result } = renderHook(() => useSSE({ url: "http://localhost/stream" }));
    expect(result.current.connected).toBe(false);

    act(() => {
      mockEventSource.onopen?.();
    });
    expect(result.current.connected).toBe(true);
  });

  it("calls onMessage with parsed data", () => {
    const onMessage = jest.fn();
    renderHook(() => useSSE({ url: "http://localhost/stream", onMessage }));

    act(() => {
      mockEventSource.onmessage?.({ data: JSON.stringify({ summary: { total: 5 } }) });
    });

    expect(onMessage).toHaveBeenCalledWith({ summary: { total: 5 } });
  });

  it("calls onEvent for interaction events", () => {
    const onEvent = jest.fn();
    renderHook(() => useSSE({ url: "http://localhost/stream", onEvent }));

    const handler = mockEventSource.addEventListener.mock.calls.find(
      (c: string[]) => c[0] === "interaction",
    )?.[1];
    expect(handler).toBeDefined();

    act(() => {
      handler({ data: JSON.stringify({ componentName: "Button", action: "click" }) });
    });

    expect(onEvent).toHaveBeenCalledWith("interaction", { componentName: "Button", action: "click" });
  });

  it("sets connected to false and reconnects on error", () => {
    const { result } = renderHook(() => useSSE({ url: "http://localhost/stream" }));

    act(() => {
      mockEventSource.onopen?.();
    });
    expect(result.current.connected).toBe(true);

    act(() => {
      mockEventSource.onerror?.();
    });
    expect(result.current.connected).toBe(false);
    expect(mockEventSource.close).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(EventSource).toHaveBeenCalledTimes(2);
  });

  it("closes EventSource on unmount", () => {
    const { unmount } = renderHook(() => useSSE({ url: "http://localhost/stream" }));
    unmount();
    expect(mockEventSource.close).toHaveBeenCalled();
  });
});
