import { getEnv, apiFetch, ApiError } from "./api-client.server";

beforeEach(() => {
  jest.restoreAllMocks();
  globalThis.fetch = jest.fn();
});

describe("getEnv", () => {
  it("returns default values when env vars are not set", () => {
    const env = getEnv();
    expect(env.AUTH_SERVICE_URL).toBe("http://localhost:3001");
    expect(env.TRACKING_SERVICE_URL).toBe("http://localhost:3002");
    expect(env.SESSION_SECRET).toBe("s3cr3t-dev-only-change-in-prod");
    expect(env.NODE_ENV).toBe("test");
  });
});

describe("ApiError", () => {
  it("creates an error with message, code, and status", () => {
    const err = new ApiError("Not found", "NOT_FOUND", 404);
    expect(err.message).toBe("Not found");
    expect(err.code).toBe("NOT_FOUND");
    expect(err.status).toBe(404);
    expect(err.name).toBe("ApiError");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("apiFetch", () => {
  it("sends a GET request by default with JSON content-type", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: "ok" }),
    });

    await apiFetch("http://example.com/api");
    expect(fetch).toHaveBeenCalledWith("http://example.com/api", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: undefined,
    });
  });

  it("sends POST with JSON-stringified body", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });

    await apiFetch("http://example.com/api", { method: "POST", body: { name: "test" } });
    const call = (fetch as jest.Mock).mock.calls[0];
    expect(call[1].method).toBe("POST");
    expect(call[1].body).toBe(JSON.stringify({ name: "test" }));
  });

  it("returns parsed JSON on success", async () => {
    const data = { success: true, data: { id: 1 } };
    (fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(data) });

    const result = await apiFetch("http://example.com/api");
    expect(result).toEqual(data);
  });

  it("throws ApiError on non-ok response", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { code: "UNAUTHORIZED", message: "Bad token" } }),
    });

    await expect(apiFetch("http://example.com/api")).rejects.toThrow(ApiError);
    try {
      await apiFetch("http://example.com/api");
    } catch (err) {
      expect((err as ApiError).message).toBe("Bad token");
      expect((err as ApiError).code).toBe("UNAUTHORIZED");
      expect((err as ApiError).status).toBe(401);
    }
  });

  it("throws ApiError when success is false", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: false, error: { message: "Validation error" } }),
    });

    await expect(apiFetch("http://example.com/api")).rejects.toThrow("Validation error");
  });

  it("uses status code in fallback message", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });

    await expect(apiFetch("http://example.com/api")).rejects.toThrow("Request failed: 500");
  });
});
