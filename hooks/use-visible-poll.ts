"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** One bounded request per resource. Retired responses never reach the UI. */
export function useVisiblePoll<T>({
  enabled = true,
  request,
  onSuccess,
  onError,
  intervalMs,
  timeoutMs = 15000,
}: {
  enabled?: boolean;
  request: (signal: AbortSignal) => Promise<T>;
  onSuccess: (data: T) => void;
  onError: (error: Error) => void;
  intervalMs: number;
  timeoutMs?: number;
}) {
  const trigger = useRef<() => void>(() => {});
  const [pending, setPending] = useState(false);
  const [initialLoading, setInitialLoading] = useState(enabled);

  useEffect(() => {
    let disposed = false;
    let active: AbortController | null = null;
    setInitialLoading(enabled);
    setPending(false);

    const cancel = () => {
      const previous = active;
      active = null;
      previous?.abort();
    };

    const refresh = async () => {
      if (disposed || !enabled || document.hidden || active) return;
      const controller = new AbortController();
      active = controller;
      setPending(true);
      const timeout = window.setTimeout(() => {
        controller.abort(new Error("Request timed out. Retrying automatically."));
      }, timeoutMs);
      let rejectAborted: () => void = () => {};
      const aborted = new Promise<never>((_, reject) => {
        rejectAborted = () => reject(controller.signal.reason);
        controller.signal.addEventListener("abort", rejectAborted, { once: true });
      });
      try {
        // Also bound readers that fail to settle promptly after cancellation.
        const data = await Promise.race([request(controller.signal), aborted]);
        if (!disposed && active === controller && !controller.signal.aborted) {
          onSuccess(data);
        }
      } catch (error) {
        if (!disposed && active === controller) {
          onError(error instanceof Error ? error : new Error("Unable to refresh data."));
        }
      } finally {
        window.clearTimeout(timeout);
        controller.signal.removeEventListener("abort", rejectAborted);
        if (!disposed && active === controller) {
          active = null;
          setPending(false);
          setInitialLoading(false);
        }
      }
    };

    const visibility = () => {
      if (document.hidden) {
        cancel();
        setPending(false);
      } else {
        void refresh();
      }
    };
    const resume = () => { void refresh(); };
    trigger.current = resume;
    const interval = window.setInterval(resume, intervalMs);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("online", resume);
    void refresh();
    return () => {
      disposed = true;
      trigger.current = () => {};
      cancel();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("online", resume);
    };
  }, [enabled, request, onSuccess, onError, intervalMs, timeoutMs]);

  const refresh = useCallback(() => trigger.current(), []);
  return { refresh, pending, initialLoading };
}
