"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

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

type RoleRouteGuardProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

type GuardState =
  | "CHECKING"
  | "AUTHORIZED"
  | "REDIRECTING";

export default function RoleRouteGuard({
  allowedRoles,
  children,
}: RoleRouteGuardProps) {
  const router = useRouter();

  const [guardState, setGuardState] =
    useState<GuardState>(
      "CHECKING",
    );

  /*
   * Parent components often pass an
   * inline array:
   *
   * allowedRoles={[
   *   "SUPER_ADMIN",
   *   "ADMIN",
   * ]}
   *
   * That creates a new array reference
   * on renders. A stable string prevents
   * unnecessary effect re-runs.
   */
  const allowedRolesKey =
    useMemo(
      () =>
        [...allowedRoles]
          .sort()
          .join("|"),
      [allowedRoles],
    );

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      const storedUser =
        localStorage.getItem(
          "navii_user",
        );

      const token =
        localStorage.getItem(
          "navii_access_token",
        );

      if (
        !storedUser ||
        !token
      ) {
        if (!cancelled) {
          setGuardState(
            "REDIRECTING",
          );

          router.replace(
            "/login",
          );
        }

        return;
      }

      try {
        const user =
          JSON.parse(
            storedUser,
          ) as AuthUser;

        const roles =
          allowedRolesKey
            .split("|")
            .filter(
              Boolean,
            ) as UserRole[];

        const allowed =
          roles.includes(
            user.role,
          );

        if (!allowed) {
          if (!cancelled) {
            setGuardState(
              "REDIRECTING",
            );

            /*
             * Unauthorized users go
             * back to their own safe
             * dashboard.
             */
            router.replace(
              "/dashboard",
            );
          }

          return;
        }

        if (!cancelled) {
          setGuardState(
            "AUTHORIZED",
          );
        }
      } catch {
        localStorage.removeItem(
          "navii_access_token",
        );

        localStorage.removeItem(
          "navii_user",
        );

        if (!cancelled) {
          setGuardState(
            "REDIRECTING",
          );

          router.replace(
            "/login",
          );
        }
      }
    }

    void checkAccess();

    return () => {
      cancelled = true;
    };
  }, [
    allowedRolesKey,
    router,
  ]);

  if (
    guardState !==
    "AUTHORIZED"
  ) {
    return (
      <div className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-[#050b16] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-sky-400" />

          <p className="mt-4 text-sm text-slate-400">
            {guardState ===
            "REDIRECTING"
              ? "Redirecting..."
              : "Checking access..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}