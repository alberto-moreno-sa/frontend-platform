import { renderHook } from "@testing-library/react";
import { useSessionId } from "./useSessionId";

beforeEach(() => {
  sessionStorage.clear();
});

describe("useSessionId", () => {
  it("returns a string", () => {
    const { result } = renderHook(() => useSessionId());
    expect(typeof result.current).toBe("string");
  });

  it("generates a UUID and stores it in sessionStorage", () => {
    const { result } = renderHook(() => useSessionId());
    expect(result.current).not.toBe("ssr");
    expect(sessionStorage.getItem("tracking-session-id")).toBe(result.current);
  });

  it("returns the same id across re-renders", () => {
    const { result, rerender } = renderHook(() => useSessionId());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("reuses an existing id from sessionStorage", () => {
    sessionStorage.setItem("tracking-session-id", "existing-id");
    const { result } = renderHook(() => useSessionId());
    expect(result.current).toBe("existing-id");
  });
});
