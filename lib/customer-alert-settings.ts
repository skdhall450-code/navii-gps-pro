export type CustomerAlertVehicle = { id: string; vehicleNo: string; name: string | null };
export type CustomerAlertCapabilities = { geofenceWrite: boolean; overspeedConfiguration: boolean; eventEvaluation: boolean; emailDelivery: boolean; smsDelivery: boolean; lowBattery: boolean };
export type CustomerAlertInput = { revision: number; overspeedEnabled: boolean; speedLimitKph: number; cooldownMinutes: number; emailRequested: boolean; emailRecipients: string[] };
export type CustomerAlertSetting = CustomerAlertInput & { vehicleId: string };
export type CustomerCircleInput = { name: string; latitude: number; longitude: number; radius: number; isActive: boolean; alertOnEntry: boolean; alertOnExit: boolean };
export type CustomerCircle = CustomerCircleInput & { id: string; vehicleId: string; revision: number; clientRequestId: string };
export const blankCustomerSetting = (): CustomerAlertInput => ({ revision: 0, overspeedEnabled: false, speedLimitKph: 80, cooldownMinutes: 10, emailRequested: false, emailRecipients: [] });
export const blankCustomerCircle = (): CustomerCircleInput => ({ name: "", latitude: 0, longitude: 0, radius: 500, isActive: true, alertOnEntry: true, alertOnExit: true });
export function parseCustomerRecipients(value: string): string[] { return [...new Set(value.split(/[,;\n]/).map(email => email.trim().toLowerCase()).filter(Boolean))]; }
export function validateCustomerSetting(input: CustomerAlertInput): string | null {
 if (!Number.isInteger(input.speedLimitKph) || input.speedLimitKph < 1 || input.speedLimitKph > 250) return "Choose a speed limit from 1 to 250 km/h.";
 if (!Number.isInteger(input.cooldownMinutes) || input.cooldownMinutes < 1 || input.cooldownMinutes > 1440) return "Choose a repeat interval from 1 to 1,440 minutes.";
 if (input.emailRecipients.length > 5 || input.emailRecipients.some(email => email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return "Enter up to five valid email addresses, separated by commas.";
 if (input.emailRequested && !input.emailRecipients.length) return "Add an email address before requesting future email alerts.";
 return null;
}
export function validateCustomerCircle(input: CustomerCircleInput): string | null {
 if (!input.name.trim() || input.name.trim().length > 80) return "Enter an area name from 1 to 80 characters.";
 if (!Number.isFinite(input.latitude) || Math.abs(input.latitude) > 90 || !Number.isFinite(input.longitude) || Math.abs(input.longitude) > 180) return "Enter valid latitude and longitude coordinates.";
 if (!Number.isFinite(input.radius) || input.radius < 50 || input.radius > 100000) return "Choose a radius from 50 to 100,000 metres.";
 return null;
}

export type PendingCustomerWrite = { path: string; method: string; vehicleId: string; payload: Record<string, unknown>; beforeIds: string[] };
export function isCustomerWriteVerified(pending: PendingCustomerWrite, settings: CustomerAlertSetting[], circles: CustomerCircle[], scope?: { complete: boolean; eligibleVehicleIds: string[] }): boolean {
 const same = (record: object) => Object.entries(pending.payload).filter(([key]) => !['revision','clientRequestId'].includes(key)).every(([key,value]) => JSON.stringify((record as Record<string,unknown>)[key]) === JSON.stringify(value));
 const id = decodeURIComponent(pending.path.split('/').at(-1) || '');
 if (pending.method === 'DELETE') return scope?.complete === true && scope.eligibleVehicleIds.includes(pending.vehicleId) && !circles.some(circle => circle.id === id);
 if (pending.method === 'PUT') return settings.some(setting => setting.vehicleId === pending.vehicleId && setting.revision > Number(pending.payload.revision) && same(setting));
 if (pending.method === 'PATCH') return circles.some(circle => circle.id === id && circle.revision > Number(pending.payload.revision) && same(circle));
 if (pending.method === 'POST') return circles.some(circle => !pending.beforeIds.includes(circle.id) && (circle as CustomerCircle & { clientRequestId?: string }).clientRequestId === pending.payload.clientRequestId && same(circle));
 return false;
}
