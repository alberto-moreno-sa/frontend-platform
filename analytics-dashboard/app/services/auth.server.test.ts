import { loginApi, registerApi, refreshApi, logoutApi } from "./auth.server";
import { ApiError } from "~/lib/api-client.server";
import { AUTH_ENDPOINTS } from "~/lib/api-endpoints";

beforeEach(() => {
  jest.restoreAllMocks();
  globalThis.fetch = jest.fn();
});

const successResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve({ success: true, data }),
});

const errorResponse = (code: string, message: string, status = 401) => ({
  ok: false,
  status,
  json: () => Promise.resolve({ error: { code, message } }),
});

describe("loginApi", () => {
  it("sends POST to login endpoint", async () => {
    const userData = { user: { id: "1", email: "a@b.com", name: "A" }, access_token: "at", refresh_token: "rt", expires_in: 900 };
    (fetch as jest.Mock).mockResolvedValue(successResponse(userData));

    const result = await loginApi({ email: "a@b.com", password: "pass" });
    const url = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain(AUTH_ENDPOINTS.login);
    expect(result.data.access_token).toBe("at");
  });

  it("throws ApiError on invalid credentials", async () => {
    (fetch as jest.Mock).mockResolvedValue(errorResponse("INVALID_CREDENTIALS", "Wrong password"));
    await expect(loginApi({ email: "a@b.com", password: "wrong" })).rejects.toThrow(ApiError);
  });
});

describe("registerApi", () => {
  it("sends POST to register endpoint", async () => {
    const userData = { user: { id: "1", email: "a@b.com", name: "A" }, access_token: "at", refresh_token: "rt", expires_in: 900 };
    (fetch as jest.Mock).mockResolvedValue(successResponse(userData));

    await registerApi({ email: "a@b.com", password: "pass", name: "A" });
    const url = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain(AUTH_ENDPOINTS.register);
  });
});

describe("refreshApi", () => {
  it("sends POST to refresh endpoint with refresh_token", async () => {
    (fetch as jest.Mock).mockResolvedValue(successResponse({ access_token: "new-at", refresh_token: "new-rt", expires_in: 900 }));

    const result = await refreshApi("old-rt");
    const url = (fetch as jest.Mock).mock.calls[0][0] as string;
    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(url).toContain(AUTH_ENDPOINTS.refresh);
    expect(body.refresh_token).toBe("old-rt");
    expect(result.data.access_token).toBe("new-at");
  });
});

describe("logoutApi", () => {
  it("sends POST to logout endpoint with Bearer token", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    await logoutApi("my-token");
    const [url, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toContain(AUTH_ENDPOINTS.logout);
    expect(opts.method).toBe("POST");
    expect(opts.headers.Authorization).toBe("Bearer my-token");
  });

  it("does not throw on fetch failure", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("network"));
    await expect(logoutApi("my-token")).resolves.toBeUndefined();
  });
});
