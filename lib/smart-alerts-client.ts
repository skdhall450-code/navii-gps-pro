import { ALERT_ROLES, alertWorkflow, canManageAlerts, isAlertRecord, type AlertRecord, type AlertRole, type AlertWorkflowAction } from './smart-alerts';

export type AlertSession = { token: string; userId: string; role: AlertRole; companyId: string; dealerId?: string | null; customerId?: string | null };
export type AlertFeedState = {
  events: AlertRecord[];
  role?: AlertRole;
  userId?: string;
  loading: boolean;
  refreshing: boolean;
  actionPending: boolean;
  stale: boolean;
  lastRefresh: number | null;
  feedError: string | null;
  actionError: string | null;
  notice: string | null;
};
const emptyState = (): AlertFeedState => ({ events: [], loading: true, refreshing: false, actionPending: false, stale: true, lastRefresh: null, feedError: null, actionError: null, notice: null });
const sessionKey = (session: AlertSession | null) => session ? JSON.stringify(session) : '';

export function readAlertSession(storage: Pick<Storage, 'getItem'>): AlertSession | null {
  try {
    const token = storage.getItem('navii_access_token');
    const raw = storage.getItem('navii_user');
    const user = raw ? JSON.parse(raw) : null;
    if (!token || !user || typeof user.id !== 'string' || !user.id || typeof user.companyId !== 'string' || !user.companyId || !ALERT_ROLES.includes(user.role)) return null;
    return { token, userId: user.id, role: user.role, companyId: user.companyId, dealerId: user.dealerId, customerId: user.customerId };
  } catch { return null; }
}

/** Serializes writes, invalidates old reads, and drops responses after account/scope changes. */
export function createAlertFeed(options: {
  apiBase: string;
  session: () => AlertSession | null;
  fetch: typeof fetch;
  unauthorized: () => void;
  now?: () => number;
  requestTimeoutMs?: number;
}) {
  let state = emptyState();
  let activeKey = '';
  let generation = 0;
  let readController: AbortController | null = null;
  let writeController: AbortController | null = null;
  const listeners = new Set<() => void>();
  const publish = (patch: Partial<AlertFeedState>) => { state = { ...state, ...patch }; listeners.forEach(listener => listener()); };
  const reset = (session: AlertSession | null) => {
    generation++;
    readController?.abort(); readController = null;
    writeController?.abort(); writeController = null;
    activeKey = sessionKey(session);
    state = { ...emptyState(), role: session?.role, userId: session?.userId };
    listeners.forEach(listener => listener());
  };
  const currentSession = () => {
    const session = options.session();
    if (sessionKey(session) !== activeKey) reset(session);
    return session;
  };
  const current = (key: string, version: number) => sessionKey(currentSession()) === key && generation === version;
  const loseAccess = (unauthorized: boolean) => {
    publish({ events: [], stale: true, lastRefresh: null, feedError: unauthorized ? 'Your session has expired. Sign in again.' : 'Alert access is unavailable for this account or subscription.' });
    if (unauthorized) options.unauthorized();
  };
  const readBody = async (response: Response): Promise<{ success?: boolean; data?: unknown; message?: string }> => {
    const body: unknown = await response.json();
    if (!body || typeof body !== 'object') throw new Error('The server returned an invalid alert response.');
    return body;
  };

  class RequestTimeoutError extends Error {}
  const request = async (url: string, init: RequestInit, controller: AbortController) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new RequestTimeoutError('The server response timed out. Refresh before retrying; an update may already have reached the server.'));
      }, options.requestTimeoutMs ?? 12000);
    });
    try {
      return await Promise.race([timeout, (async () => {
        const response = await options.fetch(url, { ...init, signal: controller.signal });
        const result = response.status === 401 || response.status === 403 ? {} : await readBody(response);
        return { response, result };
      })()]);
    } finally { if (timer !== undefined) clearTimeout(timer); }
  };

  async function refresh() {
    const session = currentSession();
    if (!session) { loseAccess(true); publish({ loading: false }); return; }
    if (state.actionPending || readController) return;
    const key = activeKey;
    const version = generation;
    const controller = new AbortController();
    readController = controller;
    publish({ refreshing: true });
    try {
      const { response, result } = await request(`${options.apiBase}/api/gps/alerts`, { headers: { Authorization: `Bearer ${session.token}` }, cache: 'no-store' }, controller);
      if (!current(key, version)) return;
      if (response.status === 401 || response.status === 403) { loseAccess(response.status === 401); return; }
      if (!response.ok || result.success !== true || !Array.isArray(result.data) || !result.data.every(isAlertRecord)) throw new Error('Unable to verify the alert list. Refresh to try again.');
      const events = result.data as AlertRecord[];
      if (session.role !== 'SUPER_ADMIN' && events.some(event => event.vehicle.companyId !== undefined && event.vehicle.companyId !== session.companyId)) {
        loseAccess(false); return;
      }
      if (new Set(events.map(event => event.id)).size !== events.length) throw new Error('The server returned duplicate event IDs. Refresh to try again.');
      publish({ events, stale: false, lastRefresh: (options.now ?? Date.now)(), feedError: null });
    } catch (error) {
      if (current(key, version) && (!controller.signal.aborted || error instanceof RequestTimeoutError)) publish({ stale: true, feedError: error instanceof Error ? error.message : 'Unable to refresh alerts.' });
    } finally {
      if (current(key, version) && readController === controller) {
        readController = null;
        publish({ loading: false, refreshing: false });
      }
    }
  }

  async function changeState(ids: readonly string[], resolved: boolean) {
    const session = currentSession();
    if (!session || !canManageAlerts(session.role) || state.actionPending || state.stale || state.lastRefresh === null) return;
    const requested = [...new Set(ids)];
    const events = requested.map(id => state.events.find(event => event.id === id));
    if (!events.length || events.some(event => !event || event.isResolved === resolved)) return;
    readController?.abort(); readController = null;
    const version = ++generation;
    const key = activeKey;
    const controller = new AbortController();
    writeController = controller;
    let completed = 0;
    let denied = false;
    publish({ actionPending: true, refreshing: false, actionError: null, notice: null });
    try {
      for (const event of events as AlertRecord[]) {
        if (!current(key, version)) return;
        const { response, result } = await request(`${options.apiBase}/api/gps/alerts/${encodeURIComponent(event.id)}/${resolved ? 'resolve' : 'reopen'}`, { method: 'PATCH', headers: { Authorization: `Bearer ${session.token}` } }, controller);
        if (!current(key, version)) return;
        if (response.status === 401 || response.status === 403) { denied = true; loseAccess(response.status === 401); throw new Error('Permission changed. Remaining events were not updated.'); }
        if (!response.ok || result.success !== true || !isAlertRecord(result.data) || result.data.id !== event.id || result.data.vehicleId !== event.vehicleId || result.data.isResolved !== resolved || (session.role !== 'SUPER_ADMIN' && result.data.vehicle.companyId !== undefined && result.data.vehicle.companyId !== session.companyId)) throw new Error('The server did not confirm this update. Remaining events were not sent; refresh before retrying.');
        const updated = result.data;
        completed++;
        publish({ events: state.events.map(item => item.id === updated.id ? updated : item) });
      }
      publish({ notice: `${completed} ${completed === 1 ? 'event' : 'events'} ${resolved ? 'resolved' : 'reopened'}.` });
    } catch (error) {
      if (current(key, version) && (!controller.signal.aborted || error instanceof RequestTimeoutError)) publish({ stale: true, actionError: `${completed} of ${events.length} updates confirmed. ${error instanceof Error ? error.message : 'Update failed. Refresh before retrying.'}` });
    } finally {
      if (current(key, version)) {
        writeController = null;
        publish({ actionPending: false });
        if (!denied) await refresh();
      }
    }
  }

  async function changeWorkflow(id: string, action: AlertWorkflowAction) {
    const session = currentSession();
    if (!session || !canManageAlerts(session.role) || state.actionPending || state.stale || state.lastRefresh === null) return;
    const event = state.events.find(item => item.id === id);
    const workflow = alertWorkflow(event);
    if (!event || event.isResolved || !workflow) return;
    const canRecover = workflow.ownershipRecoverable === true && (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN');
    if (action.action === 'TAKE_OWNERSHIP' ? workflow.owner !== null && workflow.owner.id !== session.userId && !canRecover : workflow.owner?.id !== session.userId || workflow.acknowledgedAt !== null) return;
    readController?.abort(); readController = null;
    const version = ++generation;
    const key = activeKey;
    const controller = new AbortController();
    writeController = controller;
    let denied = false;
    publish({ actionPending: true, refreshing: false, actionError: null, notice: null });
    try {
      const { response, result } = await request(`${options.apiBase}/api/gps/alerts/${encodeURIComponent(id)}/workflow`, { method: 'PATCH', headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(action) }, controller);
      if (!current(key, version)) return;
      if (response.status === 401 || response.status === 403) { denied = true; loseAccess(response.status === 401); throw new Error('Permission changed. The workflow update was not confirmed.'); }
      const next = alertWorkflow(result.data);
      if (response.status === 409) throw new Error('This alert changed or is owned by another manager. Refreshing the current state.');
      if (!response.ok || result.success !== true || !isAlertRecord(result.data) || result.data.id !== id || result.data.vehicleId !== event.vehicleId || !next || (session.role !== 'SUPER_ADMIN' && result.data.vehicle.companyId !== undefined && result.data.vehicle.companyId !== session.companyId)) throw new Error('The server did not confirm the workflow update. Refresh before retrying.');
      if (action.action === 'TAKE_OWNERSHIP' && next.owner?.id !== session.userId || action.action === 'ACKNOWLEDGE' && (next.acknowledgedAt === null || next.acknowledgedBy?.id !== session.userId) || action.action === 'SET_DEADLINE' && (next.acknowledgementDueAt === null || action.acknowledgementDueAt === null ? next.acknowledgementDueAt !== action.acknowledgementDueAt : Date.parse(next.acknowledgementDueAt) !== Date.parse(action.acknowledgementDueAt))) throw new Error('The server returned a different workflow state. Refresh before retrying.');
      const updated = result.data;
      publish({ events: state.events.map(item => item.id === id ? updated : item), notice: action.action === 'TAKE_OWNERSHIP' ? 'You now own this event.' : action.action === 'ACKNOWLEDGE' ? 'Event acknowledged. It remains open until resolved.' : 'Acknowledgement deadline updated.' });
    } catch (error) {
      if (current(key, version) && (!controller.signal.aborted || error instanceof RequestTimeoutError)) publish({ stale: true, actionError: error instanceof Error ? error.message : 'Workflow update failed.' });
    } finally {
      if (current(key, version)) {
        writeController = null;
        publish({ actionPending: false });
        if (!denied) await refresh();
      }
    }
  }

  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    refresh,
    changeState,
    changeWorkflow,
    syncSession: () => { currentSession(); },
    dispose: () => { generation++; readController?.abort(); readController = null; writeController?.abort(); writeController = null; },
  };
}
