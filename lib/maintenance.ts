/** Date-only, manually maintained fleet records. No telemetry-derived fields. */
export const MAINTENANCE_CATEGORIES = [
  "SERVICE",
  "REGISTRATION",
  "INSURANCE",
  "INSPECTION",
  "CHALLAN",
] as const;
export type MaintenanceCategory = (typeof MAINTENANCE_CATEGORIES)[number];
export type MaintenanceState = "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type DueStatus =
  "UPCOMING" | "DUE_SOON" | "DUE_TODAY" | "OVERDUE" | "COMPLETED" | "ARCHIVED";
export type MaintenanceVehicle = {
  id: string;
  vehicleNo: string;
  name?: string | null;
};
export type CostItem = { description: string; amountPaise: number };
export type MaintenanceAttachment = {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};
export type MaintenanceHistory = {
  id: string;
  version: number;
  action: string;
  occurredAt: string;
  actor?: { id: string; name: string };
  snapshot: Partial<MaintenanceRecord>;
  details: {
    completedDate?: string | null;
    costItems?: CostItem[];
    manualOdometerKm?: number | null;
    notes?: string | null;
    attachmentId?: string;
  };
};
export type MaintenanceRecord = {
  id: string;
  version: number;
  vehicleId: string;
  vehicle?: MaintenanceVehicle;
  category: MaintenanceCategory;
  state: MaintenanceState;
  dueStatus: DueStatus;
  title: string;
  dueDate: string;
  validFromDate?: string | null;
  referenceNumber?: string | null;
  provider?: string | null;
  notes?: string | null;
  reminderDays: number;
  completedDate?: string | null;
  costItems?: CostItem[];
  totalCostPaise: number;
  manualOdometerKm?: number | null;
  odometerSource?: "MANUAL" | null;
  attachmentsCount?: number;
  attachments?: MaintenanceAttachment[];
  history?: MaintenanceHistory[];
  createdAt: string;
  updatedAt: string;
};
export type MaintenanceList = {
  data: MaintenanceRecord[];
  total: number;
  summary: Record<DueStatus, number>;
  asOfDate: string;
  timezone: string;
};
export type RecordInput = {
  vehicleId: string;
  category: MaintenanceCategory;
  title: string;
  dueDate: string;
  validFromDate?: string;
  referenceNumber?: string;
  provider?: string;
  notes?: string;
  reminderDays: number;
};
export type RecordForm = {
  vehicleId: string;
  category: MaintenanceCategory;
  title: string;
  dueDate: string;
  validFromDate: string;
  referenceNumber: string;
  provider: string;
  notes: string;
  reminderDays: string;
};
export type CompletionForm = {
  completedDate: string;
  nextDueDate: string;
  validFromDate: string;
  referenceNumber: string;
  provider: string;
  notes: string;
  manualOdometerKm: string;
  costItems: { description: string; amount: string }[];
};
export type MaintenanceFilters = {
  vehicleId: string;
  search: string;
  dueStatus: string;
  fromDate: string;
  toDate: string;
};

export const CATEGORY_LABELS: Record<MaintenanceCategory, string> = {
  SERVICE: "Services",
  REGISTRATION: "Registration",
  INSURANCE: "Insurance",
  INSPECTION: "Inspections",
  CHALLAN: "Challans",
};
export const STATUS_LABELS: Record<DueStatus, string> = {
  UPCOMING: "Upcoming",
  DUE_SOON: "Due soon",
  DUE_TODAY: "Due today",
  OVERDUE: "Overdue",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};
export const EMPTY_FILTERS: MaintenanceFilters = {
  vehicleId: "",
  search: "",
  dueStatus: "",
  fromDate: "",
  toDate: "",
};
export const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
export const MAX_TOTAL_PAISE = 1_000_000_000;

export function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value &&
    value >= "2000-01-01" &&
    value <= "2100-12-31"
  );
}
export function todayInIndia(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((key) => parts.find((part) => part.type === key)?.value)
    .join("-");
}
export function formatDate(value?: string | null): string {
  if (!value || !isDateOnly(value.slice(0, 10))) return "Not recorded";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}
/** Audit/attachment timestamps are instants; render them in the same India timezone as status. */
export function formatInstant(value?: string | null): string {
  if (!value) return "Not recorded";
  const instant = new Date(value);
  if (!Number.isFinite(instant.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  }).format(instant);
}
export function formatMoney(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}
/** Parse decimal INR without binary floating-point rounding. */
export function parseMoney(value: string): number {
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(value.trim()))
    throw new Error(
      "Enter a non-negative amount with up to two decimal places.",
    );
  const [whole, fraction = ""] = value.trim().split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(amount) || amount > MAX_TOTAL_PAISE)
    throw new Error("The total cost cannot exceed ₹1,00,00,000.");
  return amount;
}
export function costItemsFromForm(
  items: CompletionForm["costItems"],
): CostItem[] {
  if (items.length > 30) throw new Error("Use at most 30 cost items.");
  const result = items.map((item, index) => {
    if (!item.description.trim())
      throw new Error(`Add a description for cost item ${index + 1}.`);
    if (item.description.trim().length > 120)
      throw new Error("Cost descriptions must be 120 characters or fewer.");
    return {
      description: item.description.trim(),
      amountPaise: parseMoney(item.amount),
    };
  });
  if (result.reduce((sum, item) => sum + item.amountPaise, 0) > MAX_TOTAL_PAISE)
    throw new Error("The total cost cannot exceed ₹1,00,00,000.");
  return result;
}
export function newRecordForm(
  category: MaintenanceCategory,
  vehicleId = "",
): RecordForm {
  return {
    vehicleId,
    category,
    title: "",
    dueDate: "",
    validFromDate: "",
    referenceNumber: "",
    provider: "",
    notes: "",
    reminderDays: "30",
  };
}
export function editRecordForm(record: MaintenanceRecord): RecordForm {
  return {
    vehicleId: record.vehicleId,
    category: record.category,
    title: record.title,
    dueDate: record.dueDate,
    validFromDate: record.validFromDate || "",
    referenceNumber: record.referenceNumber || "",
    provider: record.provider || "",
    notes: record.notes || "",
    reminderDays: String(record.reminderDays),
  };
}
export function recordInput(form: RecordForm): RecordInput {
  if (!form.vehicleId) throw new Error("Choose a vehicle.");
  if (!MAINTENANCE_CATEGORIES.includes(form.category))
    throw new Error("Choose a valid record category.");
  const title = form.title.trim();
  if (!title || title.length > 120)
    throw new Error("Enter a title of 1 to 120 characters.");
  if (!isDateOnly(form.dueDate)) throw new Error("Enter a valid due date.");
  if (
    form.validFromDate &&
    (!isDateOnly(form.validFromDate) || form.validFromDate > form.dueDate)
  )
    throw new Error("The start date must be on or before the due date.");
  if (!/^\d{1,2}$/.test(form.reminderDays) || Number(form.reminderDays) > 90)
    throw new Error("The due-soon window must be between 0 and 90 days.");
  if (form.notes.length > 2000)
    throw new Error("Notes must be 2,000 characters or fewer.");
  if (
    form.referenceNumber.trim().length > 120 ||
    form.provider.trim().length > 120
  )
    throw new Error("Reference and provider must be 120 characters or fewer.");
  return {
    vehicleId: form.vehicleId,
    category: form.category,
    title,
    dueDate: form.dueDate,
    validFromDate: form.validFromDate || undefined,
    referenceNumber: form.referenceNumber.trim() || undefined,
    provider: form.provider.trim() || undefined,
    notes: form.notes.trim() || undefined,
    reminderDays: Number(form.reminderDays),
  };
}
export function validateDateRange(from: string, to: string): string | null {
  if ((from && !isDateOnly(from)) || (to && !isDateOnly(to)))
    return "Enter valid filter dates.";
  return from && to && from > to
    ? "The start date must be on or before the end date."
    : null;
}
export function canManageMaintenance(role?: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "DEALER"].includes(role || "");
}
export function validateAttachment(file: { type: string; size: number }): void {
  if (!["image/jpeg", "image/png"].includes(file.type))
    throw new Error(
      "Choose a JPG or PNG image. PDF and other formats are not supported yet.",
    );
  if (file.size < 1 || file.size > MAX_ATTACHMENT_BYTES)
    throw new Error("Choose an image no larger than 2 MB.");
}

export function completionInput(
  record: MaintenanceRecord,
  form: CompletionForm,
  today = todayInIndia(),
): Record<string, unknown> {
  if (!isDateOnly(form.completedDate) || form.completedDate > today)
    throw new Error(
      "The completion date must be a valid date on or before today in India.",
    );
  if (form.notes.length > 2000)
    throw new Error("Notes must be 2,000 characters or fewer.");
  const result: Record<string, unknown> = {
    version: record.version,
    completedDate: form.completedDate,
    costItems: costItemsFromForm(form.costItems),
    notes: form.notes.trim() || undefined,
  };
  const renewal =
    record.category === "REGISTRATION" || record.category === "INSURANCE";
  if (renewal) {
    if (
      !isDateOnly(form.nextDueDate) ||
      form.nextDueDate <= record.dueDate ||
      form.nextDueDate < form.completedDate
    )
      throw new Error(
        "The new expiry date must be later than the current expiry and on or after the renewal date.",
      );
    if (
      form.validFromDate &&
      (!isDateOnly(form.validFromDate) || form.validFromDate > form.nextDueDate)
    )
      throw new Error(
        "The start date must be on or before the new expiry date.",
      );
    if (
      form.referenceNumber.trim().length > 120 ||
      form.provider.trim().length > 120
    )
      throw new Error(
        "Reference and provider must be 120 characters or fewer.",
      );
    Object.assign(result, {
      dueDate: form.nextDueDate,
      validFromDate: form.validFromDate || null,
      referenceNumber: form.referenceNumber.trim() || null,
      provider: form.provider.trim() || null,
    });
  } else {
    if (form.nextDueDate) {
      if (record.category === "CHALLAN")
        throw new Error("A challan payment cannot start a recurring schedule.");
      if (
        !isDateOnly(form.nextDueDate) ||
        form.nextDueDate <= form.completedDate
      )
        throw new Error("The next due date must be after the completion date.");
      result.nextDueDate = form.nextDueDate;
    }
    if (record.category === "SERVICE" && form.manualOdometerKm !== "") {
      if (
        !/^\d{1,8}$/.test(form.manualOdometerKm) ||
        Number(form.manualOdometerKm) > 10_000_000
      )
        throw new Error(
          "Enter a whole-number manual odometer reading from 0 to 10,000,000 km, or leave it blank.",
        );
      result.manualOdometerKm = Number(form.manualOdometerKm);
    }
  }
  return result;
}
