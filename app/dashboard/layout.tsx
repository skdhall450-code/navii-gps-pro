"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  Bell,
  Car,
  CalendarCheck2,
  ChartNoAxesCombined,
  CreditCard,
  ReceiptIndianRupee,
  ChevronRight,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Radio,
  Store,
  UserRound,
  UsersRound,
} from "lucide-react";

type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "DEALER"
  | "CUSTOMER"
  | "USER";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  dealerId?: string | null;
  customerId?: string | null;
};

type MeResponse = {
  success?: boolean;
  message?: string;
  data?: AuthUser;
};

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  roles: UserRole[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
  {
    name: "Vehicles",
    href: "/dashboard/vehicles",
    icon: Car,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
  {
    name: "Devices",
    href: "/dashboard/devices",
    icon: Radio,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
    ],
  },
  {
    name: "Live Tracking",
    href: "/dashboard/live-tracking",
    icon: Map,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: Activity,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
  {
    name: "Geofences",
    href: "/dashboard/geofences",
    icon: MapPin,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
];

const managementNavigation: NavItem[] = [
  {
    name: "Billing Plans",
    href: "/dashboard/billing/plans",
    icon: CreditCard,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
    ],
  },
  {
    name: "Subscriptions",
    href: "/dashboard/billing/subscriptions",
    icon: CalendarCheck2,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
  {
    name: "Invoices & Payments",
    href: "/dashboard/billing/invoices",
    icon: ReceiptIndianRupee,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
    ],
  },
  {
    name: "Billing Reports",
    href: "/dashboard/billing/reports",
    icon: ChartNoAxesCombined,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
      "CUSTOMER",
      "USER",
    ],
  },
  {
    name: "Dealers",
    href: "/dashboard/dealers",
    icon: Store,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
    ],
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: UserRound,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
    ],
  },
  {
    name: "Assignments",
    href: "/dashboard/assignments",
    icon: UsersRound,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DEALER",
    ],
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      const token =
        localStorage.getItem(
          "navii_access_token",
        );

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Invalid session",
          );
        }

        const json =
          (await response.json()) as MeResponse;

        if (!json.data) {
          throw new Error(
            "User profile missing",
          );
        }

        if (!cancelled) {
          setUser(json.data);

          localStorage.setItem(
            "navii_user",
            JSON.stringify(json.data),
          );

          setCheckingAuth(false);
        }
      } catch {
        localStorage.removeItem(
          "navii_access_token",
        );

        localStorage.removeItem(
          "navii_user",
        );

        if (!cancelled) {
          router.replace("/login");
        }
      }
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const allowedNavigation =
    useMemo(() => {
      if (!user) {
        return [];
      }

      return navigation.filter(
        (item) =>
          item.roles.includes(user.role),
      );
    }, [user]);

  const allowedManagementNavigation =
    useMemo(() => {
      if (!user) {
        return [];
      }

      return managementNavigation.filter(
        (item) =>
          item.roles.includes(user.role),
      );
    }, [user]);

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  function logout() {
    localStorage.removeItem(
      "navii_access_token",
    );

    localStorage.removeItem(
      "navii_user",
    );

    router.replace("/login");
    router.refresh();
  }

  if (checkingAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b16] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-sky-400" />

          <p className="mt-4 text-sm font-medium text-slate-400">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  const allMobileNavigation = [
    ...allowedNavigation,
    ...allowedManagementNavigation,
  ];

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-[270px] shrink-0 border-r border-white/10 bg-[#07101f] lg:flex lg:flex-col">
          {/* BRAND */}
          <div className="border-b border-white/10 px-6 py-6">
            <Link
              href="/dashboard"
              className="block"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20">
                  <MapPin className="h-6 w-6 text-sky-400" />
                </div>

                <div>
                  <p className="text-lg font-bold tracking-wide">
                    NAVII GPS
                  </p>

                  <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-400">
                    CONTROL CENTER
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.22em] text-slate-500">
              GPS OPERATIONS
            </p>

            <nav className="space-y-1">
              {allowedNavigation.map(
                (item) => {
                  const Icon = item.icon;
                  const active =
                    isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                        active
                          ? "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-5 w-5 ${
                            active
                              ? "text-sky-400"
                              : "text-slate-500 group-hover:text-slate-300"
                          }`}
                        />

                        <span className="font-medium">
                          {item.name}
                        </span>
                      </div>

                      {active && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Link>
                  );
                },
              )}
            </nav>

            {allowedManagementNavigation.length >
              0 && (
              <>
                <div className="my-5 border-t border-white/10" />

                <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.22em] text-slate-500">
                  BUSINESS MANAGEMENT
                </p>

                <nav className="space-y-1">
                  {allowedManagementNavigation.map(
                    (item) => {
                      const Icon =
                        item.icon;

                      const active =
                        isActive(
                          item.href,
                        );

                      return (
                        <Link
                          key={
                            item.href
                          }
                          href={
                            item.href
                          }
                          className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                            active
                              ? "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20"
                              : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`h-5 w-5 ${
                                active
                                  ? "text-sky-400"
                                  : "text-slate-500 group-hover:text-slate-300"
                              }`}
                            />

                            <span className="font-medium">
                              {
                                item.name
                              }
                            </span>
                          </div>

                          {active && (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Link>
                      );
                    },
                  )}
                </nav>
              </>
            )}
          </div>

          {/* SIDEBAR FOOTER */}
          <div className="border-t border-white/10 p-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>

                <p className="text-xs font-semibold text-emerald-400">
                  GPS SERVER ONLINE
                </p>
              </div>

              <p className="mt-2 text-[11px] text-slate-500">
                NAVII GPS Platform
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="min-w-0 flex-1">
          {/* TOP BAR */}
          <header className="sticky top-0 z-40 flex h-[78px] items-center justify-between border-b border-white/10 bg-[#050b16]/95 px-5 backdrop-blur-xl md:px-7">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-400">
                NAVII GPS INDIA
              </p>

              <p className="mt-1 text-sm text-slate-400">
                GPS Fleet Management Platform
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  {user.name}
                </p>

                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-sky-400">
                  {user.role.replace(
                    /_/g,
                    " ",
                  )}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-500/20 bg-sky-500/10">
                <UserRound className="h-5 w-5 text-sky-400" />
              </div>

              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 lg:hidden"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* MOBILE NAVIGATION */}
          <div className="border-b border-white/10 bg-[#07101f] px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {allMobileNavigation.map(
                (item) => {
                  const active =
                    isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium ${
                        active
                          ? "bg-sky-500 text-white"
                          : "bg-white/[0.05] text-slate-400"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                },
              )}
            </div>
          </div>

          {/* PAGE */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
