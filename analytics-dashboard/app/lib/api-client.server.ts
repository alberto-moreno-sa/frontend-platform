import { logger } from "~/lib/logger.server";

const log = logger.child({ component: "api-client" });

/**
 * Centralized HTTP client for microservices.
 * All API calls run server-side only (.server.ts).
 */

export function getEnv() {
  return {
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    TRACKING_SERVICE_URL: process.env.TRACKING_SERVICE_URL || "http://localhost:3002",
    TRACKING_SERVICE_PUBLIC_URL: process.env.TRACKING_SERVICE_PUBLIC_URL || process.env.TRACKING_SERVICE_URL || "http://localhost:3002",
    SESSION_SECRET: process.env.SESSION_SECRET || "s3cr3t-dev-only-change-in-prod",
    NODE_ENV: process.env.NODE_ENV || "development",
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body } = options;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    log.warn({ status: response.status, url, code: json.error?.code }, "API request failed");
    throw new ApiError(
      json.error?.message || `Request failed: ${response.status}`,
      json.error?.code,
      response.status,
    );
  }

  return json as T;
}
