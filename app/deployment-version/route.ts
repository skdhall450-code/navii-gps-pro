import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    { commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "local" },
    { headers: { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" } },
  );
}
