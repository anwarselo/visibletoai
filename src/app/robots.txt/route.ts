import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";

export function GET() {
  const env = getServerEnv();
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: Claude-Web",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "User-agent: YouBot",
    "Allow: /",
    "",
    "User-agent: Applebot-Extended",
    "Allow: /",
    "",
    "User-agent: Meta-ExternalAgent",
    "Allow: /",
    "",
    "User-agent: Amazonbot",
    "Allow: /",
    "",
    `Sitemap: ${env.BASE_URL}/sitemap.xml`,
  ].join("\n");

  return new NextResponse(body, { headers: { "content-type": "text/plain" } });
}

