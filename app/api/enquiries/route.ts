import { NextResponse } from "next/server";

export const runtime = "nodejs";

type EnquiryPayload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  vehicles?: unknown;
  message?: unknown;
  website?: unknown;
};

type Enquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  vehicles: string;
  message: string;
};

type DeliveryResult = {
  channel: "email" | "whatsapp" | "webhook";
  ok: boolean;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function text(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLength)
    : "";
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

function getClientAddress(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(address: string) {
  const now = Date.now();
  const recent = (requestLog.get(address) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(address, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(address, recent);
  return false;
}

function validate(payload: EnquiryPayload): { enquiry?: Enquiry; error?: string } {
  const enquiry: Enquiry = {
    name: text(payload.name, 80),
    company: text(payload.company, 120),
    email: text(payload.email, 160).toLowerCase(),
    phone: normalizePhone(text(payload.phone, 24)),
    vehicles: text(payload.vehicles, 8),
    message: text(payload.message, 2000),
  };

  if (enquiry.name.length < 2) return { error: "Please enter your full name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!/^\d{10,15}$/.test(enquiry.phone)) {
    return { error: "Please enter a valid mobile number with country code." };
  }
  if (enquiry.vehicles && !/^\d{1,6}$/.test(enquiry.vehicles)) {
    return { error: "Please enter a valid number of vehicles." };
  }

  return { enquiry };
}

function createPlainMessage(enquiry: Enquiry) {
  return [
    "New NAVII GPS website enquiry",
    "",
    `Name: ${enquiry.name}`,
    `Company: ${enquiry.company || "Not provided"}`,
    `Email: ${enquiry.email}`,
    `Mobile: +${enquiry.phone}`,
    `Vehicles: ${enquiry.vehicles || "Not provided"}`,
    `Requirement: ${enquiry.message || "Not provided"}`,
    "",
    "Source: https://naviigps.com/contact",
    `Received: ${new Date().toISOString()}`,
  ].join("\n");
}

async function notifyByEmail(enquiry: Enquiry): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { channel: "email", ok: false };

  const destination = process.env.CONTACT_ENQUIRY_EMAIL || "info@naviigps.com";
  const sender =
    process.env.CONTACT_FROM_EMAIL ||
    "NAVII GPS Website <website@naviigps.com>";
  const rows = [
    ["Name", enquiry.name],
    ["Company", enquiry.company || "Not provided"],
    ["Email", enquiry.email],
    ["Mobile", `+${enquiry.phone}`],
    ["Vehicles", enquiry.vehicles || "Not provided"],
    ["Requirement", enquiry.message || "Not provided"],
  ];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [destination],
      reply_to: enquiry.email,
      subject: `New NAVII GPS enquiry from ${enquiry.name}`,
      text: createPlainMessage(enquiry),
      html: `<h2>New NAVII GPS website enquiry</h2><table>${rows
        .map(
          ([label, value]) =>
            `<tr><th style="padding:8px;text-align:left;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}</table>`,
    }),
  });

  return { channel: "email", ok: response.ok };
}

async function notifyByWhatsApp(enquiry: Enquiry): Promise<DeliveryResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const destination = process.env.CONTACT_WHATSAPP_TO;
  if (!accessToken || !phoneNumberId || !destination) {
    return { channel: "whatsapp", ok: false };
  }

  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v23.0";
  const response = await fetch(
    `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: normalizePhone(destination),
        type: "text",
        text: { preview_url: false, body: createPlainMessage(enquiry) },
      }),
    },
  );

  return { channel: "whatsapp", ok: response.ok };
}

async function notifyWebhook(enquiry: Enquiry): Promise<DeliveryResult> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return { channel: "webhook", ok: false };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CONTACT_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({ ...enquiry, source: "naviigps.com/contact" }),
  });

  return { channel: "webhook", ok: response.ok };
}

export async function POST(request: Request) {
  const responseHeaders = { "Cache-Control": "no-store" };

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 20_000) {
      return NextResponse.json(
        { ok: false, error: "Enquiry is too large." },
        { status: 413, headers: responseHeaders },
      );
    }

    const payload = (await request.json()) as EnquiryPayload;

    // A filled honeypot is acknowledged without notifying the sales team.
    if (text(payload.website, 200)) {
      return NextResponse.json({ ok: true }, { headers: responseHeaders });
    }

    if (isRateLimited(getClientAddress(request))) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429, headers: responseHeaders },
      );
    }

    const validation = validate(payload);
    if (!validation.enquiry) {
      return NextResponse.json(
        { ok: false, error: validation.error },
        { status: 400, headers: responseHeaders },
      );
    }

    const deliveries = await Promise.allSettled([
      notifyByEmail(validation.enquiry),
      notifyByWhatsApp(validation.enquiry),
      notifyWebhook(validation.enquiry),
    ]);
    const results = deliveries.flatMap((delivery) =>
      delivery.status === "fulfilled" ? [delivery.value] : [],
    );
    const deliveredChannels = results
      .filter((result) => result.ok)
      .map((result) => result.channel);

    if (deliveredChannels.length === 0) {
      console.error("Contact enquiry delivery failed on every configured channel.");
      return NextResponse.json(
        {
          ok: false,
          error:
            "We could not deliver your enquiry right now. Please use the WhatsApp option below.",
        },
        { status: 503, headers: responseHeaders },
      );
    }

    return NextResponse.json(
      { ok: true, deliveredChannels },
      { headers: responseHeaders },
    );
  } catch (error) {
    console.error("Contact enquiry route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not deliver your enquiry right now. Please use the WhatsApp option below.",
      },
      { status: 500, headers: responseHeaders },
    );
  }
}
