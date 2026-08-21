"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  MapPin,
  ShieldCheck,
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

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    user?: AuthUser;
  };
};

type MeResponse = {
  success?: boolean;
  message?: string;
  data?: AuthUser;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

function getDashboardPath(role: UserRole) {
  switch (role) {
    case "SUPER_ADMIN":
      return "/dashboard";

    case "ADMIN":
      return "/dashboard";

    case "DEALER":
      return "/dashboard";

    case "CUSTOMER":
      return "/dashboard";

    default:
      return "/dashboard";
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password.",
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * STEP 1
       * Login against real NestJS backend.
       */
      const loginResponse = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        },
      );

      const loginJson =
        (await loginResponse.json()) as LoginResponse;

      if (!loginResponse.ok) {
        throw new Error(
          loginJson.message ||
            "Invalid email or password.",
        );
      }

      const token =
        loginJson.data?.accessToken;

      if (!token) {
        throw new Error(
          "Authentication token was not returned by the server.",
        );
      }

      /*
       * STEP 2
       * Verify JWT against /auth/me.
       *
       * Do not trust only the role returned
       * from the login response.
       */
      const meResponse = await fetch(
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

      const meJson =
        (await meResponse.json()) as MeResponse;

      if (!meResponse.ok) {
        throw new Error(
          meJson.message ||
            "Unable to verify login session.",
        );
      }

      const user = meJson.data;

      if (!user) {
        throw new Error(
          "User profile was not returned by the server.",
        );
      }

      /*
       * STEP 3
       * Save current session.
       *
       * This is our current frontend
       * implementation. Later we can move
       * production auth to secure HttpOnly
       * cookies.
       */
      localStorage.setItem(
        "navii_access_token",
        token,
      );

      localStorage.setItem(
        "navii_user",
        JSON.stringify(user),
      );

      /*
       * STEP 4
       * Redirect according to role.
       */
      router.replace(
        getDashboardPath(user.role),
      );

      router.refresh();
    } catch (err) {
      localStorage.removeItem(
        "navii_access_token",
      );

      localStorage.removeItem(
        "navii_user",
      );

      if (err instanceof TypeError) {
        setError(
          "Unable to connect to NAVII GPS server. Please check the API connection.",
        );
      } else if (
        err instanceof Error
      ) {
        setError(err.message);
      } else {
        setError(
          "Login failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative flex min-h-screen overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-[-120px] h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[140px]" />

          <div className="absolute bottom-[-180px] right-[-120px] h-[560px] w-[560px] rounded-full bg-cyan-500/10 blur-[150px]" />

          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize:
                "48px 48px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1500px] lg:grid-cols-2">
          {/* Left side */}
          <section className="hidden flex-col justify-between px-12 py-12 lg:flex xl:px-20">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 shadow-lg shadow-blue-500/10">
                  <MapPin className="h-7 w-7 text-blue-400" />
                </div>

                <div>
                  <div className="text-2xl font-black tracking-wide">
                    NAVII GPS
                  </div>

                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
                    India (OPC) Pvt. Ltd.
                  </div>
                </div>
              </div>

              <div className="mt-28 max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                  <ShieldCheck className="h-4 w-4" />
                  GPS Intelligence Platform
                </div>

                <h1 className="text-5xl font-black leading-[1.08] xl:text-6xl">
                  Track.
                  <br />
                  Monitor.
                  <br />

                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Control.
                  </span>
                </h1>

                <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">
                  Secure access to your NAVII GPS
                  fleet management and live vehicle
                  tracking platform.
                </p>

                <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                  <Feature
                    title="Live"
                    text="Tracking"
                  />

                  <Feature
                    title="Smart"
                    text="Alerts"
                  />

                  <Feature
                    title="Secure"
                    text="Access"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              NAVII GPS INDIA (OPC) PVT. LTD.
            </p>
          </section>

          {/* Login side */}
          <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-md">
              {/* Mobile branding */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>

                <div>
                  <div className="text-xl font-black">
                    NAVII GPS
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400">
                    India (OPC) Pvt. Ltd.
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                    <LockKeyhole className="h-6 w-6 text-blue-400" />
                  </div>

                  <h2 className="text-3xl font-black">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Sign in to access your NAVII GPS
                    dashboard.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(
                            event.target.value,
                          )
                        }
                        disabled={loading}
                        placeholder="name@naviigps.com"
                        className="h-14 w-full rounded-xl border border-white/10 bg-slate-950/70 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value,
                          )
                        }
                        disabled={loading}
                        placeholder="Enter password"
                        className="h-14 w-full rounded-xl border border-white/10 bg-slate-950/70 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-7 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />

                    <span>
                      Secure role-based access
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-600">
                Authorized users only. Access is
                controlled according to your NAVII GPS
                account role.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Feature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
      <div className="text-lg font-black text-white">
        {title}
      </div>

      <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">
        {text}
      </div>
    </div>
  );
}