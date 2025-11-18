import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supa";
import { getServerEnv } from "@/lib/env";

export async function GET() {
  const env = getServerEnv();
  const supabase = getServiceSupabase();
  
  const { data: pages } = await supabase
    .from("visibletoai_public_pages")
    .select("url, last_published_at")
    .order("last_published_at", { ascending: false });

  const urls = (pages || []).map((page) => ({
    loc: page.url.replace("https://yourdomain.com", env.BASE_URL),
    lastmod: page.last_published_at,
    changefreq: "monthly",
    priority: 0.8,
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(sitemap, { 
    headers: { 
      "content-type": "application/xml",
      "cache-control": "public, max-age=3600, s-maxage=3600"
    } 
  });
}

