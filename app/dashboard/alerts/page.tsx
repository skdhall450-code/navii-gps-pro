"use client";

import RoleRouteGuard from '@/components/auth/RoleRouteGuard';
import SmartAlertsPanel from '@/components/alerts/SmartAlertsPanel';
import { ALERT_ROLES } from '@/lib/smart-alerts';

export default function AlertsPage() {
  return <RoleRouteGuard allowedRoles={[...ALERT_ROLES]}><SmartAlertsPanel /></RoleRouteGuard>;
}
