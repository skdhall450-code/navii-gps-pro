// Use the same clock snapshot as tracking-state; future dates are not fresh contact.
export function formatLastSeen(value: string | null, now: number): string {
  if (!value) return 'Never';
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp) || !Number.isFinite(now)) return 'Unknown';
  const age = now - timestamp;
  if (age < 0) return 'Clock ahead';
  const seconds = Math.floor(age / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
