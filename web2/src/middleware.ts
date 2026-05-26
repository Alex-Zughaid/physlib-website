import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Bots that ignore robots.txt or are not wanted on heavy static assets.
// These are enforced server-side; robots.txt alone is advisory.
const BLOCKED_ON_DOCS = [
  /CCBot/i,
  /GPTBot/i,
  /OAI-SearchBot/i,
  /ChatGPT-User/i,
  /AmazonBot/i,
  /anthropic-ai/i,
  /Claude-Web/i,
  /PerplexityBot/i,
  /SemrushBot/i,
  /AhrefsBot/i,
  /MJ12bot/i,
  /PetalBot/i,
];

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/docs/")) {
    for (const pattern of BLOCKED_ON_DOCS) {
      if (pattern.test(ua)) {
        return new NextResponse("Forbidden", {
          status: 403,
          headers: { "Content-Type": "text/plain" },
        });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/docs/:path*"],
};
