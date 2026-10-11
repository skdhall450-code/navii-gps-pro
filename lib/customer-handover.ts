/** Login identity and handover delivery are deliberately separate. */
export type DeliveryContact = {
  deliveryEmail?: string | null;
  deliveryEmailConfirmedAt?: string | null;
  deliveryEmailConfirmedById?: string | null;
};

export type Handover = {
  id: string;
  status: string;
  reason: string | null;
  recipientEmail: string | null;
  retryRecipientEmail?: string | null;
  ownerCopyEmail?: string | null;
  createdAt: string;
  acceptedAt: string | null;
  canRetry: boolean;
  artifactsReady: boolean;
  vehicleId: string;
  customerId: string;
};

export type HandoverScope = { customerId: string; vehicleId?: never } | { vehicleId: string; customerId?: never };
export type ArtifactFormat = "pdf" | "png";

export function deliveryContactPayload(email: string, confirmed: boolean) {
  const deliveryEmail = email.trim().toLowerCase();
  if (!deliveryEmail) return { deliveryEmail: null, deliveryEmailConfirmed: false };
  if (deliveryEmail.length > 254 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(deliveryEmail)) {
    throw new Error("Enter one valid customer delivery email address.");
  }
  if (!confirmed) {
    throw new Error("Confirm that the delivery email is the customer's intended reachable address before saving.");
  }
  return { deliveryEmail, deliveryEmailConfirmed: true };
}

export function hasConfirmedDelivery(contact: DeliveryContact) {
  return Boolean(contact.deliveryEmail?.trim() && contact.deliveryEmailConfirmedAt && contact.deliveryEmailConfirmedById);
}

/** Ordinary profile edits must not rewrite the server's confirmation provenance. */
export function deliveryContactUpdate(email: string, confirmed: boolean, previous?: DeliveryContact) {
  if (previous && email.trim().toLowerCase() === (previous.deliveryEmail || "").trim().toLowerCase() && confirmed === hasConfirmedDelivery(previous)) return {};
  return deliveryContactPayload(email, confirmed);
}

export function handoverPresentation(status: string): { label: string; detail: string; tone: "sky" | "amber" | "emerald" | "red" | "slate" } {
  switch (status) {
    case "QUEUED": return { label: "Pending", detail: "Waiting for the handover worker.", tone: "sky" };
    case "PROCESSING": return { label: "Processing", detail: "Preparing the handover or submitting it to the email provider.", tone: "sky" };
    case "ACCEPTED": return { label: "Sent to provider", detail: "The email provider accepted the message. Inbox arrival is not confirmed.", tone: "emerald" };
    case "BLOCKED": return { label: "Blocked", detail: "A delivery requirement must be resolved before sending.", tone: "amber" };
    case "FAILED": return { label: "Failed", detail: "The handover could not be completed. Review the reason below.", tone: "red" };
    case "NEEDS_REVIEW": return { label: "Needs review", detail: "The outcome is uncertain. Automatic retry is disabled to avoid duplicate email.", tone: "amber" };
    case "SUPERSEDED": return { label: "Superseded", detail: "This record has been replaced or its assignment is no longer current.", tone: "slate" };
    default: return { label: "Status unavailable", detail: "Refresh to retrieve the current handover status.", tone: "slate" };
  }
}

export function canRetryHandover(handover: Handover) {
  return handover.canRetry === true && ["BLOCKED", "FAILED"].includes(handover.status) &&
    typeof handover.retryRecipientEmail === "string" && Boolean(handover.retryRecipientEmail.trim());
}

function endpoint(apiBase: string, suffix = "") {
  return `${apiBase.replace(/\/$/, "")}/api/gps/handovers${suffix}`;
}

function authHeaders(token: string, json = false): HeadersInit {
  if (!token.trim()) throw new Error("Your session has expired. Sign in again.");
  return { Authorization: `Bearer ${token}`, ...(json ? { "Content-Type": "application/json" } : {}) };
}

async function readResult(response: Response) {
  if (response.status === 401) throw new Error("Your session has expired. Sign in again.");
  if (response.status === 403) throw new Error("You do not have permission to access this handover.");
  if (response.status === 409) throw new Error("This handover or its recipient changed. Refresh and review before retrying.");
  let result;
  try { result = await response.json(); } catch { throw new Error("The handover service returned an invalid response."); }
  if (!response.ok || !result || result.success !== true) {
    throw new Error(typeof result?.message === "string" ? result.message : "Unable to load the handover. Please try again.");
  }
  return result;
}

function isHandover(value: unknown): value is Handover {
  if (!value || typeof value !== "object") return false;
  const job = value as Record<string, unknown>;
  return ["id", "status", "createdAt", "vehicleId", "customerId"].every((field) => typeof job[field] === "string" && Boolean(job[field])) &&
    ["artifactsReady", "canRetry"].every((field) => typeof job[field] === "boolean") &&
    ["recipientEmail", "retryRecipientEmail", "ownerCopyEmail", "reason", "acceptedAt"].every((field) => job[field] == null || typeof job[field] === "string");
}

export async function fetchHandovers(apiBase: string, token: string, scope: HandoverScope, signal?: AbortSignal, request: typeof fetch = fetch): Promise<Handover[]> {
  const query = scope.customerId ? `customerId=${encodeURIComponent(scope.customerId)}` : `vehicleId=${encodeURIComponent(scope.vehicleId || "")}`;
  if (!scope.customerId && !scope.vehicleId) throw new Error("A customer or vehicle is required.");
  const response = await request(`${endpoint(apiBase)}?${query}`, { headers: authHeaders(token), cache: "no-store", signal });
  const result = await readResult(response);
  if (!Array.isArray(result.data) || !result.data.every(isHandover)) throw new Error("The handover service returned an invalid list.");
  return result.data;
}

export async function retryHandover(apiBase: string, token: string, handover: Handover, signal?: AbortSignal, request: typeof fetch = fetch): Promise<Handover> {
  if (!canRetryHandover(handover)) throw new Error("This handover is not eligible for a safe retry.");
  const response = await request(endpoint(apiBase, `/${encodeURIComponent(handover.id)}/retry`), {
    method: "POST", headers: authHeaders(token, true),
    body: JSON.stringify({ expectedRecipientEmail: handover.retryRecipientEmail }), signal,
  });
  const result = await readResult(response);
  if (!isHandover(result.data)) throw new Error("The handover service returned an invalid retry response. Refresh to check its status.");
  return result.data;
}

export async function fetchHandoverArtifact(apiBase: string, token: string, handover: Handover, format: ArtifactFormat, signal?: AbortSignal, request: typeof fetch = fetch): Promise<Blob> {
  if (!handover.artifactsReady) throw new Error("Handover files are not ready yet.");
  if (format !== "pdf" && format !== "png") throw new Error("Unsupported handover file format.");
  const response = await request(endpoint(apiBase, `/${encodeURIComponent(handover.id)}/download/${format}`), {
    headers: authHeaders(token), cache: "no-store", signal,
  });
  if (!response.ok) { await readResult(response); throw new Error("Unable to download this handover."); }
  const expectedType = format === "pdf" ? "application/pdf" : "image/png";
  if (response.headers.get("Content-Type")?.split(";")[0].trim() !== expectedType) {
    throw new Error("The server did not return the requested handover file.");
  }
  const blob = await response.blob();
  if (!blob.size) throw new Error("The handover file is empty. Please refresh and try again.");
  return blob;
}
