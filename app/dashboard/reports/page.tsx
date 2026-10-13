"use client";
import RoleRouteGuard from "@/components/auth/RoleRouteGuard";
import ReportsWorkspace from "@/components/reports/ReportsWorkspace";
export default function ReportsPage() {
  return <RoleRouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DEALER", "CUSTOMER", "USER"]}><ReportsWorkspace /></RoleRouteGuard>;
}
