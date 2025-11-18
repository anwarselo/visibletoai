import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";

export function GET() {
  const env = getServerEnv();
  
  if (!env.INDEXNOW_KEY) {
    return new NextResponse("Not configured", { status: 404 });
  }

  return new NextResponse(env.INDEXNOW_KEY, { 
    headers: { "content-type": "text/plain" } 
  });
}

