import Link from 'next/link';
import { Activity, ArrowUpRight, CheckCircle2, Clock3, Radio, Search, ShieldCheck } from 'lucide-react';
import { buildHealthRows, filterHealthRows, HEALTH_CATEGORIES, healthCounts, observationTime, type HealthCategory, type HealthFilter, type HealthSnapshot } from '@/lib/device-health';
import { vehicleTrackingHref } from '@/lib/vehicle-navigation';

const filters: { id: HealthFilter; label: string }[] = [
  { id: 'attention', label: 'Needs attention' },
  ...Object.entries(HEALTH_CATEGORIES).map(([id, label]) => ({ id: id as HealthCategory, label })),
  { id: 'clear', label: 'No detected issues' }, { id: 'all', label: 'All devices' },
];
const tones: Record<HealthCategory, string> = {
  offline: 'border-rose-400/20 bg-rose-500/10 text-rose-200',
  gps: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  activation: 'border-sky-400/20 bg-sky-500/10 text-sky-200',
  subscription: 'border-violet-400/20 bg-violet-500/10 text-violet-200',
  unknown: 'border-slate-400/20 bg-slate-500/10 text-slate-300',
};

function Observation({ label, value, now }: { label: string; value: string | null; now: number }) {
  const time = observationTime(value, now);
  return <div className="min-w-0 rounded-xl bg-black/20 p-3">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-1 text-sm text-slate-200">{time.label}</p>
    {time.timestamp !== null && <time dateTime={new Date(time.timestamp).toISOString()} className="mt-1 block break-words text-xs text-slate-400">{new Date(time.timestamp).toLocaleString()}</time>}
  </div>;
}

export default function DeviceHealthView({ snapshot, now, filter, query, onFilter, onQuery }: {
  snapshot: HealthSnapshot; now: number; filter: HealthFilter; query: string;
  onFilter: (filter: HealthFilter) => void; onQuery: (query: string) => void;
}) {
  const rows = buildHealthRows(snapshot, now);
  const counts = healthCounts(rows);
  const visible = filterHealthRows(rows, filter, query);
  const manager = snapshot.evidence.role === 'ADMIN' || snapshot.evidence.role === 'SUPER_ADMIN';
  return <>
    <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
      <span className="inline-flex items-center gap-2"><ShieldCheck size={14} />{snapshot.evidence.role === 'DEALER' ? 'Dealer-scoped devices' : 'Administrator-scoped devices'}</span>
      <span className="inline-flex items-center gap-2"><Clock3 size={14} />Last checked {new Date(snapshot.checkedAt).toLocaleString()}</span>
      <span>Refreshes every 30 seconds while this tab is visible</span>
    </div>
    {snapshot.warnings.length > 0 && <div role="status" className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
      <p className="font-semibold">Some checks are unavailable</p><ul className="mt-1 list-inside list-disc">{snapshot.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul>
    </div>}
    <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {([
        ['all', 'Devices in scope', Radio], ['attention', 'Need a review', Activity],
        ['clear', 'No detected issues', CheckCircle2], ['unknown', 'Unconfirmed evidence', ShieldCheck],
      ] as const).map(([key, label, Icon]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => onFilter(key)}
        className={'rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-sky-300 ' + (filter === key ? 'border-sky-400/50 bg-sky-500/10' : 'border-white/10 bg-[#0b1525] hover:border-white/25')}>
        <Icon size={18} className="text-sky-300" /><p className="mt-3 text-3xl font-semibold tracking-tight text-white">{counts[key]}</p><p className="mt-1 text-xs text-slate-400">{label}</p>
      </button>)}
    </div>
    <section aria-label="Device health queue" className="rounded-2xl border border-white/10 bg-[#08111f] p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="text-xl font-semibold text-white">Health queue</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">Communication and GPS are separate checks. Both use a 10-minute freshness window. Counts can overlap when a device has more than one issue.</p></div>
        <label className="w-full sm:w-80"><span className="mb-2 block text-xs text-slate-300">Find a device</span><span className="relative block"><Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-slate-500" /><input value={query} onChange={event => onQuery(event.target.value)} placeholder="Vehicle, model, IMEI or terminal ID" className="min-h-11 w-full rounded-xl border border-white/15 bg-[#050c17] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-sky-400" /></span></label>
      </div>
      <div role="group" aria-label="Filter health queue" className="mt-5 flex flex-wrap gap-2">{filters.map(item => <button key={item.id} type="button" onClick={() => onFilter(item.id)} aria-pressed={filter === item.id}
        className={'min-h-10 rounded-xl border px-3 py-2 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-sky-300 ' + (filter === item.id ? 'border-sky-400/40 bg-sky-500/15 text-sky-200' : 'border-white/10 text-slate-300 hover:bg-white/5')}>
        {item.label} <span className="ml-1 text-slate-400">{counts[item.id]}</span>
      </button>)}</div>
      <p role="status" className="my-5 text-xs text-slate-400">Showing {visible.length} of {rows.length} devices. Most urgent evidence first.</p>
      <div className="space-y-4">{visible.map(({ device, issues }) => {
        const vehicleHref = '/dashboard/vehicles/' + encodeURIComponent(device.vehicle.id);
        const mapVisible = snapshot.evidence.operationalIds?.includes(device.vehicle.id);
        return <article key={device.id} className="rounded-2xl border border-white/10 bg-[#0c1829] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0"><h3 className="break-words text-lg font-semibold text-white">{mapVisible ? <Link href={vehicleHref} className="hover:text-sky-300">{device.vehicle.vehicleNo}</Link> : device.vehicle.vehicleNo}</h3>
              <p className="mt-1 text-sm text-slate-400">{device.model || 'Model not reported'}</p>
              <p className="mt-1 break-all font-mono text-xs text-slate-400">{device.imei ? 'IMEI: ' + device.imei : device.terminalId ? 'Terminal ID: ' + device.terminalId : 'Device identifier not reported'}</p>
            </div>
            <div className="flex flex-wrap gap-2">{Array.from(new Set(issues.map(issue => issue.category))).map(category => <span key={category} className={'rounded-full border px-3 py-1 text-xs ' + tones[category]}>{HEALTH_CATEGORIES[category]}</span>)}
              {!issues.length && <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">No detected issues</span>}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2"><Observation label="Last communication" value={device.lastSeenAt} now={now} /><Observation label="Last GPS timestamp" value={device.vehicle.lastUpdate} now={now} /></div>
          {!!issues.length && <ul className="mt-4 space-y-3">{issues.map((issue, index) => <li key={issue.category + index} className="border-l-2 border-sky-500/30 pl-3">
            <p className="text-sm font-medium text-slate-100">{issue.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{issue.detail}</p><p className="mt-1 text-xs leading-5 text-sky-200">Next: {issue.action}</p>
          </li>)}</ul>}
          {!issues.length && <p className="mt-4 text-sm text-slate-400">The available checks found no issue. Customer login visibility and physical installation still need separate verification.</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-4 text-sm text-sky-300">
            {mapVisible && <Link href={vehicleHref} className="inline-flex min-h-9 items-center gap-1 hover:text-sky-100">Vehicle details<ArrowUpRight size={14} /></Link>}
            {mapVisible && <Link href={vehicleTrackingHref('live-tracking', device.vehicle.id)} className="inline-flex min-h-9 items-center gap-1 hover:text-sky-100">Open map<ArrowUpRight size={14} /></Link>}
            <Link href="/dashboard/device-setup" className="inline-flex min-h-9 items-center gap-1 hover:text-sky-100">Device setup<ArrowUpRight size={14} /></Link>
            {issues.some(issue => issue.category === 'activation') && <Link href="/dashboard/assignments" className="min-h-9 content-center hover:text-sky-100">Assignments</Link>}
            {manager && issues.some(issue => issue.category === 'subscription') && <Link href="/dashboard/billing/subscriptions" className="min-h-9 content-center hover:text-sky-100">Review subscriptions</Link>}
          </div>
        </article>;
      })}</div>
      {!visible.length && <div className="rounded-2xl border border-dashed border-white/15 px-5 py-12 text-center">
        <CheckCircle2 className="mx-auto text-sky-300" size={28} />
        <h3 className="mt-4 font-medium text-white">{rows.length === 0 ? 'No devices returned in this account’s scope' : query.trim() || filter !== 'attention' ? 'No devices match these filters' : 'No issues detected by the available checks'}</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">{rows.length === 0 ? 'Review device registration or account assignments if you expected to see devices.' : 'Try All devices or clear the search. This queue only reflects the evidence available to your account.'}</p>
      </div>}
    </section>
    <p className="mt-5 text-xs leading-6 text-slate-500">Read-only checks from existing device, subscription and tracking records. A timestamp age is time since an observation, not the confirmed duration of an incident. SIM validity, installer notes and customer-login verification are not provided by these APIs.</p>
  </>;
}
