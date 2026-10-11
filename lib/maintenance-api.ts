import type {
  MaintenanceCategory,
  MaintenanceFilters,
  MaintenanceList,
  MaintenanceRecord,
  MaintenanceVehicle,
} from "./maintenance";

const API_BASE = (
  process.env.NEXT_PUBLIC_NAVII_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com"
).replace(/\/$/, "");
export class MaintenanceApiError extends Error {
  status: number;
  uncertain: boolean;
  constructor(message: string, status = 0, uncertain = false) {
    super(message);
    this.name = "MaintenanceApiError";
    this.status = status;
    this.uncertain = uncertain;
  }
}
export type Requester = typeof fetch;
function authHeaders(): Headers {
  const token =
    typeof window === "undefined"
      ? null
      : localStorage.getItem("navii_access_token");
  if (!token)
    throw new MaintenanceApiError(
      "Your session has ended. Sign in again to continue.",
      401,
    );
  return new Headers({ Authorization: `Bearer ${token}` });
}
async function readMaintenanceResponse<T>(
  path: string,
  init: RequestInit,
  request: Requester,
): Promise<T> {
  const write = init.method && init.method !== "GET";
  const headers = authHeaders();
  if (init.body && !(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await request(`${API_BASE}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new MaintenanceApiError(
      write
        ? "The connection was interrupted. The save may have finished. Retry the same save to check safely."
        : "Couldn't connect. Check your connection and try again.",
      0,
      Boolean(write),
    );
  }
  if (response.status === 401)
    throw new MaintenanceApiError(
      "Your session has ended. Sign in again to continue.",
      401,
    );
  if (response.status === 403)
    throw new MaintenanceApiError(
      "You don't have permission for this action. Your account may have changed.",
      403,
    );
  if (response.status === 409)
    throw new MaintenanceApiError(
      "This record has changed. Load the latest record before making more changes.",
      409,
    );
  if (response.status === 404)
    throw new MaintenanceApiError(
      "This record or feature isn't available. Refresh and try again.",
      404,
    );
  if (!response.ok) {
    let message = "Couldn't complete the request. Please try again.";
    try {
      const body = await response.json();
      if (typeof body.message === "string") message = body.message;
      else if (Array.isArray(body.message))
        message = body.message
          .filter((item: unknown) => typeof item === "string")
          .join(" ");
    } catch {
      /* The service may have returned HTML. Never expose it. */
    }
    const uncertain = Boolean(write && response.status >= 500);
    if (uncertain)
      message =
        "The server couldn't confirm the save. It may have finished. Retry the same save to check safely.";
    throw new MaintenanceApiError(message, response.status, uncertain);
  }
  try {
    const body = await response.json();
    if (body.success === false)
      throw new Error("The server did not confirm success.");
    return body as T;
  } catch {
    throw new MaintenanceApiError(
      write
        ? "The save response was incomplete. Retry the same save to check safely."
        : "The server returned an incomplete response. Please retry.",
      response.status,
      Boolean(write),
    );
  }
}
/** Bound the full response, including JSON parsing; a timed-out write stays uncertain. */
async function withMaintenanceDeadline<T>(
  run: (signal: AbortSignal) => Promise<T>,
  init: RequestInit = {},
  timeoutMs = 20_000,
): Promise<T> {
  const controller = new AbortController();
  const write = Boolean(init.method && init.method !== "GET");
  const originalSignal = init.signal;
  if (originalSignal?.aborted)
    throw new DOMException("Request cancelled", "AbortError");
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  const interrupted = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(
        new MaintenanceApiError(
          write
            ? "The save timed out. It may have finished. Retry the same save to check safely."
            : "Loading timed out. Please try again.",
          0,
          write,
        ),
      );
    }, timeoutMs);
    onAbort = () => {
      controller.abort();
      reject(new DOMException("Request cancelled", "AbortError"));
    };
    originalSignal?.addEventListener("abort", onAbort, { once: true });
  });
  try {
    return await Promise.race([run(controller.signal), interrupted]);
  } finally {
    if (timer) clearTimeout(timer);
    if (onAbort) originalSignal?.removeEventListener("abort", onAbort);
  }
}

export async function maintenanceRequest<T>(
  path: string,
  init: RequestInit = {},
  request: Requester = fetch,
  timeoutMs = 20_000,
): Promise<T> {
  return withMaintenanceDeadline(
    (signal) => readMaintenanceResponse<T>(path, { ...init, signal }, request),
    init,
    timeoutMs,
  );
}

export function buildMaintenanceQuery(
  category: MaintenanceCategory,
  filters: MaintenanceFilters,
  offset: number,
): string {
  const query = new URLSearchParams({
    category,
    offset: String(offset),
    limit: "20",
  });
  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim()) query.set(key, value.trim());
  });
  return query.toString();
}
export async function listMaintenance(
  category: MaintenanceCategory,
  filters: MaintenanceFilters,
  offset: number,
  signal?: AbortSignal,
): Promise<MaintenanceList> {
  const result = await maintenanceRequest<MaintenanceList>(
    `/api/gps/maintenance?${buildMaintenanceQuery(category, filters, offset)}`,
    { signal },
  );
  if (
    !Array.isArray(result.data) ||
    typeof result.total !== "number" ||
    !result.summary ||
    !result.asOfDate
  )
    throw new MaintenanceApiError(
      "The maintenance list is incomplete. Please retry.",
    );
  return result;
}
export async function listMaintenanceVehicles(
  signal?: AbortSignal,
): Promise<MaintenanceVehicle[]> {
  const response = await maintenanceRequest<{ data: MaintenanceVehicle[] }>(
    "/api/gps/vehicles",
    { signal },
  );
  if (!Array.isArray(response.data))
    throw new MaintenanceApiError(
      "The vehicle list is incomplete. Please retry.",
    );
  return response.data.map(({ id, vehicleNo, name }) => ({
    id,
    vehicleNo,
    name,
  }));
}
export async function getMaintenanceRecord(
  id: string,
  signal?: AbortSignal,
): Promise<MaintenanceRecord> {
  const response = await maintenanceRequest<{ data: MaintenanceRecord }>(
    `/api/gps/maintenance/${encodeURIComponent(id)}`,
    { signal },
  );
  if (
    !response.data ||
    typeof response.data.id !== "string" ||
    typeof response.data.version !== "number"
  )
    throw new MaintenanceApiError(
      "The record is incomplete. Please reload it.",
    );
  return response.data;
}
export async function saveMaintenanceRecord(
  path: string,
  body: object,
  method = "POST",
): Promise<MaintenanceRecord> {
  const response = await maintenanceRequest<{ data: MaintenanceRecord }>(
    `/api/gps/maintenance${path}`,
    { method, body: JSON.stringify(body) },
  );
  if (!response.data?.id || !Number.isInteger(response.data.version))
    throw new MaintenanceApiError(
      "The save response was incomplete. Retry the same save to check safely.",
      200,
      true,
    );
  return response.data;
}
export async function addMaintenanceAttachment(
  id: string,
  version: number,
  file: File,
): Promise<MaintenanceRecord> {
  const body = new FormData();
  body.set("version", String(version));
  body.set("file", file);
  const response = await maintenanceRequest<{ data: MaintenanceRecord }>(
    `/api/gps/maintenance/${encodeURIComponent(id)}/attachments`,
    { method: "POST", body },
  );
  if (!response.data?.id)
    throw new MaintenanceApiError(
      "The upload response was incomplete. Reload the record to check its attachments.",
      200,
      true,
    );
  return response.data;
}
export async function downloadMaintenanceAttachment(
  recordId: string,
  attachmentId: string,
): Promise<Blob> {
  return withMaintenanceDeadline(async (signal) => {
    let response: Response;
    try {
      response = await fetch(
        `${API_BASE}/api/gps/maintenance/${encodeURIComponent(recordId)}/attachments/${encodeURIComponent(attachmentId)}/download`,
        { headers: authHeaders(), cache: "no-store", signal },
      );
    } catch (error) {
      if (error instanceof MaintenanceApiError) throw error;
      throw new MaintenanceApiError(
        "Couldn't download the attachment. Please retry.",
      );
    }
    if (response.status === 401)
      throw new MaintenanceApiError(
        "Your session has ended. Sign in again to continue.",
        401,
      );
    if (!response.ok)
      throw new MaintenanceApiError(
        "This private attachment could not be downloaded. Refresh the record and try again.",
        response.status,
      );
    const contentType = response.headers
      .get("Content-Type")
      ?.split(";")[0]
      .trim();
    if (!contentType || !["image/jpeg", "image/png"].includes(contentType))
      throw new MaintenanceApiError(
        "The attachment response was not a supported image.",
      );
    return response.blob();
  });
}
