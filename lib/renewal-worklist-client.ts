import { parseRenewalActor, parseRenewalSubscriptions, type RenewalActor, type RenewalSubscription } from "./renewal-worklist";

const API = (process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.naviigps.com").replace(/\/$/, "");
export type RenewalSnapshot = { actor: RenewalActor; subscriptions: RenewalSubscription[]; asOf: number };

/** A stale JWT must not be used for a broader legacy billing read after account changes. */
export function assertRenewalTokenScope(token: string, actor: RenewalActor): void {
  try {
    const part = token.split(".")[1];
    const claims = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))) as Record<string, unknown>;
    if (claims.sub !== actor.id || claims.role !== actor.role || claims.companyId !== actor.companyId || (claims.dealerId ?? null) !== actor.dealerId || (claims.customerId ?? null) !== actor.customerId) throw new Error();
  } catch {
    throw new Error("Your account permissions changed. Sign in again before reviewing renewals.");
  }
}

/** GET only, with one deadline covering headers, JSON and both identity checks. */
export async function loadRenewalSnapshot(
  token: string,
  currentToken: () => string | null,
  signal: AbortSignal,
  request: typeof fetch = fetch,
  timeoutMs = 15_000,
): Promise<RenewalSnapshot> {
  const controller = new AbortController();
  const assertSession = () => {
    if (signal.aborted || controller.signal.aborted) throw new DOMException("Request cancelled", "AbortError");
    if (!token || currentToken() !== token) throw new Error("Your session changed. Refresh to load the current account.");
  };
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abort: (() => void) | undefined;
  const interrupted = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error("Loading timed out. Refresh to try again.")); }, timeoutMs);
    abort = () => { controller.abort(); reject(new DOMException("Request cancelled", "AbortError")); };
    signal.addEventListener("abort", abort, { once: true });
  });
  const read = async (path: string): Promise<unknown> => {
    assertSession();
    const response = await request(`${API}${path}`, { method: "GET", headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal });
    assertSession();
    if (response.status === 401) throw new Error("Your session has ended. Sign in again to continue.");
    if (response.status === 403) throw new Error("Your account cannot access these subscription records.");
    if (!response.ok) throw new Error("Subscriptions could not be loaded. Refresh to try again.");
    const body: unknown = await response.json();
    assertSession();
    return body;
  };
  try {
    return await Promise.race([(async () => {
      const actor = parseRenewalActor(await read("/api/auth/me"));
      assertRenewalTokenScope(token, actor);
      const subscriptions = parseRenewalSubscriptions(await read("/api/gps/billing/subscriptions"), actor);
      const after = parseRenewalActor(await read("/api/auth/me"));
      if (JSON.stringify(after) !== JSON.stringify(actor)) throw new Error("Your account permissions changed. Refresh before reviewing renewals.");
      assertSession();
      return { actor, subscriptions, asOf: Date.now() };
    })(), interrupted]);
  } finally {
    if (timer) clearTimeout(timer);
    if (abort) signal.removeEventListener("abort", abort);
    controller.abort();
  }
}
