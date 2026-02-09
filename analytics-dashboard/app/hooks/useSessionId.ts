import { useState, useEffect } from "react";

export function useSessionId(): string {
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return "ssr";
    const stored = sessionStorage.getItem("tracking-session-id");
    if (stored) return stored;
    const id = crypto.randomUUID();
    sessionStorage.setItem("tracking-session-id", id);
    return id;
  });

  useEffect(() => {
    if (typeof window !== "undefined" && sessionId !== "ssr") {
      sessionStorage.setItem("tracking-session-id", sessionId);
    }
  }, [sessionId]);

  return sessionId;
}
