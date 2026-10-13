import RoleRouteGuard from "@/components/auth/RoleRouteGuard";
import MaintenanceWorkspace from "@/components/maintenance/MaintenanceWorkspace";

export default function MaintenancePage() {
  return (
    <RoleRouteGuard
      allowedRoles={["SUPER_ADMIN", "ADMIN", "DEALER", "CUSTOMER", "USER"]}
    >
      <MaintenanceWorkspace />
    </RoleRouteGuard>
  );
}
