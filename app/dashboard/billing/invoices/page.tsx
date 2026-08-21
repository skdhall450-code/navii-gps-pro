"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
  ReactNode,
} from "react";

import {
  AlertTriangle,
  Ban,
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  IndianRupee,
  Loader2,
  Pencil,
  Plus,
  ReceiptIndianRupee,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "DEALER"
  | "CUSTOMER"
  | "USER";

type InvoiceStatus =
  | "DRAFT"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

type PaymentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED";

type PaymentMode =
  | "CASH"
  | "BANK_TRANSFER"
  | "UPI"
  | "CHEQUE"
  | "OTHER";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  dealerId?: string | null;
  customerId?: string | null;
};

type BasicAccount = {
  id: string;
  name: string;
  code?: string;
  email?: string | null;
  phone?: string | null;
};

type Device = {
  id: string;
  imei: string;
  model?: string | null;
  simNumber?: string | null;
};

type Vehicle = {
  id: string;
  vehicleNo: string;
  name?: string | null;
  device?: Device | null;
};

type BillingPlan = {
  id: string;
  name: string;
  code: string;
  billingCycle: "MONTHLY" | "YEARLY";
  durationMonths: number;
};

type Subscription = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  priceAtPurchase: string;
  taxRateAtPurchase: string;
  currency: string;
  plan: BillingPlan;
  vehicle: Vehicle;
  device?: Device | null;
  dealer?: BasicAccount | null;
  customer?: BasicAccount | null;
  _count?: {
    invoices?: number;
  };
};

type RecordedBy = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type InvoicePayment = {
  id: string;
  amount: string;
  mode: PaymentMode;
  status: PaymentStatus;
  referenceNo?: string | null;
  receivedAt: string;
  notes?: string | null;
  recordedBy?: RecordedBy | null;
};

type Invoice = {
  id: string;
  invoiceNo: string;
  subtotal: string;
  discountAmount: string;
  taxRate: string;
  taxAmount: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  subscriptionId: string;
  dealerId?: string | null;
  customerId?: string | null;
  subscription: Subscription;
  dealer?: BasicAccount | null;
  customer?: BasicAccount | null;
  payments?: InvoicePayment[];
  _count?: {
    payments?: number;
  };
};

type PaymentInvoice = {
  id: string;
  invoiceNo: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  currency: string;
  status: InvoiceStatus;
  subscription: Subscription;
  dealer?: BasicAccount | null;
  customer?: BasicAccount | null;
};

type Payment = {
  id: string;
  amount: string;
  mode: PaymentMode;
  status: PaymentStatus;
  referenceNo?: string | null;
  receivedAt: string;
  notes?: string | null;
  invoiceId: string;
  invoice: PaymentInvoice;
  recordedBy?: RecordedBy | null;
};

type ApiResponse<T> = {
  success?: boolean;
  count?: number;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

type CreateInvoiceForm = {
  subscriptionId: string;
  discountAmount: string;
  dueDate: string;
  notes: string;
};

type EditInvoiceForm = {
  discountAmount: string;
  dueDate: string;
  notes: string;
};

type PaymentForm = {
  amount: string;
  mode: PaymentMode;
  status: "PENDING" | "CONFIRMED";
  referenceNo: string;
  receivedAt: string;
  notes: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

const invoiceStatusMeta: Record<
  InvoiceStatus,
  {
    label: string;
    icon: LucideIcon;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    icon: Pencil,
    className:
      "border-slate-500/25 bg-slate-500/10 text-slate-300",
  },

  UNPAID: {
    label: "Unpaid",
    icon: Clock3,
    className:
      "border-amber-500/25 bg-amber-500/10 text-amber-300",
  },

  PARTIALLY_PAID: {
    label: "Partially Paid",
    icon: Banknote,
    className:
      "border-sky-500/25 bg-sky-500/10 text-sky-300",
  },

  PAID: {
    label: "Paid",
    icon: CheckCircle2,
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  },

  OVERDUE: {
    label: "Overdue",
    icon: AlertTriangle,
    className:
      "border-red-500/25 bg-red-500/10 text-red-300",
  },

  CANCELLED: {
    label: "Cancelled",
    icon: Ban,
    className:
      "border-slate-500/25 bg-slate-500/10 text-slate-400",
  },
};

const paymentStatusMeta: Record<
  PaymentStatus,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    className:
      "border-amber-500/25 bg-amber-500/10 text-amber-300",
  },

  CONFIRMED: {
    label: "Confirmed",
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  },

  REJECTED: {
    label: "Rejected",
    className:
      "border-red-500/25 bg-red-500/10 text-red-300",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-slate-500/25 bg-slate-500/10 text-slate-400",
  },
};

function getErrorMessage(
  value: unknown,
) {
  if (
    typeof value === "object" &&
    value !== null
  ) {
    const data =
      value as {
        message?: string | string[];
        error?: string;
      };

    if (
      Array.isArray(data.message)
    ) {
      return data.message.join(", ");
    }

    if (
      typeof data.message ===
      "string"
    ) {
      return data.message;
    }

    if (
      typeof data.error ===
      "string"
    ) {
      return data.error;
    }
  }

  return "Something went wrong. Please try again.";
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    localStorage.getItem(
      "navii_access_token",
    );

  if (!token) {
    throw new Error(
      "Login session not found. Please login again.",
    );
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        cache: "no-store",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",

          ...(
            options.headers as
              | Record<string, string>
              | undefined
          ),
        },
      },
    );

  const payload =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload),
    );
  }

  return payload as T;
}

function formatCurrency(
  value:
    | string
    | number
    | null
    | undefined,
  currency = "INR",
) {
  const amount =
    Number(value ?? 0);

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(
    Number.isFinite(amount)
      ? amount
      : 0,
  );
}

function formatDate(
  value?: string | null,
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
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatDateTime(
  value?: string | null,
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
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function getDateAfterDays(
  days: number,
) {
  const date =
    new Date();

  date.setDate(
    date.getDate() +
      days,
  );

  const localDate =
    new Date(
      date.getTime() -
        date.getTimezoneOffset() *
          60 *
          1000,
    );

  return localDate
    .toISOString()
    .slice(0, 10);
}

function getDateInputValue(
  value?: string | null,
) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function getDateTimeInputValue() {
  const now =
    new Date();

  const localDate =
    new Date(
      now.getTime() -
        now.getTimezoneOffset() *
          60 *
          1000,
    );

  return localDate
    .toISOString()
    .slice(0, 16);
}

function InvoiceStatusBadge({
  status,
}: {
  status: InvoiceStatus;
}) {
  const meta =
    invoiceStatusMeta[
      status
    ];

  const Icon =
    meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {meta.label}
    </span>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const meta =
    paymentStatusMeta[
      status
    ];

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#091625] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${iconClassName}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function Modal({
  eyebrow,
  title,
  onClose,
  children,
  maxWidth = "max-w-2xl",
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <div
        className={`my-auto w-full ${maxWidth} overflow-hidden rounded-3xl border border-white/10 bg-[#091625] shadow-2xl shadow-black/50`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function IconButton({
  title,
  onClick,
  disabled,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "border-red-500/25 text-red-400 hover:bg-red-500/10"
          : "border-white/10 text-slate-400 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function InvoicesPage() {
  const [
    invoices,
    setInvoices,
  ] =
    useState<Invoice[]>([]);

  const [
    payments,
    setPayments,
  ] =
    useState<Payment[]>([]);

  const [
    subscriptions,
    setSubscriptions,
  ] =
    useState<Subscription[]>([]);

  const [
    currentRole,
    setCurrentRole,
  ] =
    useState<UserRole | null>(
      null,
    );

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<
      "INVOICES" | "PAYMENTS"
    >("INVOICES");

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    optionsLoading,
    setOptionsLoading,
  ] =
    useState(false);

  const [
    busyAction,
    setBusyAction,
  ] =
    useState<string | null>(
      null,
    );

  const [
    feedback,
    setFeedback,
  ] =
    useState<Feedback | null>(
      null,
    );

  const [
    modalError,
    setModalError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    createInvoiceOpen,
    setCreateInvoiceOpen,
  ] =
    useState(false);

  const [
    editInvoice,
    setEditInvoice,
  ] =
    useState<Invoice | null>(
      null,
    );

  const [
    paymentInvoice,
    setPaymentInvoice,
  ] =
    useState<Invoice | null>(
      null,
    );

  const [
    createInvoiceForm,
    setCreateInvoiceForm,
  ] =
    useState<CreateInvoiceForm>({
      subscriptionId: "",
      discountAmount: "0",
      dueDate:
        getDateAfterDays(7),
      notes: "",
    });

  const [
    editInvoiceForm,
    setEditInvoiceForm,
  ] =
    useState<EditInvoiceForm>({
      discountAmount: "0",
      dueDate: "",
      notes: "",
    });

  const [
    paymentForm,
    setPaymentForm,
  ] =
    useState<PaymentForm>({
      amount: "",
      mode: "CASH",
      status: "CONFIRMED",
      referenceNo: "",
      receivedAt:
        getDateTimeInputValue(),
      notes: "",
    });

  const canManage =
    currentRole ===
      "SUPER_ADMIN" ||
    currentRole ===
      "ADMIN";

  const loadBillingData =
    useCallback(
      async (
        showLoader = true,
      ) => {
        if (showLoader) {
          setLoading(true);
        }

        try {
          const [
            invoiceResponse,
            paymentResponse,
          ] =
            await Promise.all([
              apiRequest<
                ApiResponse<
                  Invoice[]
                >
              >(
                "/api/gps/billing/invoices",
              ),

              apiRequest<
                ApiResponse<
                  Payment[]
                >
              >(
                "/api/gps/billing/payments",
              ),
            ]);

          setInvoices(
            Array.isArray(
              invoiceResponse.data,
            )
              ? invoiceResponse.data
              : [],
          );

          setPayments(
            Array.isArray(
              paymentResponse.data,
            )
              ? paymentResponse.data
              : [],
          );
        }
        catch (error) {
          setFeedback({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to load billing records.",
          });
        }
        finally {
          if (showLoader) {
            setLoading(false);
          }
        }
      },
      [],
    );

  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        "navii_user",
      );

    if (storedUser) {
      try {
        const user =
          JSON.parse(
            storedUser,
          ) as AuthUser;

        setCurrentRole(
          user.role,
        );
      }
      catch {
        setCurrentRole(null);
      }
    }

    void loadBillingData();
  }, [loadBillingData]);

  const loadSubscriptions =
    async () => {
      setOptionsLoading(true);

      try {
        const response =
          await apiRequest<
            ApiResponse<
              Subscription[]
            >
          >(
            "/api/gps/billing/subscriptions",
          );

        setSubscriptions(
          (
            Array.isArray(
              response.data,
            )
              ? response.data
              : []
          ).filter(
            (subscription) =>
              subscription.status !==
              "CANCELLED",
          ),
        );
      }
      catch (error) {
        setModalError(
          error instanceof Error
            ? error.message
            : "Unable to load subscriptions.",
        );
      }
      finally {
        setOptionsLoading(false);
      }
    };

  const openCreateInvoice =
    () => {
      setFeedback(null);
      setModalError(null);

      setCreateInvoiceForm({
        subscriptionId: "",
        discountAmount: "0",
        dueDate:
          getDateAfterDays(7),
        notes: "",
      });

      setCreateInvoiceOpen(
        true,
      );

      void loadSubscriptions();
    };

  const openEditInvoice =
    (
      invoice: Invoice,
    ) => {
      setModalError(null);

      setEditInvoiceForm({
        discountAmount:
          invoice.discountAmount,
        dueDate:
          getDateInputValue(
            invoice.dueDate,
          ),
        notes:
          invoice.notes ?? "",
      });

      setEditInvoice(invoice);
    };

  const openPayment =
    (
      invoice: Invoice,
    ) => {
      setModalError(null);

      setPaymentForm({
        amount:
          invoice.dueAmount,
        mode: "CASH",
        status: "CONFIRMED",
        referenceNo: "",
        receivedAt:
          getDateTimeInputValue(),
        notes: "",
      });

      setPaymentInvoice(
        invoice,
      );
    };

  const selectedSubscription =
    useMemo(
      () =>
        subscriptions.find(
          (subscription) =>
            subscription.id ===
            createInvoiceForm.subscriptionId,
        ),
      [
        subscriptions,
        createInvoiceForm.subscriptionId,
      ],
    );

  const invoicePreview =
    useMemo(() => {
      if (
        !selectedSubscription
      ) {
        return null;
      }

      const subtotal =
        Number(
          selectedSubscription.priceAtPurchase,
        );

      const discount =
        Math.max(
          0,
          Number(
            createInvoiceForm.discountAmount ||
              0,
          ),
        );

      const taxable =
        Math.max(
          0,
          subtotal -
            discount,
        );

      const taxRate =
        Number(
          selectedSubscription.taxRateAtPurchase,
        );

      const taxAmount =
        taxable *
        taxRate /
        100;

      return {
        subtotal,
        discount,
        taxRate,
        taxAmount,
        total:
          taxable +
          taxAmount,
      };
    }, [
      selectedSubscription,
      createInvoiceForm.discountAmount,
    ]);

  const statistics =
    useMemo(() => {
      const activeInvoices =
        invoices.filter(
          (invoice) =>
            invoice.status !==
              "CANCELLED" &&
            invoice.status !==
              "DRAFT",
        );

      return {
        total:
          invoices.length,

        outstanding:
          activeInvoices.filter(
            (invoice) =>
              Number(
                invoice.dueAmount,
              ) > 0,
          ).length,

        paid:
          invoices.filter(
            (invoice) =>
              invoice.status ===
              "PAID",
          ).length,

        collected:
          activeInvoices.reduce(
            (
              total,
              invoice,
            ) =>
              total +
              Number(
                invoice.paidAmount,
              ),
            0,
          ),
      };
    }, [invoices]);

  const filteredInvoices =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) {
        return invoices;
      }

      return invoices.filter(
        (invoice) => {
          const imei =
            invoice.subscription
              .device?.imei ||
            invoice.subscription
              .vehicle.device
              ?.imei ||
            "";

          const searchable =
            [
              invoice.invoiceNo,
              invoice.status,
              invoice.subscription
                .vehicle.vehicleNo,
              invoice.subscription
                .plan.name,
              invoice.customer
                ?.name,
              invoice.dealer
                ?.name,
              imei,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return searchable.includes(
            query,
          );
        },
      );
    }, [
      invoices,
      searchTerm,
    ]);

  const filteredPayments =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) {
        return payments;
      }

      return payments.filter(
        (payment) => {
          const searchable =
            [
              payment.invoice
                .invoiceNo,
              payment.status,
              payment.mode,
              payment.referenceNo,
              payment.invoice
                .subscription
                .vehicle
                .vehicleNo,
              payment.invoice
                .customer
                ?.name,
              payment.invoice
                .dealer
                ?.name,
              payment.recordedBy
                ?.name,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return searchable.includes(
            query,
          );
        },
      );
    }, [
      payments,
      searchTerm,
    ]);

  const handleCreateInvoice =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        !createInvoiceForm.subscriptionId
      ) {
        setModalError(
          "Subscription is required.",
        );

        return;
      }

      setBusyAction(
        "create-invoice",
      );

      setModalError(null);

      try {
        const response =
          await apiRequest<
            ApiResponse<Invoice>
          >(
            "/api/gps/billing/invoices",
            {
              method: "POST",

              body: JSON.stringify({
                subscriptionId:
                  createInvoiceForm.subscriptionId,

                discountAmount:
                  Number(
                    createInvoiceForm.discountAmount ||
                      0,
                  ),

                dueDate:
                  createInvoiceForm.dueDate
                    ? new Date(`${createInvoiceForm.dueDate}T23:59:59.999`).toISOString()
                    : null,

                notes:
                  createInvoiceForm.notes
                    .trim() ||
                  null,
              }),
            },
          );

        setCreateInvoiceOpen(
          false,
        );

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Invoice created successfully.",
        });

        await loadBillingData(
          false,
        );
      }
      catch (error) {
        setModalError(
          error instanceof Error
            ? error.message
            : "Unable to create invoice.",
        );
      }
      finally {
        setBusyAction(null);
      }
    };

  const handleUpdateInvoice =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (!editInvoice) {
        return;
      }

      setBusyAction(
        `edit-invoice-${editInvoice.id}`,
      );

      setModalError(null);

      try {
        const response =
          await apiRequest<
            ApiResponse<Invoice>
          >(
            `/api/gps/billing/invoices/${editInvoice.id}`,
            {
              method: "PATCH",

              body: JSON.stringify({
                discountAmount:
                  Number(
                    editInvoiceForm.discountAmount ||
                      0,
                  ),

                dueDate:
                  editInvoiceForm.dueDate
                    ? new Date(`${editInvoiceForm.dueDate}T23:59:59.999`).toISOString()
                    : null,

                notes:
                  editInvoiceForm.notes
                    .trim() ||
                  null,
              }),
            },
          );

        setEditInvoice(null);

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Invoice updated successfully.",
        });

        await loadBillingData(
          false,
        );
      }
      catch (error) {
        setModalError(
          error instanceof Error
            ? error.message
            : "Unable to update invoice.",
        );
      }
      finally {
        setBusyAction(null);
      }
    };

  const handleRecordPayment =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (!paymentInvoice) {
        return;
      }

      if (
        !paymentForm.amount ||
        Number(
          paymentForm.amount,
        ) <= 0
      ) {
        setModalError(
          "Payment amount must be greater than zero.",
        );

        return;
      }

      setBusyAction(
        `record-payment-${paymentInvoice.id}`,
      );

      setModalError(null);

      try {
        const response =
          await apiRequest<
            ApiResponse<Payment>
          >(
            "/api/gps/billing/payments",
            {
              method: "POST",

              body: JSON.stringify({
                invoiceId:
                  paymentInvoice.id,

                amount:
                  Number(
                    paymentForm.amount,
                  ),

                mode:
                  paymentForm.mode,

                status:
                  paymentForm.status,

                referenceNo:
                  paymentForm.referenceNo
                    .trim() ||
                  null,

                receivedAt:
                  paymentForm.receivedAt
                    ? new Date(
                        paymentForm.receivedAt,
                      ).toISOString()
                    : undefined,

                notes:
                  paymentForm.notes
                    .trim() ||
                  null,
              }),
            },
          );

        setPaymentInvoice(null);

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Payment recorded successfully.",
        });

        await loadBillingData(
          false,
        );
      }
      catch (error) {
        setModalError(
          error instanceof Error
            ? error.message
            : "Unable to record payment.",
        );
      }
      finally {
        setBusyAction(null);
      }
    };

  const downloadInvoicePdf =
    async (
      invoice: Invoice,
    ) => {
      setBusyAction(
        `download-invoice-${invoice.id}`,
      );

      setFeedback(null);

      try {
        const token =
          localStorage.getItem(
            "navii_access_token",
          );

        if (!token) {
          throw new Error(
            "Login session not found. Please login again.",
          );
        }

        const response =
          await fetch(
            `${API_URL}/api/gps/billing/invoices/${invoice.id}/pdf`,
            {
              method: "GET",
              cache: "no-store",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

        if (!response.ok) {
          const payload =
            await response
              .json()
              .catch(() => ({}));

          throw new Error(
            getErrorMessage(
              payload,
            ),
          );
        }

        const pdfBlob =
          await response.blob();

        const disposition =
          response.headers.get(
            "content-disposition",
          ) ?? "";

        const filenameMatch =
          disposition.match(
            /filename="?([^";]+)"?/i,
          );

        const filename =
          filenameMatch?.[1]
            ?.trim() ||
          `NAVII-${invoice.invoiceNo}.pdf`;

        const downloadUrl =
          URL.createObjectURL(
            pdfBlob,
          );

        const downloadLink =
          document.createElement(
            "a",
          );

        downloadLink.href =
          downloadUrl;

        downloadLink.download =
          filename;

        document.body.appendChild(
          downloadLink,
        );

        downloadLink.click();
        downloadLink.remove();

        window.setTimeout(
          () =>
            URL.revokeObjectURL(
              downloadUrl,
            ),
          1000,
        );

        setFeedback({
          type: "success",

          message:
            "Invoice PDF downloaded successfully.",
        });
      }
      catch (error) {
        setFeedback({
          type: "error",

          message:
            error instanceof Error
              ? error.message
              : "Unable to download invoice PDF.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const cancelInvoice =
    async (
      invoice: Invoice,
    ) => {
      const confirmed =
        window.confirm(
          `Cancel invoice ${invoice.invoiceNo}?`,
        );

      if (!confirmed) {
        return;
      }

      setBusyAction(
        `cancel-invoice-${invoice.id}`,
      );

      try {
        const response =
          await apiRequest<
            ApiResponse<Invoice>
          >(
            `/api/gps/billing/invoices/${invoice.id}`,
            {
              method: "PATCH",

              body: JSON.stringify({
                status:
                  "CANCELLED",
              }),
            },
          );

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Invoice cancelled successfully.",
        });

        await loadBillingData(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to cancel invoice.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const deleteInvoice =
    async (
      invoice: Invoice,
    ) => {
      const confirmed =
        window.confirm(
          `Permanently delete invoice ${invoice.invoiceNo}?`,
        );

      if (!confirmed) {
        return;
      }

      setBusyAction(
        `delete-invoice-${invoice.id}`,
      );

      try {
        const response =
          await apiRequest<
            ApiResponse<unknown>
          >(
            `/api/gps/billing/invoices/${invoice.id}`,
            {
              method: "DELETE",
            },
          );

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Invoice deleted successfully.",
        });

        await loadBillingData(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to delete invoice.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const updatePaymentStatus =
    async (
      payment: Payment,
      status: PaymentStatus,
      successMessage: string,
    ) => {
      const confirmed =
        window.confirm(
          `${successMessage.replace(".", "")}?`,
        );

      if (!confirmed) {
        return;
      }

      setBusyAction(
        `payment-status-${payment.id}`,
      );

      try {
        await apiRequest<
          ApiResponse<Payment>
        >(
          `/api/gps/billing/payments/${payment.id}`,
          {
            method: "PATCH",

            body: JSON.stringify({
              status,
            }),
          },
        );

        setFeedback({
          type: "success",
          message:
            successMessage,
        });

        await loadBillingData(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to update payment.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const deletePayment =
    async (
      payment: Payment,
    ) => {
      const confirmed =
        window.confirm(
          "Permanently delete this non-confirmed payment record?",
        );

      if (!confirmed) {
        return;
      }

      setBusyAction(
        `delete-payment-${payment.id}`,
      );

      try {
        const response =
          await apiRequest<
            ApiResponse<unknown>
          >(
            `/api/gps/billing/payments/${payment.id}`,
            {
              method: "DELETE",
            },
          );

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Payment deleted successfully.",
        });

        await loadBillingData(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to delete payment.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const referenceRequired =
    paymentForm.mode ===
      "BANK_TRANSFER" ||
    paymentForm.mode ===
      "UPI" ||
    paymentForm.mode ===
      "CHEQUE";

  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "DEALER",
        "CUSTOMER",
      ]}
    >
      <main className="min-h-screen bg-[#050b14] px-5 py-8 text-white md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-500/25 bg-sky-500/10 text-sky-400">
                  <ReceiptIndianRupee className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
                    Billing Management
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                    Invoices & Payments
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                Generate subscription invoices, record manual
                payments and monitor outstanding balances.
              </p>

              {!canManage &&
                currentRole && (
                  <p className="mt-2 text-xs text-sky-400">
                    Your account has secure read-only billing access.
                  </p>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  void loadBillingData()
                }
                disabled={loading}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold transition hover:bg-white/[0.06] disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>

              {canManage && (
                <button
                  type="button"
                  onClick={
                    openCreateInvoice
                  }
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  <Plus className="h-4 w-4" />

                  Create Invoice
                </button>
              )}
            </div>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Invoices"
              value={statistics.total}
              icon={ReceiptIndianRupee}
              iconClassName="border-sky-500/25 bg-sky-500/10 text-sky-400"
            />

            <StatCard
              title="Outstanding"
              value={statistics.outstanding}
              icon={Clock3}
              iconClassName="border-amber-500/25 bg-amber-500/10 text-amber-400"
            />

            <StatCard
              title="Paid Invoices"
              value={statistics.paid}
              icon={CheckCircle2}
              iconClassName="border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
            />

            <StatCard
              title="Total Collected"
              value={formatCurrency(
                statistics.collected,
              )}
              icon={IndianRupee}
              iconClassName="border-violet-500/25 bg-violet-500/10 text-violet-400"
            />
          </section>

          {feedback && (
            <div
              className={`mt-5 rounded-2xl border px-5 py-4 text-sm ${
                feedback.type ===
                "success"
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/25 bg-red-500/10 text-red-300"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#081523]">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex rounded-xl border border-white/10 bg-[#050c17] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(
                      "INVOICES",
                    );

                    setSearchTerm("");
                  }}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                    activeTab ===
                    "INVOICES"
                      ? "bg-sky-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Invoices ({invoices.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(
                      "PAYMENTS",
                    );

                    setSearchTerm("");
                  }}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                    activeTab ===
                    "PAYMENTS"
                      ? "bg-sky-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Payments ({payments.length})
                </button>
              </div>

              <div className="relative w-full xl:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                  placeholder={
                    activeTab ===
                    "INVOICES"
                      ? "Search invoice, vehicle, IMEI or customer..."
                      : "Search payment, reference or invoice..."
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500/50"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[380px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-9 w-9 animate-spin text-sky-400" />

                  <p className="mt-4 text-sm text-slate-400">
                    Loading billing records...
                  </p>
                </div>
              </div>
            ) : activeTab ===
              "INVOICES" ? (
              filteredInvoices.length ===
              0 ? (
                <div className="flex min-h-[380px] items-center justify-center px-5">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500">
                      <ReceiptIndianRupee className="h-8 w-8" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      No invoices found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {searchTerm
                        ? "No invoice matches your search."
                        : canManage
                          ? "Create the first subscription invoice."
                          : "No invoice is assigned to your account."}
                    </p>

                    {canManage &&
                      !searchTerm && (
                        <button
                          type="button"
                          onClick={
                            openCreateInvoice
                          }
                          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold hover:bg-sky-400"
                        >
                          <Plus className="h-4 w-4" />

                          Create First Invoice
                        </button>
                      )}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px] text-left">
                    <thead className="border-b border-white/10 bg-white/[0.015]">
                      <tr className="text-[11px] uppercase tracking-[0.17em] text-slate-500">
                        <th className="px-5 py-4">
                          Invoice
                        </th>

                        <th className="px-5 py-4">
                          Vehicle / Account
                        </th>

                        <th className="px-5 py-4">
                          Dates
                        </th>

                        <th className="px-5 py-4">
                          Total
                        </th>

                        <th className="px-5 py-4">
                          Paid / Due
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4">
                          Payments
                        </th>

                        {canManage && (
                          <th className="py-4 pl-5 pr-24 text-right">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {filteredInvoices.map(
                        (invoice) => {
                          const rowBusy =
                            busyAction?.includes(
                              invoice.id,
                            ) ?? false;

                          const canReceivePayment =
                            (
                              invoice.status ===
                                "UNPAID" ||
                              invoice.status ===
                                "PARTIALLY_PAID" ||
                              invoice.status ===
                                "OVERDUE"
                            ) &&
                            Number(
                              invoice.dueAmount,
                            ) > 0;

                          const canCancel =
                            invoice.status !==
                              "PAID" &&
                            invoice.status !==
                              "CANCELLED" &&
                            Number(
                              invoice.paidAmount,
                            ) === 0;

                          const canDelete =
                            invoice.status ===
                              "CANCELLED" ||
                            invoice.status ===
                              "DRAFT";

                          return (
                            <tr
                              key={
                                invoice.id
                              }
                              className="transition hover:bg-white/[0.02]"
                            >
                              <td className="px-5 py-5">
                                <p className="font-bold text-white">
                                  {
                                    invoice.invoiceNo
                                  }
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    invoice.subscription
                                      .plan.name
                                  }
                                </p>

                                <p className="mt-1 text-xs font-semibold text-sky-400">
                                  {
                                    invoice.subscription
                                      .plan.code
                                  }
                                </p>

                                <button
                                  type="button"
                                  title="Download invoice PDF"
                                  disabled={
                                    rowBusy
                                  }
                                  onClick={() =>
                                    void downloadInvoicePdf(
                                      invoice,
                                    )
                                  }
                                  className={[
                                    "mt-3 inline-flex h-8 items-center gap-2",
                                    "rounded-lg border border-sky-500/25",
                                    "bg-sky-500/10 px-3 text-xs font-bold text-sky-300",
                                    "transition hover:border-sky-400/50 hover:bg-sky-500/20",
                                    "disabled:cursor-not-allowed disabled:opacity-40",
                                  ].join(" ")}
                                >
                                  {busyAction ===
                                  `download-invoice-${invoice.id}` ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Download className="h-3.5 w-3.5" />
                                  )}

                                  Download PDF
                                </button>
                              </td>

                              <td className="px-5 py-5">
                                <p className="font-semibold text-white">
                                  {
                                    invoice.subscription
                                      .vehicle
                                      .vehicleNo
                                  }
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {invoice.customer
                                    ?.name ||
                                    invoice.dealer
                                      ?.name ||
                                    "Company Account"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  IMEI:{" "}
                                  {invoice.subscription
                                    .device
                                    ?.imei ||
                                    invoice.subscription
                                      .vehicle.device
                                      ?.imei ||
                                    "Not linked"}
                                </p>
                              </td>

                              <td className="px-5 py-5">
                                <p className="text-sm text-slate-300">
                                  Issue:{" "}
                                  {formatDate(
                                    invoice.issueDate,
                                  )}
                                </p>

                                <p className="mt-2 text-sm text-slate-300">
                                  Due:{" "}
                                  <span className="font-semibold text-white">
                                    {formatDate(
                                      invoice.dueDate,
                                    )}
                                  </span>
                                </p>
                              </td>

                              <td className="px-5 py-5">
                                <p className="font-bold text-white">
                                  {formatCurrency(
                                    invoice.totalAmount,
                                    invoice.currency,
                                  )}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  Tax{" "}
                                  {invoice.taxRate}%
                                  · Discount{" "}
                                  {formatCurrency(
                                    invoice.discountAmount,
                                    invoice.currency,
                                  )}
                                </p>
                              </td>

                              <td className="px-5 py-5">
                                <p className="text-sm font-semibold text-emerald-300">
                                  Paid{" "}
                                  {formatCurrency(
                                    invoice.paidAmount,
                                    invoice.currency,
                                  )}
                                </p>

                                <p className="mt-2 text-sm font-semibold text-amber-300">
                                  Due{" "}
                                  {formatCurrency(
                                    invoice.dueAmount,
                                    invoice.currency,
                                  )}
                                </p>
                              </td>

                              <td className="px-5 py-5">
                                <InvoiceStatusBadge
                                  status={
                                    invoice.status
                                  }
                                />
                              </td>

                              <td className="px-5 py-5">
                                <span className="inline-flex rounded-lg bg-white/5 px-3 py-1.5 text-sm font-bold text-white">
                                  {invoice._count
                                    ?.payments ??
                                    invoice.payments
                                      ?.length ??
                                    0}
                                </span>
                              </td>

                              {canManage && (
                                <td className="py-5 pl-5 pr-24">
                                  <div className="flex justify-end gap-2">
                                    <IconButton
                                      title="Edit invoice"
                                      disabled={
                                        rowBusy
                                      }
                                      onClick={() =>
                                        openEditInvoice(
                                          invoice,
                                        )
                                      }
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </IconButton>

                                    {canReceivePayment && (
                                      <IconButton
                                        title="Record payment"
                                        disabled={
                                          rowBusy
                                        }
                                        onClick={() =>
                                          openPayment(
                                            invoice,
                                          )
                                        }
                                      >
                                        <IndianRupee className="h-4 w-4" />
                                      </IconButton>
                                    )}

                                    {canCancel && (
                                      <IconButton
                                        title="Cancel invoice"
                                        disabled={
                                          rowBusy
                                        }
                                        onClick={() =>
                                          void cancelInvoice(
                                            invoice,
                                          )
                                        }
                                        danger
                                      >
                                        <Ban className="h-4 w-4" />
                                      </IconButton>
                                    )}

                                    {canDelete && (
                                      <IconButton
                                        title="Delete invoice"
                                        disabled={
                                          rowBusy
                                        }
                                        onClick={() =>
                                          void deleteInvoice(
                                            invoice,
                                          )
                                        }
                                        danger
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </IconButton>
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>
              )
            ) : filteredPayments.length ===
              0 ? (
              <div className="flex min-h-[380px] items-center justify-center px-5">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500">
                    <CreditCard className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    No payments found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Confirmed and pending manual payments will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1150px] text-left">
                  <thead className="border-b border-white/10 bg-white/[0.015]">
                    <tr className="text-[11px] uppercase tracking-[0.17em] text-slate-500">
                      <th className="px-5 py-4">
                        Payment
                      </th>

                      <th className="px-5 py-4">
                        Invoice / Vehicle
                      </th>

                      <th className="px-5 py-4">
                        Account
                      </th>

                      <th className="px-5 py-4">
                        Amount
                      </th>

                      <th className="px-5 py-4">
                        Received
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Recorded By
                      </th>

                      {canManage && (
                        <th className="py-4 pl-5 pr-24 text-right">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {filteredPayments.map(
                      (payment) => {
                        const rowBusy =
                          busyAction?.includes(
                            payment.id,
                          ) ?? false;

                        return (
                          <tr
                            key={
                              payment.id
                            }
                            className="transition hover:bg-white/[0.02]"
                          >
                            <td className="px-5 py-5">
                              <p className="font-semibold text-white">
                                {
                                  payment.mode
                                }
                              </p>

                              <p className="mt-1 text-xs text-sky-400">
                                {payment.referenceNo ||
                                  "No reference"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                ID:{" "}
                                {payment.id.slice(
                                  -8,
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="font-bold text-white">
                                {
                                  payment.invoice
                                    .invoiceNo
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {
                                  payment.invoice
                                    .subscription
                                    .vehicle
                                    .vehicleNo
                                }
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="text-sm font-semibold text-white">
                                {payment.invoice
                                  .customer
                                  ?.name ||
                                  payment.invoice
                                    .dealer
                                    ?.name ||
                                  "Company Account"}
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="font-bold text-white">
                                {formatCurrency(
                                  payment.amount,
                                  payment.invoice
                                    .currency,
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Invoice due{" "}
                                {formatCurrency(
                                  payment.invoice
                                    .dueAmount,
                                  payment.invoice
                                    .currency,
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-5 text-sm text-slate-300">
                              {formatDateTime(
                                payment.receivedAt,
                              )}
                            </td>

                            <td className="px-5 py-5">
                              <PaymentStatusBadge
                                status={
                                  payment.status
                                }
                              />
                            </td>

                            <td className="px-5 py-5">
                              <p className="text-sm font-semibold text-white">
                                {payment.recordedBy
                                  ?.name ||
                                  "System"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {payment.recordedBy
                                  ?.role ||
                                  "—"}
                              </p>
                            </td>

                            {canManage && (
                              <td className="py-5 pl-5 pr-24">
                                <div className="flex justify-end gap-2">
                                  {payment.status ===
                                    "PENDING" && (
                                    <>
                                      <IconButton
                                        title="Confirm payment"
                                        disabled={
                                          rowBusy
                                        }
                                        onClick={() =>
                                          void updatePaymentStatus(
                                            payment,
                                            "CONFIRMED",
                                            "Payment confirmed successfully.",
                                          )
                                        }
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                      </IconButton>

                                      <IconButton
                                        title="Reject payment"
                                        disabled={
                                          rowBusy
                                        }
                                        onClick={() =>
                                          void updatePaymentStatus(
                                            payment,
                                            "REJECTED",
                                            "Payment rejected successfully.",
                                          )
                                        }
                                        danger
                                      >
                                        <Ban className="h-4 w-4" />
                                      </IconButton>
                                    </>
                                  )}

                                  {payment.status ===
                                    "CONFIRMED" && (
                                    <IconButton
                                      title="Cancel confirmed payment"
                                      disabled={
                                        rowBusy
                                      }
                                      onClick={() =>
                                        void updatePaymentStatus(
                                          payment,
                                          "CANCELLED",
                                          "Payment cancelled successfully.",
                                        )
                                      }
                                      danger
                                    >
                                      <Ban className="h-4 w-4" />
                                    </IconButton>
                                  )}

                                  {payment.status !==
                                    "CONFIRMED" && (
                                    <IconButton
                                      title="Delete payment"
                                      disabled={
                                        rowBusy
                                      }
                                      onClick={() =>
                                        void deletePayment(
                                          payment,
                                        )
                                      }
                                      danger
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </IconButton>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {createInvoiceOpen && (
          <Modal
            eyebrow="Manual Invoice"
            title="Create Subscription Invoice"
            onClose={() =>
              setCreateInvoiceOpen(
                false,
              )
            }
          >
            <form
              onSubmit={
                handleCreateInvoice
              }
              className="p-6"
            >
              {modalError && (
                <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
                  {modalError}
                </div>
              )}

              {optionsLoading ? (
                <div className="flex min-h-[260px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                </div>
              ) : (
                <>
                  {subscriptions.length ===
                    0 && (
                    <div className="mb-5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-300">
                      No subscription is available.{" "}

                      <Link
                        href="/dashboard/billing/subscriptions"
                        className="font-bold underline"
                      >
                        Create a subscription first
                      </Link>
                      .
                    </div>
                  )}

                  <FormField
                    label="Subscription"
                    required
                  >
                    <select
                      value={
                        createInvoiceForm.subscriptionId
                      }
                      onChange={(event) =>
                        setCreateInvoiceForm(
                          (current) => ({
                            ...current,

                            subscriptionId:
                              event.target
                                .value,
                          }),
                        )
                      }
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                    >
                      <option value="">
                        Select vehicle subscription
                      </option>

                      {subscriptions.map(
                        (subscription) => (
                          <option
                            key={
                              subscription.id
                            }
                            value={
                              subscription.id
                            }
                          >
                            {
                              subscription
                                .vehicle
                                .vehicleNo
                            }{" "}
                            -{" "}
                            {
                              subscription
                                .plan.name
                            }{" "}
                            -{" "}
                            {formatCurrency(
                              subscription.priceAtPurchase,
                              subscription.currency,
                            )}
                          </option>
                        ),
                      )}
                    </select>
                  </FormField>

                  {selectedSubscription &&
                    invoicePreview && (
                    <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-[#050c17] p-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">
                          Subtotal
                        </p>

                        <p className="mt-1 font-bold">
                          {formatCurrency(
                            invoicePreview.subtotal,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Discount
                        </p>

                        <p className="mt-1 font-bold">
                          {formatCurrency(
                            invoicePreview.discount,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Tax (
                          {
                            invoicePreview.taxRate
                          }
                          %)
                        </p>

                        <p className="mt-1 font-bold">
                          {formatCurrency(
                            invoicePreview.taxAmount,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Total
                        </p>

                        <p className="mt-1 font-bold text-emerald-300">
                          {formatCurrency(
                            invoicePreview.total,
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <FormField label="Discount Amount">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          createInvoiceForm.discountAmount
                        }
                        onChange={(event) =>
                          setCreateInvoiceForm(
                            (current) => ({
                              ...current,

                              discountAmount:
                                event.target
                                  .value,
                            }),
                          )
                        }
                        className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                      />
                    </FormField>

                    <FormField label="Due Date">
                      <input
                        type="date"
                        value={
                          createInvoiceForm.dueDate
                        }
                        onChange={(event) =>
                          setCreateInvoiceForm(
                            (current) => ({
                              ...current,

                              dueDate:
                                event.target
                                  .value,
                            }),
                          )
                        }
                        className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none [color-scheme:dark] focus:border-sky-500/50"
                      />
                    </FormField>
                  </div>

                  <div className="mt-5">
                    <FormField label="Notes">
                      <textarea
                        rows={4}
                        value={
                          createInvoiceForm.notes
                        }
                        onChange={(event) =>
                          setCreateInvoiceForm(
                            (current) => ({
                              ...current,

                              notes:
                                event.target
                                  .value,
                            }),
                          )
                        }
                        placeholder="Optional invoice notes..."
                        className="w-full resize-none rounded-xl border border-white/10 bg-[#050c17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500/50"
                      />
                    </FormField>
                  </div>
                </>
              )}

              <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setCreateInvoiceOpen(
                      false,
                    )
                  }
                  className="h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    optionsLoading ||
                    subscriptions.length ===
                      0 ||
                    busyAction ===
                      "create-invoice"
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold shadow-lg shadow-sky-500/20 hover:bg-sky-400 disabled:opacity-50"
                >
                  {busyAction ===
                  "create-invoice" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  Create Invoice
                </button>
              </div>
            </form>
          </Modal>
        )}

        {editInvoice && (
          <Modal
            eyebrow="Invoice Management"
            title={`Edit ${editInvoice.invoiceNo}`}
            onClose={() =>
              setEditInvoice(null)
            }
          >
            <form
              onSubmit={
                handleUpdateInvoice
              }
              className="p-6"
            >
              {modalError && (
                <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
                  {modalError}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Discount Amount">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      editInvoiceForm.discountAmount
                    }
                    onChange={(event) =>
                      setEditInvoiceForm(
                        (current) => ({
                          ...current,

                          discountAmount:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                  />
                </FormField>

                <FormField label="Due Date">
                  <input
                    type="date"
                    value={
                      editInvoiceForm.dueDate
                    }
                    onChange={(event) =>
                      setEditInvoiceForm(
                        (current) => ({
                          ...current,

                          dueDate:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none [color-scheme:dark] focus:border-sky-500/50"
                  />
                </FormField>
              </div>

              <div className="mt-5">
                <FormField label="Notes">
                  <textarea
                    rows={4}
                    value={
                      editInvoiceForm.notes
                    }
                    onChange={(event) =>
                      setEditInvoiceForm(
                        (current) => ({
                          ...current,

                          notes:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#050c17] px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50"
                  />
                </FormField>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setEditInvoice(null)
                  }
                  className="h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    busyAction ===
                    `edit-invoice-${editInvoice.id}`
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold hover:bg-sky-400 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />

                  Update Invoice
                </button>
              </div>
            </form>
          </Modal>
        )}

        {paymentInvoice && (
          <Modal
            eyebrow="Manual Payment"
            title={`Record Payment · ${paymentInvoice.invoiceNo}`}
            onClose={() =>
              setPaymentInvoice(
                null,
              )
            }
          >
            <form
              onSubmit={
                handleRecordPayment
              }
              className="p-6"
            >
              {modalError && (
                <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
                  {modalError}
                </div>
              )}

              <div className="mb-5 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-[#050c17] p-4">
                <div>
                  <p className="text-xs text-slate-500">
                    Total
                  </p>

                  <p className="mt-1 font-bold">
                    {formatCurrency(
                      paymentInvoice.totalAmount,
                      paymentInvoice.currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Paid
                  </p>

                  <p className="mt-1 font-bold text-emerald-300">
                    {formatCurrency(
                      paymentInvoice.paidAmount,
                      paymentInvoice.currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Due
                  </p>

                  <p className="mt-1 font-bold text-amber-300">
                    {formatCurrency(
                      paymentInvoice.dueAmount,
                      paymentInvoice.currency,
                    )}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Payment Amount"
                  required
                >
                  <input
                    type="number"
                    min="0.01"
                    max={
                      paymentInvoice.dueAmount
                    }
                    step="0.01"
                    value={
                      paymentForm.amount
                    }
                    onChange={(event) =>
                      setPaymentForm(
                        (current) => ({
                          ...current,

                          amount:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                  />
                </FormField>

                <FormField
                  label="Payment Mode"
                  required
                >
                  <select
                    value={
                      paymentForm.mode
                    }
                    onChange={(event) =>
                      setPaymentForm(
                        (current) => ({
                          ...current,

                          mode:
                            event.target
                              .value as PaymentMode,
                        }),
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                  >
                    <option value="CASH">
                      Cash
                    </option>

                    <option value="UPI">
                      UPI
                    </option>

                    <option value="BANK_TRANSFER">
                      Bank Transfer
                    </option>

                    <option value="CHEQUE">
                      Cheque
                    </option>

                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </FormField>

                <FormField
                  label="Payment Status"
                  required
                >
                  <select
                    value={
                      paymentForm.status
                    }
                    onChange={(event) =>
                      setPaymentForm(
                        (current) => ({
                          ...current,

                          status:
                            event.target
                              .value as
                              | "PENDING"
                              | "CONFIRMED",
                        }),
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                  >
                    <option value="CONFIRMED">
                      Confirmed
                    </option>

                    <option value="PENDING">
                      Pending
                    </option>
                  </select>
                </FormField>

                <FormField
                  label="Reference Number"
                  required={
                    referenceRequired
                  }
                >
                  <input
                    type="text"
                    value={
                      paymentForm.referenceNo
                    }
                    onChange={(event) =>
                      setPaymentForm(
                        (current) => ({
                          ...current,

                          referenceNo:
                            event.target
                              .value,
                        }),
                      )
                    }
                    placeholder={
                      referenceRequired
                        ? "Reference is required"
                        : "Optional reference"
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500/50"
                  />
                </FormField>

                <FormField
                  label="Received At"
                  required
                >
                  <input
                    type="datetime-local"
                    value={
                      paymentForm.receivedAt
                    }
                    onChange={(event) =>
                      setPaymentForm(
                        (current) => ({
                          ...current,

                          receivedAt:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none [color-scheme:dark] focus:border-sky-500/50"
                  />
                </FormField>
              </div>

              <div className="mt-5">
                <FormField label="Notes">
                  <textarea
                    rows={4}
                    value={
                      paymentForm.notes
                    }
                    onChange={(event) =>
                      setPaymentForm(
                        (current) => ({
                          ...current,

                          notes:
                            event.target
                              .value,
                        }),
                      )
                    }
                    placeholder="Optional payment notes..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#050c17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500/50"
                  />
                </FormField>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentInvoice(
                      null,
                    )
                  }
                  className="h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    busyAction ===
                    `record-payment-${paymentInvoice.id}`
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold hover:bg-sky-400 disabled:opacity-50"
                >
                  {busyAction ===
                  `record-payment-${paymentInvoice.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}

                  Record Payment
                </button>
              </div>
            </form>
          </Modal>
        )}
      </main>
    </RoleRouteGuard>
  );
}