"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AlertTriangle, Bell, CheckCircle2, ChevronDown, RefreshCw, ShieldAlert } from 'lucide-react';
import { createAlertFeed, readAlertSession } from '@/lib/smart-alerts-client';
import {
  DEFAULT_ALERT_FILTERS, alertSeverity, alertTypeLabel, alertWorkflow, canManageAlerts,
  filterAlertEvents, formatAlertTimestamp, groupAlertEvents,
  type AlertFilters, type AlertGroup, type AlertRecord, type AlertWorkflowAction,
} from '@/lib/smart-alerts';
import { vehicleTrackingHref } from '@/lib/vehicle-navigation';

const API_BASE = process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.naviigps.com';
const fieldClass = 'w-full rounded-xl border border-white/15 bg-[#07101f] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-400';
const buttonClass = 'rounded-lg border border-white/15 px-3 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50';

export default function SmartAlertsPanel() {
  const [feed] = useState(() => createAlertFeed({
    apiBase: API_BASE,
    session: () => typeof window === 'undefined' ? null : readAlertSession(window.localStorage),
    fetch: (...args) => fetch(...args),
    unauthorized: () => {
      window.localStorage.removeItem('navii_access_token');
      window.localStorage.removeItem('navii_user');
      window.location.assign('/login');
    },
  }));
  const state = useSyncExternalStore(feed.subscribe, feed.getSnapshot, feed.getSnapshot);
  const [filters, setFilters] = useState<AlertFilters>({ ...DEFAULT_ALERT_FILTERS });
  const [grouped, setGrouped] = useState(true);
  const [limit, setLimit] = useState(50);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = () => { setNow(Date.now()); void feed.refresh(); };
    refresh();
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      feed.dispose();
    };
  }, [feed]);

  const filtered = useMemo(() => filterAlertEvents(state.events, filters, now), [state.events, filters, now]);
  const groups = useMemo(() => groupAlertEvents(filtered, grouped), [filtered, grouped]);
  const types = useMemo(() => [...new Set(state.events.map(event => event.type))].sort(), [state.events]);
  const open = state.events.filter(event => !event.isResolved);
  const stats = [
    { title: 'Recorded events', count: state.events.length, icon: Bell },
    { title: 'Open events', count: open.length, icon: ShieldAlert },
    { title: 'Critical open events', count: open.filter(event => alertSeverity(event.type) === 'CRITICAL').length, icon: AlertTriangle },
    { title: 'Resolved events', count: state.events.length - open.length, icon: CheckCircle2 },
  ];
  const canManage = canManageAlerts(state.role);
  const workflowSupported = state.events.some(event => alertWorkflow(event) !== null);
  const setFilter = <K extends keyof AlertFilters>(key: K, value: AlertFilters[K]) => {
    setFilters(current => ({ ...current, [key]: value }));
    setLimit(50);
  };
  const resetFilters = () => { setFilters({ ...DEFAULT_ALERT_FILTERS }); setLimit(50); };

  return (
    <div className="min-h-[calc(100vh-78px)] p-4 text-white sm:p-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-sky-400">EVENT MONITORING</p>
            <h1 className="mt-1 text-3xl font-bold">Smart Alerts</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">Review repeat events together, keep the original evidence, and resolve the events that need attention.</p>
          </div>
          <button type="button" className={`${buttonClass} flex items-center gap-2`} disabled={state.refreshing || state.actionPending} onClick={() => { setNow(Date.now()); void feed.refresh(); }}>
            <RefreshCw className={`h-4 w-4 ${state.refreshing ? 'animate-spin' : ''}`} aria-hidden="true" /> Refresh
          </button>
        </div>

        <div className="mb-5 flex flex-wrap justify-between gap-2 text-xs text-slate-400">
          <p role="status">{state.loading ? 'Loading server records…' : state.stale ? 'Refresh unconfirmed. Actions are paused.' : 'Server records confirmed. Refreshes every 15 seconds.'}</p>
          <p>Last successful refresh: {formatAlertTimestamp(state.lastRefresh === null ? null : new Date(state.lastRefresh).toISOString())}</p>
        </div>
        {state.feedError && <p role="alert" className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">{state.feedError} {state.events.length > 0 && 'Showing the last confirmed records.'}</p>}
        {state.actionError && <p role="alert" className="mb-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">{state.actionError}</p>}
        {state.notice && <p role="status" className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{state.notice}</p>}

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ title, count, icon: Icon }) => <div key={title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div><p className="text-sm text-slate-400">{title}</p><p className="mt-2 text-3xl font-bold">{state.lastRefresh === null ? '—' : count}</p></div><Icon className="h-6 w-6 text-sky-400" aria-hidden="true" />
          </div>)}
        </div>

        <section aria-label="Alert filters" className="mb-5 rounded-2xl border border-white/10 bg-[#0a1426] p-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <label className="text-xs text-slate-400 sm:col-span-2 xl:col-span-1">Search records<input className={`${fieldClass} mt-1`} value={filters.search} onChange={event => setFilter('search', event.target.value)} placeholder="Vehicle, IMEI, terminal, message" /></label>
            <label className="text-xs text-slate-400">Status<select className={`${fieldClass} mt-1`} value={filters.status} onChange={event => setFilter('status', event.target.value as AlertFilters['status'])}><option value="OPEN">Open</option><option value="RESOLVED">Resolved</option><option value="ALL">All statuses</option></select></label>
            <label className="text-xs text-slate-400">Severity by alert type<select className={`${fieldClass} mt-1`} value={filters.severity} onChange={event => setFilter('severity', event.target.value as AlertFilters['severity'])}><option value="ALL">All severities</option>{['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
            <label className="text-xs text-slate-400">Alert type<select className={`${fieldClass} mt-1`} value={filters.type} onChange={event => setFilter('type', event.target.value)}><option value="ALL">All alert types</option>{[...new Set([...types, ...(filters.type !== 'ALL' ? [filters.type] : [])])].map(value => <option key={value} value={value}>{alertTypeLabel(value)}</option>)}</select></label>
            <label className="text-xs text-slate-400">Recorded time<select className={`${fieldClass} mt-1`} value={filters.period} onChange={event => setFilter('period', event.target.value as AlertFilters['period'])}><option value="ALL">All recorded times</option><option value="HOUR">Past hour</option><option value="DAY">Past 24 hours</option><option value="WEEK">Past 7 days</option></select></label>
            <label className="text-xs text-slate-400">Acknowledgement<select className={`${fieldClass} mt-1`} value={filters.workflow} onChange={event => setFilter('workflow', event.target.value as AlertFilters['workflow'])}><option value="ALL">All workflows</option><option value="UNASSIGNED">Unassigned open events</option><option value="PENDING">Awaiting acknowledgement</option><option value="OVERDUE">Overdue acknowledgement</option><option value="ACKNOWLEDGED">Acknowledged</option></select></label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={grouped} onChange={event => { setGrouped(event.target.checked); setLimit(50); }} className="h-4 w-4 accent-sky-400" />Group exact repeats within 5 minutes</label>
            <button type="button" className={buttonClass} onClick={resetFilters}>Reset filters</button>
          </div>
          {!workflowSupported && state.events.length > 0 && state.lastRefresh !== null && <p className="mt-3 text-xs text-amber-200">No workflow-capable events are loaded. Ownership and acknowledgement require the Smart Alerts backend upgrade.</p>}
          <p className="mt-3 text-xs leading-relaxed text-slate-400">Grouping matches vehicle, alert type, exact message and state. Original events stay available. Times below are server-recorded times in UTC, not verified device occurrence times. Counts above cover all accessible records.</p>
        </section>

        {!canManage && state.role && <p className="mb-4 text-sm text-slate-400">Your account has read-only alert access. An authorized administrator or dealer can resolve or reopen events.</p>}
        <section aria-label="Alert queue" className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
          <div className="border-b border-white/10 p-5"><h2 className="font-semibold">{filters.status === 'OPEN' ? 'Open alert queue' : 'Alert history'}</h2><p className="mt-1 text-xs text-slate-400">{filtered.length} matching events in {groups.length} {grouped ? 'groups' : 'rows'} · Showing {Math.min(limit, groups.length)}</p></div>
          {state.loading ? <p className="p-12 text-center text-slate-400">Loading alerts…</p> : groups.length ? <div className="divide-y divide-white/10">{groups.slice(0, limit).map(group => <AlertGroupCard key={group.id} group={group} canManage={canManage} currentUserId={state.userId} disabled={state.stale || state.actionPending} busy={state.actionPending} onChange={(ids, resolved) => { void feed.changeState(ids, resolved); }} onWorkflow={(id, action) => { void feed.changeWorkflow(id, action); }} />)}</div> : <div className="p-10 text-center"><h3 className="font-semibold">{state.feedError && state.lastRefresh === null ? 'Alerts unavailable' : 'No matching events'}</h3><p className="mt-2 text-sm text-slate-400">{state.feedError && state.lastRefresh === null ? 'Refresh after access or connectivity is restored.' : 'Try another status, recorded-time range, or search.'}</p></div>}
          {groups.length > limit && <div className="p-5"><button type="button" className={buttonClass} onClick={() => setLimit(value => value + 50)}>Show 50 more</button></div>}
        </section>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">This view organizes existing server alerts. Ownership, acknowledgement and deadlines are saved only through the supported backend. Overdue is an in-app review queue; no automatic escalation or external notification is sent. Night movement and idle event generation are not enabled here.</p>
      </div>
    </div>
  );
}

export function AlertGroupCard({ group, canManage, currentUserId, disabled, busy, onChange, onWorkflow }: {
  group: AlertGroup; canManage: boolean; currentUserId?: string; disabled: boolean; busy: boolean;
  onChange: (ids: string[], resolved: boolean) => void;
  onWorkflow: (id: string, action: AlertWorkflowAction) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const event = group.events[0];
  const severity = alertSeverity(event.type);
  const repeat = group.events.length > 1;
  return <article className="p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1 basis-80">
        <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-sky-300">{alertTypeLabel(event.type)}</span><span className={`rounded-full px-2.5 py-1 ${severity === 'CRITICAL' ? 'bg-red-500/15 text-red-300' : 'bg-amber-500/10 text-amber-200'}`}>{severity}</span><span className={`rounded-full px-2.5 py-1 ${event.isResolved ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/10 text-slate-200'}`}>{event.isResolved ? 'RESOLVED' : 'OPEN'}</span>{repeat && <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-violet-300">{group.events.length} repeat events</span>}</div>
        <h3 className="mt-3 break-words font-semibold">{event.message}</h3>
        <p className="mt-2 text-sm text-slate-300">{event.vehicle.vehicleNo}{event.vehicle.name ? ` · ${event.vehicle.name}` : ''}</p>
        <p className="mt-2 break-words text-xs text-slate-400">{event.vehicle.device?.imei ? `IMEI: ${event.vehicle.device.imei}` : event.vehicle.device?.terminalId ? `Terminal ID: ${event.vehicle.device.terminalId}` : 'Device identifier unavailable'}{event.vehicle.device?.model ? ` · ${event.vehicle.device.model}` : ''}</p>
        <div className="mt-2 text-xs text-slate-400"><p>{repeat ? 'First recorded' : 'Recorded'}: {formatAlertTimestamp(group.firstAt)}</p>{repeat && <p className="mt-1">Last recorded: {formatAlertTimestamp(group.lastAt)}</p>}{!repeat && event.isResolved && <p className="mt-1">Resolved: {formatAlertTimestamp(event.resolvedAt)}</p>}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className={buttonClass} href={`/dashboard/vehicles/${encodeURIComponent(event.vehicleId)}`}>Vehicle details</Link>
        <Link className={buttonClass} href={vehicleTrackingHref('live-tracking', event.vehicleId)}>View vehicle map</Link>
        {canManage && <button type="button" className={`${buttonClass} ${event.isResolved ? 'text-amber-200' : 'text-emerald-200'}`} disabled={disabled} onClick={() => onChange(group.events.map(item => item.id), !event.isResolved)}>{busy ? 'Updating…' : `${event.isResolved ? 'Reopen' : 'Resolve'} ${group.events.length} ${repeat ? 'events' : 'event'}`}</button>}
      </div>
    </div>
    {!repeat && <AlertWorkflowControls event={event} canManage={canManage} currentUserId={currentUserId} disabled={disabled} onWorkflow={onWorkflow} />}
    {repeat && group.events.some(item => alertWorkflow(item)) && <p className="mt-3 text-xs text-slate-400">Ownership and acknowledgement are per original event. {group.events.filter(item => alertWorkflow(item)?.deadlineStatus === 'OVERDUE').length} overdue. Expand originals to review.</p>}
    <button type="button" className="mt-4 flex items-center gap-2 rounded text-sm text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}><ChevronDown className={`h-4 w-4 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />{expanded ? 'Hide' : 'Show'} original {repeat ? 'events' : 'event'}</button>
    {expanded && <ol className="mt-3 space-y-3 rounded-xl border border-white/10 bg-[#07101f] p-3">{group.events.map(original => <OriginalEvent key={original.id} event={original} canManage={canManage} disabled={disabled} onChange={onChange} currentUserId={currentUserId} onWorkflow={repeat ? onWorkflow : undefined} />)}</ol>}
  </article>;
}
function OriginalEvent({ event, canManage, disabled, onChange, currentUserId, onWorkflow }: { event: AlertRecord; canManage: boolean; disabled: boolean; currentUserId?: string; onChange: (ids: string[], resolved: boolean) => void; onWorkflow?: (id: string, action: AlertWorkflowAction) => void }) {
  return <li className="border-b border-white/10 pb-3 text-xs last:border-b-0 last:pb-0"><div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><p className="break-words font-mono text-slate-300">Event ID: {event.id}</p><p className="mt-1 text-slate-400">Recorded: {formatAlertTimestamp(event.createdAt)}</p><p className="mt-1 break-words text-slate-300">{event.message}</p>{event.isResolved && <p className="mt-1 text-emerald-300">Resolved: {formatAlertTimestamp(event.resolvedAt)}</p>}</div>{canManage && <button type="button" className={buttonClass} disabled={disabled} onClick={() => onChange([event.id], !event.isResolved)}>{event.isResolved ? 'Reopen this event' : 'Resolve this event'}</button>}</div>{onWorkflow && <AlertWorkflowControls event={event} canManage={canManage} currentUserId={currentUserId} disabled={disabled} onWorkflow={onWorkflow} />}</li>;
}

export function AlertWorkflowControls({ event, canManage, currentUserId, disabled, onWorkflow }: { event: AlertRecord; canManage: boolean; currentUserId?: string; disabled: boolean; onWorkflow: (id: string, action: AlertWorkflowAction) => void }) {
  const [deadlineMinutes, setDeadlineMinutes] = useState('60');
  const workflow = alertWorkflow(event);
  if (!workflow) return null;
  const isOwner = workflow.owner?.id === currentUserId;
  const actionable = canManage && !event.isResolved;
  return <div className="mt-4 rounded-xl border border-white/10 p-3">
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
      <p>Owner: {workflow.owner?.name ?? 'Unassigned'}{isOwner ? ' (you)' : ''}</p>
      <p>{workflow.acknowledgedAt ? `Acknowledged: ${formatAlertTimestamp(workflow.acknowledgedAt)}${workflow.acknowledgedBy ? ` by ${workflow.acknowledgedBy.name}` : ''}` : 'Not acknowledged'}</p>
      <p className={workflow.deadlineStatus === 'OVERDUE' ? 'font-semibold text-red-300' : ''}>Deadline: {workflow.acknowledgementDueAt ? formatAlertTimestamp(workflow.acknowledgementDueAt) : 'Not set'}{workflow.deadlineStatus === 'OVERDUE' ? ' · OVERDUE' : ''}</p>
    </div>
    {actionable && (!workflow.owner || workflow.ownershipRecoverable) && <button type="button" className={`${buttonClass} mt-3 text-sky-300`} disabled={disabled} onClick={() => onWorkflow(event.id, { action: 'TAKE_OWNERSHIP' })}>{workflow.ownershipRecoverable ? 'Reclaim ownership' : 'Take ownership'}</button>}
    {actionable && isOwner && !workflow.acknowledgedAt && <div className="mt-3 flex flex-wrap items-end gap-2">
      <button type="button" className={`${buttonClass} text-emerald-200`} disabled={disabled} onClick={() => onWorkflow(event.id, { action: 'ACKNOWLEDGE' })}>Acknowledge</button>
      <label className="text-xs text-slate-400">Acknowledgement deadline<select className={`${fieldClass} mt-1`} value={deadlineMinutes} onChange={change => setDeadlineMinutes(change.target.value)} disabled={disabled}><option value="30">30 minutes from now</option><option value="60">1 hour from now</option><option value="240">4 hours from now</option><option value="1440">24 hours from now</option><option value="NONE">Clear deadline</option></select></label>
      <button type="button" className={buttonClass} disabled={disabled} onClick={() => onWorkflow(event.id, { action: 'SET_DEADLINE', acknowledgementDueAt: deadlineMinutes === 'NONE' ? null : new Date(Date.now() + Number(deadlineMinutes) * 60000).toISOString() })}>{deadlineMinutes === 'NONE' ? 'Clear deadline' : 'Set deadline'}</button>
    </div>}
    {actionable && workflow.owner && !isOwner && <p className="mt-2 text-xs text-slate-400">{workflow.ownershipRecoverable ? 'The previous owner no longer has alert access. Reclaiming resets the acknowledgement and deadline.' : 'Only the owner can acknowledge or change this deadline.'}</p>}
    {workflow.acknowledgedAt && !event.isResolved && <p className="mt-2 text-xs text-slate-400">Acknowledged; the event stays open until it is resolved.</p>}
  </div>;
}
