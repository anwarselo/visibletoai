import { notFound } from "next/navigation";
import { getServiceSupabase } from "@/lib/supa";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function BusinessPage({ params }: Params) {
  const { slug } = await params;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("majed_businesses")
    .select("*, public_pages:majed_public_pages(*)")
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
      </section>
    </main>
  );
}

