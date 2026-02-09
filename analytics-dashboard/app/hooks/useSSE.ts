import { useEffect, useRef, useState, useCallback } from "react";

interface UseSSEOptions {
  url: string;
  onMessage?: (data: unknown) => void;
  onEvent?: (eventName: string, data: unknown) => void;
}

export function useSSE({ url, onMessage, onEvent }: UseSSEOptions) {
  const [connected, setConnected] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);
  const onMessageRef = useRef(onMessage);
  const onEventRef = useRef(onEvent);

  onMessageRef.current = onMessage;
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    if (typeof window === "undefined" || !url) return;

    const source = new EventSource(url);
    sourceRef.current = source;

    source.onopen = () => setConnected(true);

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onMessageRef.current?.(data);
      } catch { /* ignore parse errors */ }
    };

    source.addEventListener("interaction", (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data);
        onEventRef.current?.("interaction", data);
      } catch { /* ignore parse errors */ }
    });

    source.onerror = () => {
      setConnected(false);
      source.close();
      setTimeout(connect, 3000);
    };
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      sourceRef.current?.close();
      sourceRef.current = null;
    };
  }, [connect]);

  return { connected };
}
