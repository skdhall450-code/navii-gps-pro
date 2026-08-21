"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Activity,
  AlertTriangle,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  IndianRupee,
  Loader2,
  ReceiptIndianRupee,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

const API_URL =
  (
    process.env.NEXT_PUBLIC_API_URL ??
    "https://api.naviigps.com"
  ).replace(
    /\/$/,
    "",
  );

type Feedback = {
  type:
    | "success"
    | "error";

  message:
    string;
};

type ReportPeriod = {
  from: string;
  to: string;
  months: number;
};

type BillingSummary = {
  totalInvoices: number;
  outstandingInvoices: number;
  paidInvoices: number;
  cancelledInvoices: number;
  overdueInvoices: number;
  totalPayments: number;
  confirmedPayments: number;
  invoicedAmount: string;
  invoicePaidAmount: string;
  collectedAmount: string;
  outstandingAmount: string;
  overdueAmount: string;
  collectionRate: number;
};

type SubscriptionSummary = {
  total: number;
  active: number;
  upcoming: number;
  expiring: number;
  needsAttention: number;
  autoRenew: number;
  distinctPlans: number;
};

type InvoiceStatusBreakdown = {
  status: string;
  count: number;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
};

type PaymentModeBreakdown = {
  mode: string;
  count: number;
  amount: string;
};

type SubscriptionStatusBreakdown = {
  status: string;
  count: number;
};

type MonthlyTrend = {
  month: string;
  label: string;
  invoiceCount: number;
  paymentCount: number;
  invoicedAmount: string;
  collectedAmount: string;
  outstandingAmount: string;
};

type RecentPayment = {
  id: string;
  amount: string;
  mode: string;
  status: string;
  referenceNo?: string | null;
  receivedAt: string;
  notes?: string | null;

  invoice: {
    id: string;
    invoiceNo: string;
    status: string;
    totalAmount: string;
    paidAmount: string;
    dueAmount: string;

    vehicle: {
      id: string;
      vehicleNo: string;
    };

    dealer?: {
      id: string;
      name: string;
    } | null;

    customer?: {
      id: string;
      name: string;
    } | null;
  };

  recordedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
};

type OverdueInvoice = {
  id: string;
  invoiceNo: string;
  status: string;
  issueDate: string;
  dueDate?: string | null;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  daysOverdue: number;

  plan: {
    id: string;
    name: string;
    code: string;
  };

  vehicle: {
    id: string;
    vehicleNo: string;
  };

  dealer?: {
    id: string;
    name: string;
  } | null;

  customer?: {
    id: string;
    name: string;
  } | null;
};

type BillingReport = {
  generatedAt: string;
  currency: string;
  period: ReportPeriod;
  summary: BillingSummary;
  subscriptions: SubscriptionSummary;
  invoiceStatusBreakdown:
    InvoiceStatusBreakdown[];
  paymentModeBreakdown:
    PaymentModeBreakdown[];
  subscriptionStatusBreakdown:
    SubscriptionStatusBreakdown[];
  monthlyTrend: MonthlyTrend[];
  recentPayments: RecentPayment[];
  overdueInvoices: OverdueInvoice[];
};

type BillingReportResponse = {
  success?: boolean;
  message?: string;
  data?: BillingReport;
  error?: string;
  statusCode?: number;
};

type MetricTone =
  | "cyan"
  | "green"
  | "amber"
  | "violet";

type MetricCardProps = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: MetricTone;
};

const metricToneStyles:
  Record<
    MetricTone,
    {
      icon: string;
      panel: string;
      border: string;
    }
  > = {
  cyan: {
    icon:
      "text-sky-300",

    panel:
      "bg-sky-500/10",

    border:
      "border-sky-500/25",
  },

  green: {
    icon:
      "text-emerald-300",

    panel:
      "bg-emerald-500/10",

    border:
      "border-emerald-500/25",
  },

  amber: {
    icon:
      "text-amber-300",

    panel:
      "bg-amber-500/10",

    border:
      "border-amber-500/25",
  },

  violet: {
    icon:
      "text-violet-300",

    panel:
      "bg-violet-500/10",

    border:
      "border-violet-500/25",
  },
};

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}: MetricCardProps) {
  const style =
    metricToneStyles[
      tone
    ];

  return (
    <article className="rounded-2xl border border-slate-700/70 bg-[#0a1929] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-2xl font-black tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
            style.icon,
            style.panel,
            style.border,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

function formatMoney(
  value:
    string |
    number,
) {
  const numericValue =
    Number(value);

  return new Intl.NumberFormat(
    "en-IN",
    {
      style:
        "currency",

      currency:
        "INR",

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2,
    },
  ).format(
    Number.isFinite(
      numericValue,
    )
      ? numericValue
      : 0,
  );
}

function formatDate(
  value?:
    string |
    null,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    },
  ).format(
    date,
  );
}

function formatDateTime(
  value?:
    string |
    null,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",
    },
  ).format(
    date,
  );
}

function humanize(
  value:
    string,
) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

function getErrorMessage(
  payload:
    unknown,
) {
  if (
    payload &&
    typeof payload ===
      "object" &&
    "message" in payload
  ) {
    const message =
      (
        payload as {
          message?: unknown;
        }
      ).message;

    if (
      typeof message ===
      "string"
    ) {
      return message;
    }

    if (
      Array.isArray(
        message,
      )
    ) {
      return message.join(
        ", ",
      );
    }
  }

  return "Unable to generate billing report.";
}

function getStatusStyle(
  status:
    string,
) {
  if (
    status ===
      "PAID" ||
    status ===
      "CONFIRMED" ||
    status ===
      "ACTIVE"
  ) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (
    status ===
      "UNPAID" ||
    status ===
      "PARTIALLY_PAID" ||
    status ===
      "PENDING" ||
    status ===
      "EXPIRING"
  ) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }

  if (
    status ===
      "OVERDUE" ||
    status ===
      "REJECTED" ||
    status ===
      "SUSPENDED" ||
    status ===
      "EXPIRED"
  ) {
    return "border-rose-500/30 bg-rose-500/10 text-rose-300";
  }

  if (
    status ===
      "UPCOMING"
  ) {
    return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  }

  return "border-slate-600 bg-slate-800/70 text-slate-300";
}

function escapeCsv(
  value:
    string |
    number,
) {
  const text =
    String(value);

  return `"${text.replace(
    /"/g,
    '""',
  )}"`;
}

export default function BillingReportsPage() {
  const router =
    useRouter();

  const [
    report,
    setReport,
  ] =
    useState<
      BillingReport |
      null
    >(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(
      false,
    );

  const [
    feedback,
    setFeedback,
  ] =
    useState<
      Feedback |
      null
    >(
      null,
    );

  const [
    months,
    setMonths,
  ] =
    useState(
      "12",
    );

  const [
    fromDate,
    setFromDate,
  ] =
    useState(
      "",
    );

  const [
    toDate,
    setToDate,
  ] =
    useState(
      "",
    );

  const usingCustomDates =
    Boolean(
      fromDate ||
      toDate,
    );

  const loadReport =
    useCallback(
      async (
        showSuccess =
          false,
      ) => {
        if (
          showSuccess
        ) {
          setRefreshing(
            true,
          );
        }
        else {
          setLoading(
            true,
          );
        }

        setFeedback(
          null,
        );

        try {
          const token =
            localStorage.getItem(
              "navii_access_token",
            );

          if (!token) {
            router.replace(
              "/login",
            );

            return;
          }

          const params =
            new URLSearchParams();

          if (
            fromDate
          ) {
            params.set(
              "from",
              fromDate,
            );
          }

          if (
            toDate
          ) {
            params.set(
              "to",
              toDate,
            );
          }

          if (
            !fromDate &&
            !toDate
          ) {
            params.set(
              "months",
              months,
            );
          }

          params.set(
            "limit",
            "10",
          );

          const response =
            await fetch(
              `${API_URL}/api/gps/billing/reports?${params.toString()}`,
              {
                method:
                  "GET",

                cache:
                  "no-store",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              },
            );

          const payload:
            BillingReportResponse =
            await response
              .json()
              .catch(
                () => ({}),
              );

          if (
            response.status ===
            401
          ) {
            localStorage.removeItem(
              "navii_access_token",
            );

            router.replace(
              "/login",
            );

            return;
          }

          if (
            !response.ok ||
            !payload.success ||
            !payload.data
          ) {
            throw new Error(
              getErrorMessage(
                payload,
              ),
            );
          }

          setReport(
            payload.data,
          );

          if (
            showSuccess
          ) {
            setFeedback({
              type:
                "success",

              message:
                "Billing report refreshed successfully.",
            });
          }
        }
        catch (error) {
          setFeedback({
            type:
              "error",

            message:
              error instanceof Error
                ? error.message
                : "Unable to generate billing report.",
          });
        }
        finally {
          setLoading(
            false,
          );

          setRefreshing(
            false,
          );
        }
      },
      [
        fromDate,
        months,
        router,
        toDate,
      ],
    );

  useEffect(
    () => {
      void loadReport();
    },
    [
      loadReport,
    ],
  );

  const maximumTrendValue =
    useMemo(
      () => {
        if (
          !report
        ) {
          return 1;
        }

        return Math.max(
          1,
          ...report.monthlyTrend.flatMap(
            (
              item,
            ) => [
              Number(
                item.invoicedAmount,
              ),
              Number(
                item.collectedAmount,
              ),
              Number(
                item.outstandingAmount,
              ),
            ],
          ),
        );
      },
      [
        report,
      ],
    );

  const downloadCsv =
    () => {
      if (
        !report
      ) {
        return;
      }

      const rows:
        Array<
          Array<
            string |
            number
          >
        > = [
        [
          "NAVII GPS Billing Report",
        ],

        [
          "Generated At",
          report.generatedAt,
        ],

        [
          "Period From",
          report.period.from,
        ],

        [
          "Period To",
          report.period.to,
        ],

        [],

        [
          "Summary",
          "Value",
        ],

        [
          "Total Invoices",
          report.summary
            .totalInvoices,
        ],

        [
          "Invoiced Amount",
          report.summary
            .invoicedAmount,
        ],

        [
          "Collected Amount",
          report.summary
            .collectedAmount,
        ],

        [
          "Outstanding Amount",
          report.summary
            .outstandingAmount,
        ],

        [
          "Overdue Amount",
          report.summary
            .overdueAmount,
        ],

        [
          "Collection Rate",
          `${report.summary.collectionRate}%`,
        ],

        [],

        [
          "Month",
          "Invoices",
          "Payments",
          "Invoiced",
          "Collected",
          "Outstanding",
        ],

        ...report.monthlyTrend.map(
          (
            item,
          ) => [
            item.label,
            item.invoiceCount,
            item.paymentCount,
            item.invoicedAmount,
            item.collectedAmount,
            item.outstandingAmount,
          ],
        ),
      ];

      const csv =
        rows
          .map(
            (
              row,
            ) =>
              row
                .map(
                  escapeCsv,
                )
                .join(
                  ",",
                ),
          )
          .join(
            "\r\n",
          );

      const blob =
        new Blob(
          [
            csv,
          ],
          {
            type:
              "text/csv;charset=utf-8",
          },
        );

      const url =
        URL.createObjectURL(
          blob,
        );

      const link =
        document.createElement(
          "a",
        );

      link.href =
        url;

      link.download =
        `NAVII-Billing-Report-${
          new Date()
            .toISOString()
            .slice(
              0,
              10,
            )
        }.csv`;

      document.body.appendChild(
        link,
      );

      link.click();
      link.remove();

      URL.revokeObjectURL(
        url,
      );

      setFeedback({
        type:
          "success",

        message:
          "Billing report CSV downloaded successfully.",
      });
    };

  const clearCustomDates =
    () => {
      setFromDate(
        "",
      );

      setToDate(
        "",
      );
    };

  return (
    <main className="min-h-screen bg-[#050d18] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-300">
              <ChartNoAxesCombined className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-400">
                Billing Management
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
                Billing Reports
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Monitor invoicing, collections,
                outstanding balances, payment
                channels and subscription health
                through secure role-scoped
                analytics.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={
                !report ||
                loading
              }
              onClick={
                downloadCsv
              }
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-[#081321] px-4 text-sm font-bold text-slate-200 transition hover:border-sky-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>

            <button
              type="button"
              disabled={
                refreshing ||
                loading
              }
              onClick={() =>
                void loadReport(
                  true,
                )
              }
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-black text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)] transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={[
                  "h-4 w-4",
                  refreshing
                    ? "animate-spin"
                    : "",
                ].join(
                  " ",
                )}
              />

              Refresh
            </button>
          </div>
        </section>

        <section className="mt-7 rounded-2xl border border-slate-700/70 bg-[#081523] p-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[180px_1fr_1fr_auto] xl:items-end">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Quick Period
              </span>

              <select
                value={
                  months
                }
                disabled={
                  usingCustomDates
                }
                onChange={
                  (
                    event,
                  ) =>
                    setMonths(
                      event
                        .target
                        .value,
                    )
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-[#050e1a] px-3 text-sm font-semibold text-white outline-none transition focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <option value="6">
                  Last 6 months
                </option>

                <option value="12">
                  Last 12 months
                </option>

                <option value="24">
                  Last 24 months
                </option>
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                From Date
              </span>

              <input
                type="date"
                value={
                  fromDate
                }
                onChange={
                  (
                    event,
                  ) =>
                    setFromDate(
                      event
                        .target
                        .value,
                    )
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-[#050e1a] px-3 text-sm font-semibold text-white outline-none transition focus:border-sky-500 [color-scheme:dark]"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                To Date
              </span>

              <input
                type="date"
                value={
                  toDate
                }
                onChange={
                  (
                    event,
                  ) =>
                    setToDate(
                      event
                        .target
                        .value,
                    )
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-[#050e1a] px-3 text-sm font-semibold text-white outline-none transition focus:border-sky-500 [color-scheme:dark]"
              />
            </label>

            <button
              type="button"
              disabled={
                !usingCustomDates
              }
              onClick={
                clearCustomDates
              }
              className="h-11 rounded-xl border border-slate-700 px-4 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Clear Dates
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-800 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Custom dates override the quick
              period selection.
            </p>

            {report ? (
              <p>
                Generated:{" "}
                <span className="font-semibold text-slate-300">
                  {formatDateTime(
                    report.generatedAt,
                  )}
                </span>
              </p>
            ) : null}
          </div>
        </section>

        {feedback ? (
          <div
            className={[
              "mt-5 rounded-2xl border px-5 py-4 text-sm font-semibold",
              feedback.type ===
              "success"
                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/35 bg-rose-500/10 text-rose-300",
            ].join(
              " ",
            )}
          >
            {feedback.message}
          </div>
        ) : null}

        {loading ? (
          <section className="mt-6 flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-700/70 bg-[#081523]">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-400" />

              <p className="mt-4 text-sm font-semibold text-slate-300">
                Generating secure billing
                analytics...
              </p>
            </div>
          </section>
        ) : report ? (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Total Invoiced"
                value={formatMoney(
                  report.summary
                    .invoicedAmount,
                )}
                description={`${report.summary.totalInvoices} invoice(s) in selected period`}
                icon={
                  ReceiptIndianRupee
                }
                tone="cyan"
              />

              <MetricCard
                label="Total Collected"
                value={formatMoney(
                  report.summary
                    .collectedAmount,
                )}
                description={`${report.summary.confirmedPayments} confirmed payment(s)`}
                icon={
                  IndianRupee
                }
                tone="green"
              />

              <MetricCard
                label="Outstanding"
                value={formatMoney(
                  report.summary
                    .outstandingAmount,
                )}
                description={`${report.summary.outstandingInvoices} invoice(s) awaiting balance`}
                icon={
                  AlertTriangle
                }
                tone="amber"
              />

              <MetricCard
                label="Collection Rate"
                value={`${report.summary.collectionRate.toFixed(
                  2,
                )}%`}
                description={`${formatMoney(
                  report.summary
                    .invoicePaidAmount,
                )} paid against issued invoices`}
                icon={
                  TrendingUp
                }
                tone="violet"
              />
            </section>

            <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-slate-700/70 bg-[#081523] p-4">
                <div className="flex items-center gap-3">
                  <ReceiptIndianRupee className="h-5 w-5 text-sky-400" />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Paid Invoices
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {
                        report
                          .summary
                          .paidInvoices
                      }
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-700/70 bg-[#081523] p-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-rose-400" />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Overdue Invoices
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {
                        report
                          .summary
                          .overdueInvoices
                      }
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-700/70 bg-[#081523] p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Active Subscriptions
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {
                        report
                          .subscriptions
                          .active
                      }
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-700/70 bg-[#081523] p-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-violet-400" />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Auto Renew
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {
                        report
                          .subscriptions
                          .autoRenew
                      }
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-700/70 bg-[#081523]">
              <div className="flex flex-col gap-4 border-b border-slate-700/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Revenue & Collection Trend
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {
                      formatDate(
                        report
                          .period
                          .from,
                      )
                    }{" "}
                    to{" "}
                    {
                      formatDate(
                        report
                          .period
                          .to,
                      )
                    }
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <span className="inline-flex items-center gap-2 text-sky-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                    Invoiced
                  </span>

                  <span className="inline-flex items-center gap-2 text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    Collected
                  </span>

                  <span className="inline-flex items-center gap-2 text-amber-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    Outstanding
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto px-5 py-6">
                <div className="flex min-w-[760px] items-end gap-5">
                  {report.monthlyTrend.map(
                    (
                      item,
                    ) => {
                      const invoiced =
                        Number(
                          item.invoicedAmount,
                        );

                      const collected =
                        Number(
                          item.collectedAmount,
                        );

                      const outstanding =
                        Number(
                          item.outstandingAmount,
                        );

                      return (
                        <div
                          key={
                            item.month
                          }
                          className="flex min-w-[58px] flex-1 flex-col items-center"
                        >
                          <div className="flex h-40 items-end gap-1.5">
                            <div
                              title={`Invoiced: ${formatMoney(
                                invoiced,
                              )}`}
                              className="w-3 rounded-t-md bg-sky-400 transition hover:bg-sky-300"
                              style={{
                                height:
                                  `${Math.max(
                                    3,
                                    (
                                      invoiced /
                                      maximumTrendValue
                                    ) *
                                      150,
                                  )}px`,
                              }}
                            />

                            <div
                              title={`Collected: ${formatMoney(
                                collected,
                              )}`}
                              className="w-3 rounded-t-md bg-emerald-400 transition hover:bg-emerald-300"
                              style={{
                                height:
                                  `${Math.max(
                                    3,
                                    (
                                      collected /
                                      maximumTrendValue
                                    ) *
                                      150,
                                  )}px`,
                              }}
                            />

                            <div
                              title={`Outstanding: ${formatMoney(
                                outstanding,
                              )}`}
                              className="w-3 rounded-t-md bg-amber-400 transition hover:bg-amber-300"
                              style={{
                                height:
                                  `${Math.max(
                                    3,
                                    (
                                      outstanding /
                                      maximumTrendValue
                                    ) *
                                      150,
                                  )}px`,
                              }}
                            />
                          </div>

                          <p className="mt-3 text-center text-[10px] font-bold text-slate-400">
                            {
                              item.label
                            }
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-3">
              <article className="rounded-2xl border border-slate-700/70 bg-[#081523]">
                <div className="border-b border-slate-700/70 px-5 py-4">
                  <h2 className="font-black text-white">
                    Invoice Status
                  </h2>
                </div>

                <div className="space-y-3 p-5">
                  {report.invoiceStatusBreakdown.map(
                    (
                      item,
                    ) => (
                      <div
                        key={
                          item.status
                        }
                        className="rounded-xl border border-slate-800 bg-[#050e1a] p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={[
                              "rounded-full border px-2.5 py-1 text-[10px] font-bold",
                              getStatusStyle(
                                item.status,
                              ),
                            ].join(
                              " ",
                            )}
                          >
                            {humanize(
                              item.status,
                            )}
                          </span>

                          <span className="text-sm font-black text-white">
                            {
                              item.count
                            }
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Total
                          </span>

                          <span className="font-bold text-slate-200">
                            {formatMoney(
                              item.totalAmount,
                            )}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-700/70 bg-[#081523]">
                <div className="border-b border-slate-700/70 px-5 py-4">
                  <h2 className="font-black text-white">
                    Payment Channels
                  </h2>
                </div>

                <div className="space-y-3 p-5">
                  {report.paymentModeBreakdown.map(
                    (
                      item,
                    ) => (
                      <div
                        key={
                          item.mode
                        }
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#050e1a] p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                            <CreditCard className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-xs font-bold text-white">
                              {humanize(
                                item.mode,
                              )}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {
                                item.count
                              }{" "}
                              payment(s)
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-black text-emerald-300">
                          {formatMoney(
                            item.amount,
                          )}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-700/70 bg-[#081523]">
                <div className="border-b border-slate-700/70 px-5 py-4">
                  <h2 className="font-black text-white">
                    Subscription Health
                  </h2>
                </div>

                <div className="space-y-3 p-5">
                  {report.subscriptionStatusBreakdown.map(
                    (
                      item,
                    ) => (
                      <div
                        key={
                          item.status
                        }
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#050e1a] px-4 py-3"
                      >
                        <span
                          className={[
                            "rounded-full border px-2.5 py-1 text-[10px] font-bold",
                            getStatusStyle(
                              item.status,
                            ),
                          ].join(
                            " ",
                          )}
                        >
                          {humanize(
                            item.status,
                          )}
                        </span>

                        <span className="text-lg font-black text-white">
                          {
                            item.count
                          }
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </article>
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-700/70 bg-[#081523]">
              <div className="flex items-center justify-between border-b border-slate-700/70 px-5 py-5">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Recent Payments
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest role-accessible payment
                    records
                  </p>
                </div>

                <Activity className="h-5 w-5 text-emerald-400" />
              </div>

              {report.recentPayments.length >
              0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-[1050px] w-full">
                    <thead className="bg-[#0a1929]">
                      <tr className="border-b border-slate-700/70">
                        {[
                          "Payment",
                          "Invoice / Vehicle",
                          "Account",
                          "Amount",
                          "Received",
                          "Status",
                          "Recorded By",
                        ].map(
                          (
                            heading,
                          ) => (
                            <th
                              key={
                                heading
                              }
                              className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.18em] text-slate-500"
                            >
                              {
                                heading
                              }
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {report.recentPayments.map(
                        (
                          payment,
                        ) => (
                          <tr
                            key={
                              payment.id
                            }
                            className="border-b border-slate-800/80 last:border-0"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-black text-white">
                                {humanize(
                                  payment.mode,
                                )}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-sky-400">
                                {payment.referenceNo ??
                                  "No reference"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-bold text-white">
                                {
                                  payment
                                    .invoice
                                    .invoiceNo
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  payment
                                    .invoice
                                    .vehicle
                                    .vehicleNo
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-bold text-white">
                                {payment
                                  .invoice
                                  .customer
                                  ?.name ??
                                  payment
                                    .invoice
                                    .dealer
                                    ?.name ??
                                  "Company account"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-black text-emerald-300">
                                {formatMoney(
                                  payment.amount,
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Due{" "}
                                {formatMoney(
                                  payment
                                    .invoice
                                    .dueAmount,
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-300">
                              {formatDateTime(
                                payment.receivedAt,
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={[
                                  "rounded-full border px-2.5 py-1 text-[10px] font-bold",
                                  getStatusStyle(
                                    payment.status,
                                  ),
                                ].join(
                                  " ",
                                )}
                              >
                                {humanize(
                                  payment.status,
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-bold text-white">
                                {payment
                                  .recordedBy
                                  ?.name ??
                                  "System"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {payment
                                  .recordedBy
                                  ?.role
                                  ? humanize(
                                      payment
                                        .recordedBy
                                        .role,
                                    )
                                  : "Automated"}
                              </p>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex min-h-[230px] flex-col items-center justify-center px-5 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/40 text-slate-500">
                    <CreditCard className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 font-black text-white">
                    No payments found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    No payment was recorded during
                    the selected reporting period.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-700/70 bg-[#081523]">
              <div className="flex items-center justify-between border-b border-slate-700/70 px-5 py-5">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Overdue Invoices
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Current unpaid invoices beyond
                    their due date
                  </p>
                </div>

                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>

              {report.overdueInvoices.length >
              0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-[950px] w-full">
                    <thead className="bg-[#0a1929]">
                      <tr className="border-b border-slate-700/70">
                        {[
                          "Invoice",
                          "Vehicle / Plan",
                          "Account",
                          "Due Date",
                          "Days Overdue",
                          "Balance",
                        ].map(
                          (
                            heading,
                          ) => (
                            <th
                              key={
                                heading
                              }
                              className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.18em] text-slate-500"
                            >
                              {
                                heading
                              }
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {report.overdueInvoices.map(
                        (
                          invoice,
                        ) => (
                          <tr
                            key={
                              invoice.id
                            }
                            className="border-b border-slate-800/80 last:border-0"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-black text-white">
                                {
                                  invoice.invoiceNo
                                }
                              </p>

                              <span
                                className={[
                                  "mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold",
                                  getStatusStyle(
                                    invoice.status,
                                  ),
                                ].join(
                                  " ",
                                )}
                              >
                                {humanize(
                                  invoice.status,
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-bold text-white">
                                {
                                  invoice
                                    .vehicle
                                    .vehicleNo
                                }
                              </p>

                              <p className="mt-1 text-xs text-sky-400">
                                {
                                  invoice
                                    .plan
                                    .name
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-slate-200">
                              {invoice
                                .customer
                                ?.name ??
                                invoice
                                  .dealer
                                  ?.name ??
                                "Company account"}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-300">
                              {formatDate(
                                invoice.dueDate,
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-black text-rose-300">
                                {
                                  invoice.daysOverdue
                                }{" "}
                                day(s)
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm font-black text-amber-300">
                              {formatMoney(
                                invoice.dueAmount,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 font-black text-white">
                    No overdue invoices
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    There are currently no overdue
                    invoices in your accessible
                    account scope.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-sky-400" />

                Report period:{" "}
                <span className="font-bold text-slate-200">
                  {formatDate(
                    report.period
                      .from,
                  )}{" "}
                  –{" "}
                  {formatDate(
                    report.period
                      .to,
                  )}
                </span>
              </p>

              <p>
                Data access is automatically
                restricted according to your
                account role and assignments.
              </p>
            </section>
          </>
        ) : (
          <section className="mt-6 flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-700/70 bg-[#081523] px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/40 text-slate-500">
              <ChartNoAxesCombined className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-lg font-black text-white">
              Billing report unavailable
            </h2>

            <p className="mt-2 max-w-lg text-sm text-slate-500">
              Refresh the page to request the
              secure billing report again.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}