import { useCallback } from "react";
import { useSessionId } from "./useSessionId";
import { trackEvent } from "~/services/tracking-client";
import type { TrackEventPayload } from "~/lib/tracking-types";

export function useTrackEvent(trackingUrl: string) {
  const sessionId = useSessionId();

  const track = useCallback(
    (componentName: string, variant: string, action: TrackEventPayload["action"]) => {
      if (typeof window === "undefined" || !trackingUrl) return;

      const payload: TrackEventPayload = {
        componentName,
        variant,
        action,
        timestamp: new Date().toISOString(),
        sessionId,
        pageUrl: window.location.href,
        pageTitle: document.title,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        userAgent: navigator.userAgent,
        language: navigator.language,
      };

      trackEvent(trackingUrl, payload);
    },
    [trackingUrl, sessionId],
  );

  return track;
}
