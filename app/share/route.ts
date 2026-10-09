// A standalone document deliberately bypasses the marketing root layout and all analytics.
// There are no account cookies, map tiles, geocoders, trackers or third-party scripts here.
export const dynamic = "force-dynamic";

export function GET() {
  const configured = process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.naviigps.com";
  let api: URL;
  try { api = new URL(configured); } catch { return new Response("Tracking temporarily unavailable", { status: 503 }); }
  const local = ["localhost", "127.0.0.1"].includes(api.hostname);
  if (api.username || api.password || api.search || api.hash || (api.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && local && api.protocol === "http:"))) {
    return new Response("Tracking temporarily unavailable", { status: 503 });
  }
  const endpoint = new URL("/api/public/tracking-link/position", api.origin).href.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><meta name="tracking-endpoint" content="${endpoint}"><title>Temporary vehicle location | NAVII GPS</title><link rel="stylesheet" href="/tracking-share/viewer.css"><script src="/tracking-share/viewer.js"></script></head><body><main><p class="eyebrow">NAVII GPS · READ-ONLY</p><h1>Temporary vehicle location</h1><p id="notice" role="status" aria-live="polite">Checking tracking link…</p><section id="location" hidden><h2 id="vehicle"></h2><div id="status" class="badge"></div><p id="age"></p><p id="coordinates"></p><p id="speed"></p><p id="expires"></p><p class="hint">Only the latest GPS fix is shown. A last-known position is not the vehicle’s current location.</p></section><button id="refresh" type="button" hidden>Refresh location</button><p class="privacy">No account details, location history or third-party maps are included. Anyone holding the original link can view this vehicle until it expires or is revoked.</p><p class="privacy">For privacy, this page removes the secret from the address bar. To reopen after a reload, use the original link.</p></main></body></html>`;
  return new Response(html, { headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store, private, max-age=0", "Pragma": "no-cache",
    "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow, noarchive",
    "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY",
    "Content-Security-Policy": `default-src 'none'; script-src 'self'; style-src 'self'; connect-src ${api.origin}; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  } });
}
