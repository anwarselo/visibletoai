import { notFound } from "next/navigation";
import { getServiceSupabase } from "@/lib/supa";
import type { Metadata } from "next";

type Params = {
  params: Promise<{ slug: string }>;
};

async function IndexNowStatus({ businessId }: { businessId: string }) {
  const supabase = getServiceSupabase();
  const { data: event } = await supabase
    .from("visibletoai_index_events")
    .select("status, created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!event) {
    return (
      <footer style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb", color: "#6b7280", fontSize: "0.875rem" }}>
        ⏳ Indexing pending
      </footer>
    );
  }

  const isSuccess = event.status === 200;
  const date = new Date(event.created_at).toLocaleDateString();

  return (
    <footer style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb", color: "#6b7280", fontSize: "0.875rem" }}>
      {isSuccess ? `✓ Indexed with Bing on ${date}` : `⚠ Indexing attempt on ${date} (status: ${event.status})`}
    </footer>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("visibletoai_businesses")
    .select("name, description, public_pages:visibletoai_public_pages(html_render)")
    .eq("slug", slug)
    .single();

  if (!data) {
    return { title: "Business Not Found" };
  }

  const description = data.description || 
    data.public_pages?.[0]?.html_render?.substring(0, 160).replace(/<[^>]*>/g, "") || 
    `View ${data.name}'s business microsite`;

  const url = `${process.env.BASE_URL || "http://localhost:3000"}/b/${slug}`;

  return {
    title: data.name,
    description,
    openGraph: {
      title: data.name,
      description,
      type: "website",
      url,
    },
    twitter: {
      card: "summary",
      title: data.name,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BusinessPage({ params }: Params) {
  const { slug } = await params;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("visibletoai_businesses")
    .select("*, public_pages:visibletoai_public_pages(*)")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const page = data.public_pages?.[0];

  if (!page) {
    return (
      <main className="page">
        <section className="card">
          <h1>{data.name}</h1>
          <p>We are still processing this microsite. Check back soon.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.jsonld) }}
        />
        <article dangerouslySetInnerHTML={{ __html: page.html_render }} />
        <IndexNowStatus businessId={data.id} />
      </section>
    </main>
  );
}

