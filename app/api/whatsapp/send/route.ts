import { NextResponse } from "next/server";

type WhatsAppPayload = {
  to?: string;
  body?: string;
};

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as WhatsAppPayload;
    const to = payload.to ? normalizePhone(payload.to) : "";
    const body = payload.body?.trim() || "";
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v23.0";

    if (!to || !body) {
      return NextResponse.json(
        { ok: false, error: "WhatsApp recipient and message are required." },
        { status: 400 },
      );
    }

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json(
        { ok: false, error: "WhatsApp API is not configured yet." },
        { status: 503 },
      );
    }

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
          to,
          type: "text",
          text: { preview_url: false, body },
        }),
      },
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("WhatsApp API error:", result);
      return NextResponse.json(
        { ok: false, error: "WhatsApp provider rejected the message." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, messageId: result?.messages?.[0]?.id ?? null });
  } catch (error) {
    console.error("WhatsApp send route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to send WhatsApp message." },
      { status: 500 },
    );
  }
}
