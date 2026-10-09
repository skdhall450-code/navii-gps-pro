'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceHealthError, loadDeviceHealth, type HealthSnapshot } from '@/lib/device-health';

const API = process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.naviigps.com';

export function useDeviceHealth() {
  const [snapshot, setSnapshot] = useState<HealthSnapshot | null>(null);
  const [refreshing, setRefreshing] = useState(true);
  const [error, setError] = useState<DeviceHealthError | null>(null);
  const run = useRef<() => void>(() => {});

  useEffect(() => {
    let disposed = false;
    let controller: AbortController | null = null;
    let activeToken: string | null = null;
    async function refresh() {
      if (controller || disposed) return;
      const token = localStorage.getItem('navii_access_token');
      if (token !== activeToken) { setSnapshot(null); activeToken = token; }
      if (!token) {
        setSnapshot(null);
        setError(new DeviceHealthError('Sign in to check device health.', 'unauthorized'));
        setRefreshing(false);
        return;
      }
      const request = new AbortController();
      controller = request;
      let timedOut = false;
      const timeout = window.setTimeout(() => { timedOut = true; request.abort(); }, 15_000);
      setRefreshing(true);
      try {
        const next = await loadDeviceHealth(API, { Authorization: 'Bearer ' + token }, request.signal);
        if (disposed || request.signal.aborted) return;
        if (localStorage.getItem('navii_access_token') !== token) {
          setSnapshot(null);
          setError(new DeviceHealthError('The account changed. Refresh to check its device health.', 'unavailable'));
          return;
        }
        setSnapshot(next);
        setError(null);
      } catch (caught) {
        if (disposed || request.signal.aborted && !timedOut) return;
        // A failed refresh never leaves yesterday's permission or billing data
        // looking current. Partial successful evidence is handled by the loader.
        setSnapshot(null);
        setError(timedOut ? new DeviceHealthError('The health check timed out. Please retry.', 'unavailable')
          : caught instanceof DeviceHealthError ? caught : new DeviceHealthError('The health check failed. Please retry.', 'unavailable'));
      } finally {
        window.clearTimeout(timeout);
        if (controller === request) {
          controller = null;
          if (!disposed) setRefreshing(false);
        }
      }
    }
    run.current = () => { void refresh(); };
    void refresh();
    const timer = window.setInterval(() => { if (document.visibilityState !== 'hidden') void refresh(); }, 30_000);
    const onSessionChange = (event: StorageEvent) => {
      if (event.key !== null && event.key !== 'navii_access_token' && event.key !== 'navii_user') return;
      controller?.abort();
      controller = null;
      setSnapshot(null);
      void refresh();
    };
    window.addEventListener('storage', onSessionChange);
    return () => {
      disposed = true;
      controller?.abort();
      window.clearInterval(timer);
      window.removeEventListener('storage', onSessionChange);
      run.current = () => {};
    };
  }, []);

  const refresh = useCallback(() => run.current(), []);
  return { snapshot, refreshing, error, refresh };
}
