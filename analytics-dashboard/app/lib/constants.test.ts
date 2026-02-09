import { SESSION_COOKIE_NAME, SESSION_MAX_AGE, TOKEN_REFRESH_BUFFER } from "./constants";

describe("constants", () => {
  it("exports SESSION_COOKIE_NAME as __session", () => {
    expect(SESSION_COOKIE_NAME).toBe("__session");
  });

  it("exports SESSION_MAX_AGE as 30 days in seconds", () => {
    expect(SESSION_MAX_AGE).toBe(60 * 60 * 24 * 30);
  });

  it("exports TOKEN_REFRESH_BUFFER as 60 seconds", () => {
    expect(TOKEN_REFRESH_BUFFER).toBe(60);
  });
});
