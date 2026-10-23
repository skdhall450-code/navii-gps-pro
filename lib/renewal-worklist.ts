export const RENEWAL_ROLES = ["SUPER_ADMIN", "ADMIN", "DEALER", "CUSTOMER"] as const;
export type RenewalActor = { id: string; role: typeof RENEWAL_ROLES[number]; companyId: string; dealerId: string | null; customerId: string | null };
export type RenewalSubscription = {
  id: string; vehicleId: string; companyId: string; dealerId: string | null; customerId: string | null;
  status: "UPCOMING" | "ACTIVE" | "EXPIRING" | "EXPIRED" | "SUSPENDED" | "CANCELLED";
  startDate: string; endDate: string; vehicleNo: string; planName: string;
};
export type RenewalState = "DUE" | "COVERED" | "EXPIRED" | "GAP" | "SUSPENDED" | "UPCOMING" | "CANCELLED" | "REVIEW";
export type RenewalRow = { vehicleId: string; vehicleNo: string; planName: string; state: RenewalState; endDate: string; nextStart: string | null; daysRemaining: number; periods: number; detail: string };
export type RenewalFilter = "ATTENTION" | "DAYS7" | "DAYS15" | "DAYS30" | "ALL";
const DAY = 86_400_000;
const statuses = ["UPCOMING", "ACTIVE", "EXPIRING", "EXPIRED", "SUSPENDED", "CANCELLED"];
const record = (v: unknown): Record<string, unknown> | null => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : null;
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0 && v.length <= 500;
const optionalId = (v: unknown) => v === null || v === undefined || text(v);
function timestamp(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

export function parseRenewalActor(payload: unknown): RenewalActor {
  const outer = record(payload), user = record(outer?.data);
  if (outer?.success === false || !user || !text(user.id) || !text(user.companyId) || !RENEWAL_ROLES.includes(user.role as RenewalActor["role"]) || !optionalId(user.dealerId) || !optionalId(user.customerId) || (user.role === "DEALER" && !text(user.dealerId)) || (user.role === "CUSTOMER" && !text(user.customerId))) {
    throw new Error("This account cannot view the renewal worklist. Sign in with an authorised billing account.");
  }
  if ((user.role === "DEALER" && (record(user.dealer)?.id !== user.dealerId || record(user.dealer)?.isActive !== true)) || (user.role === "CUSTOMER" && (record(user.customer)?.id !== user.customerId || record(user.customer)?.isActive !== true))) throw new Error("Your linked billing account is unavailable. Contact your administrator.");
  return { id: user.id, role: user.role as RenewalActor["role"], companyId: user.companyId, dealerId: typeof user.dealerId === "string" ? user.dealerId : null, customerId: typeof user.customerId === "string" ? user.customerId : null };
}

/** Project only billing identity and dates. Never retain telemetry, prices or contacts. */
export function parseRenewalSubscriptions(payload: unknown, actor: RenewalActor): RenewalSubscription[] {
  const body = record(payload);
  if (body?.success !== true || !Array.isArray(body.data) || body.count !== body.data.length || body.data.length > 20_000) throw new Error("The subscription list is incomplete. Refresh before reviewing renewals.");
  const ids = new Set<string>();
  const result: RenewalSubscription[] = [];
  for (const value of body.data) {
    const row = record(value);
    if (!row || !text(row.companyId)) throw new Error("The subscription scope could not be verified.");
    // The legacy super-admin endpoint returns all companies. This view is explicitly own-company only.
    if (actor.role === "SUPER_ADMIN" && row.companyId !== actor.companyId) continue;
    if (row.companyId !== actor.companyId || (actor.role === "DEALER" && row.dealerId !== actor.dealerId) || (actor.role === "CUSTOMER" && row.customerId !== actor.customerId)) throw new Error("The subscription scope changed. Sign in again before reviewing renewals.");
    const vehicle = record(row.vehicle), plan = record(row.plan);
    if (!text(row.id) || ids.has(row.id) || !text(row.vehicleId) || vehicle?.id !== row.vehicleId || !text(vehicle?.vehicleNo) || !text(plan?.name) || !statuses.includes(row.status as string) || !timestamp(row.startDate) || !timestamp(row.endDate) || Date.parse(row.startDate) >= Date.parse(row.endDate) || !optionalId(row.dealerId) || !optionalId(row.customerId)) throw new Error("A subscription record is incomplete or invalid. Review it in Subscriptions before using this worklist.");
    ids.add(row.id);
    result.push({ id: row.id, vehicleId: row.vehicleId, companyId: row.companyId, dealerId: typeof row.dealerId === "string" ? row.dealerId : null, customerId: typeof row.customerId === "string" ? row.customerId : null, status: row.status as RenewalSubscription["status"], startDate: row.startDate, endDate: row.endDate, vehicleNo: vehicle.vehicleNo, planName: plan.name });
  }
  return result;
}

/** Date-derived coverage, not a count of old EXPIRED rows or a payment assessment. */
export function buildRenewalWorklist(subscriptions: RenewalSubscription[], now: number): RenewalRow[] {
  if (!Number.isFinite(now)) throw new Error("The review time is unavailable.");
  const groups = new Map<string, RenewalSubscription[]>();
  for (const row of subscriptions) {
    const group = groups.get(row.vehicleId) ?? [];
    group.push(row);
    groups.set(row.vehicleId, group);
  }
  const result: RenewalRow[] = [];
  for (const [vehicleId, history] of groups) {
    const ordered = [...history].sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate) || Date.parse(a.endDate) - Date.parse(b.endDate) || a.id.localeCompare(b.id));
    const active = ordered.filter(r => r.status !== "CANCELLED" && r.status !== "SUSPENDED");
    const current = active.filter(r => Date.parse(r.startDate) <= now && Date.parse(r.endDate) > now);
    const suspended = ordered.filter(r => r.status === "SUSPENDED" && Date.parse(r.startDate) <= now && Date.parse(r.endDate) > now);
    const future = active.find(r => Date.parse(r.startDate) > now);
    const past = active.filter(r => Date.parse(r.endDate) <= now).sort((a, b) => Date.parse(b.endDate) - Date.parse(a.endDate))[0];
    let selected = current[0] ?? suspended.at(-1) ?? past ?? future ?? ordered.at(-1)!;
    let state: RenewalState;
    let detail: string;
    let periods = 1;
    let endDate = selected.endDate;
    if (new Set(history.map(r => r.vehicleNo)).size > 1 || current.length > 1 || (current.length > 0 && suspended.length > 0)) {
      state = "REVIEW"; detail = "Conflicting current records. Review subscription history before deciding on renewal.";
    } else if (current.length) {
      let overlap = false;
      for (const next of active) {
        if (next.id === selected.id || Date.parse(next.endDate) <= now || Date.parse(next.startDate) < Date.parse(selected.startDate)) continue;
        if (Date.parse(next.startDate) > Date.parse(endDate)) break;
        if (Date.parse(next.startDate) < Date.parse(endDate)) { overlap = true; break; }
        endDate = next.endDate;
        periods++;
      }
      if (ordered.some(r => r.status === "SUSPENDED" && Date.parse(r.endDate) > now && Date.parse(r.startDate) < Date.parse(endDate))) overlap = true;
      state = overlap ? "REVIEW" : Date.parse(endDate) - now <= 30 * DAY ? "DUE" : "COVERED";
      detail = overlap ? "Overlapping subscription periods need review." : periods > 1 ? `${periods} continuous periods are already recorded. Review renewal at the final coverage end.` : "Review the recorded coverage end. This does not confirm payment or automatic renewal.";
    } else if (suspended.length) {
      state = "SUSPENDED"; detail = "The current period is suspended. Review its status before renewal.";
    } else if (past) {
      state = future ? "GAP" : "EXPIRED";
      detail = future ? "A future period is recorded, but there is a coverage gap now." : "The latest visible coverage has ended. Earlier expired periods are grouped here.";
    } else if (future) {
      selected = future; endDate = future.endDate;
      state = "UPCOMING"; detail = "The first visible period starts in the future; it is not current coverage.";
    } else {
      state = selected.status === "SUSPENDED" ? "SUSPENDED" : "CANCELLED";
      detail = selected.status === "SUSPENDED" ? "Only suspended periods are visible. Review subscription status." : "Only cancelled periods are visible. No renewal is inferred.";
    }
    result.push({ vehicleId, vehicleNo: selected.vehicleNo, planName: selected.planName, state, endDate, nextStart: future?.startDate ?? null, daysRemaining: Math.ceil((Date.parse(endDate) - now) / DAY), periods, detail });
  }
  return result.sort((a, b) => Date.parse(a.endDate) - Date.parse(b.endDate) || a.vehicleNo.localeCompare(b.vehicleNo));
}

export function filterRenewalRows(rows: RenewalRow[], filter: RenewalFilter, search = ""): RenewalRow[] {
  const query = search.trim().toLowerCase();
  return rows.filter(row => {
    if (query && !`${row.vehicleNo} ${row.planName}`.toLowerCase().includes(query)) return false;
    if (filter === "ALL") return true;
    if (filter === "ATTENTION") return ["EXPIRED", "GAP", "SUSPENDED", "REVIEW"].includes(row.state);
    return row.state === "DUE" && row.daysRemaining <= Number(filter.slice(4));
  });
}

export function renewalStateLabel(state: RenewalState) {
  return { DUE: "Due within 30 days", COVERED: "Covered beyond 30 days", EXPIRED: "Coverage ended", GAP: "Coverage gap", SUSPENDED: "Suspended", UPCOMING: "Upcoming period", CANCELLED: "Cancelled", REVIEW: "Review records" }[state];
}
