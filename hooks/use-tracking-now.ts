'use client';
import { useEffect, useState } from 'react';

// Freshness must expire even when requests fail or no response changes state.
export function useTrackingNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 5_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}
