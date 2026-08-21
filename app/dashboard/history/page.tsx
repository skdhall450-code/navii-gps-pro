"use client";

import dynamic from "next/dynamic";

import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

const HistoryPlayback = dynamic(
  () =>
    import(
      "@/components/history/HistoryPlayback"
    ),
  {
    ssr: false,

    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[#050b18] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-sky-400" />

          <p className="text-lg font-semibold">
            NAVII GPS INDIA
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Loading GPS History...
          </p>
        </div>
      </div>
    ),
  },
);

export default function HistoryPage() {
  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "DEALER",
        "CUSTOMER",
        "USER",
      ]}
    >
      <HistoryPlayback />
    </RoleRouteGuard>
  );
}