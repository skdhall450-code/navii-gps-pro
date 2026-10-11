import { findCatalogEntry } from './device-command-profiles';
import { getDeviceSetupPreset } from './device-setup';

// Device API has no observed protocol, configured profile, or receiver port.
// An exact model mapping is descriptive only, never evidence of live configuration.
export function getModelProtocol(model: string | null | undefined): string {
  if (!model?.trim()) return 'Unknown';
  if (getDeviceSetupPreset(model)?.profileId === 'jimi-concox-gt06-current') return 'GT06 binary TCP';
  const catalog = findCatalogEntry(model);
  if (!catalog || catalog.status === 'MANUAL_REQUIRED' || catalog.status === 'ACCESSORY_ONLY') return 'Unknown; exact device profile required';
  return catalog.protocol;
}
