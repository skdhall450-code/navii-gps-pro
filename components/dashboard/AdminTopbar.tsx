"use client";

import {
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";

export default function AdminTopbar() {
  return (
    <header className="fixed left-[270px] right-0 top-0 z-40 flex h-[78px] items-center justify-between border-b border-white/10 bg-[#08111f]/95 px-6 backdrop-blur">
      <div>
        <p className="text-xs text-slate-400">
          NAVII GPS INDIA
        </p>

        <h2 className="text-lg font-semibold text-white">
          Super Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 lg:flex">
          <Search className="h-4 w-4 text-slate-400" />

          <input
            placeholder="Search vehicle, IMEI..."
            className="w-56 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <button
          type="button"
          className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-slate-300 hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <UserCircle2 className="h-8 w-8 text-sky-400" />

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white">
              Super Admin
            </p>

            <p className="text-xs text-slate-400">
              NAVII GPS
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}