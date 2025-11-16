import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supa";

export async function GET() {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("majed_public_pages")
    .select("url,last_published_at")
    .order("last_published_at", { ascending: false })
    .limit(5000);

  const urls =
    data
      ?.map(
        (row) =>
          `<url><loc>${row.url}</loc><lastmod>${new Date(row.last_published_at).toISOString()}</lastmod></url>`,
      )
      .join("") ?? "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(xml, { headers: { "content-type": "application/xml" } });
}

