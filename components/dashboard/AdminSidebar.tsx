"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  Car,
  ChartNoAxesCombined,
  Clock3,
  Gauge,
  MapPinned,
  RadioTower,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    name: "Live Tracking",
    href: "/live-tracking",
    icon: RadioTower,
  },
  {
    name: "History / Playback",
    href: "/history",
    icon: Clock3,
  },
  {
    name: "Vehicles",
    href: "/dashboard/vehicles",
    icon: Car,
  },
  {
    name: "Devices",
    href: "/dashboard/devices",
    icon: ShieldCheck,
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    name: "Geofences",
    href: "/dashboard/geofences",
    icon: MapPinned,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Dealers / Customers",
    href: "/dashboard/accounts",
    icon: Users,
  },
  {
    name: "Companies",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-white/10 bg-[#07111f]">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-xs font-semibold tracking-[0.32em] text-sky-400">
          NAVII GPS INDIA
        </p>

        <h1 className="mt-2 text-xl font-bold text-white">
          Admin Control
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          GPS Tracking Platform
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />

                <span>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-400">
            Platform Status
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

            <span className="text-sm font-semibold text-emerald-400">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}