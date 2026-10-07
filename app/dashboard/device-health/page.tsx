'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import DeviceHealthView from '@/components/device-health/DeviceHealthView';
import { useDeviceHealth } from '@/hooks/use-device-health';
import { useTrackingNow } from '@/hooks/use-tracking-now';
import type { HealthFilter } from '@/lib/device-health';

export default function DeviceHealthPage() {
  const { snapshot, refreshing, error, refresh } = useDeviceHealth();
  const now = useTrackingNow();
  const [filter, setFilter] = useState<HealthFilter>('attention');
  const [query, setQuery] = useState('');
  return <main className="min-h-[calc(100vh-78px)] bg-[#050b16] p-4 text-white sm:p-6 lg:p-8">
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-5">
        <div><p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sky-300"><Activity size={15} />Fleet operations</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Device Health Centre</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Find devices that need attention and see what to check next.</p></div>
        <button type="button" onClick={refresh} disabled={refreshing} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 hover:bg-sky-500/20 disabled:cursor-wait disabled:opacity-50"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />{refreshing ? 'Checking…' : 'Refresh health'}</button>
      </header>
      {error && <div role="alert" className="mb-6 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-5 text-sm text-amber-100"><p>{error.message}</p><p className="mt-2 text-xs leading-5 text-amber-100/70">No current health result is shown until access and device records can be verified.</p>
        {error.code === 'unauthorized' ? <Link href="/login" className="mt-3 inline-block text-sky-200 underline">Sign in</Link> : error.code === 'forbidden' ? <Link href="/dashboard" className="mt-3 inline-block text-sky-200 underline">Return to dashboard</Link> : null}
      </div>}
      {!snapshot && !error && <p role="status" className="rounded-2xl border border-white/10 bg-[#0b1525] p-8 text-center text-sm text-slate-400">Verifying account access and checking device records…</p>}
      {snapshot && <DeviceHealthView snapshot={snapshot} now={now} filter={filter} query={query} onFilter={setFilter} onQuery={setQuery} />}
    </div>
  </main>;
}
