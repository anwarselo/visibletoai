import { Buffer } from "node:buffer";
import { getServerEnv } from "@/lib/env";
import { pingIndexNow } from "@/lib/indexnow";
import { summarizeText } from "@/lib/llm";
import { extractTextWithOcr } from "@/lib/ocr";
import { pdfToText } from "@/lib/pdf";
import { renderBusinessHtml } from "@/lib/render";
import { getServiceSupabase } from "@/lib/supa";
import type { Asset } from "@/lib/types/database";
import { jsonLdForBusiness } from "./jsonld";

export async function publishBusiness(businessId: string) {
  const env = getServerEnv();
  const supabase = getServiceSupabase();

  const { data: business, error: businessError } = await supabase
    .from("visibletoai_businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  if (businessError || !business) {
    throw new Error(`Business not found: ${businessError?.message ?? "unknown error"}`);
  }

  const asset = await fetchLatestAsset(business.id);
  const sourceUrl = asset ? await getPublicAssetUrl(asset.file_path) : undefined;
  const extractedText = asset ? await extractAssetText(asset) : business.description || "";

  if (asset && extractedText) {
    await supabase.from("visibletoai_assets").update({ ocr_text: extractedText }).eq("id", asset.id);
  }

  const aboutText =
    (await summarizeText(extractedText || business.description || "")) ||
    "Text extraction unavailable.";

  const html = renderBusinessHtml({
    business: { ...business, description: aboutText },
    aboutText,
    sourceUrl,
  });
  const url = `${env.BASE_URL}/b/${business.slug}`;
  const jsonld = jsonLdForBusiness({ ...business, description: aboutText }, env.BASE_URL);

  // Check if page already exists
  const { data: existingPage } = await supabase
    .from("visibletoai_public_pages")
    .select("id")
    .eq("business_id", business.id)
    .single();

  let pageData;
  let pageError;

  if (existingPage) {
    // Update existing page
    const result = await supabase
      .from("visibletoai_public_pages")
      .update({
        url,
        html_render: html,
        jsonld,
        last_published_at: new Date().toISOString(),
      })
      .eq("business_id", business.id)
      .select();
    pageData = result.data;
    pageError = result.error;
  } else {
    // Insert new page
    const result = await supabase
      .from("visibletoai_public_pages")
      .insert({
        business_id: business.id,
        url,
        html_render: html,
        jsonld,
        last_published_at: new Date().toISOString(),
      })
      .select();
    pageData = result.data;
    pageError = result.error;
  }

  if (pageError) {
    console.error("Failed to save public_pages:", pageError);
    throw new Error(`Failed to publish page: ${pageError.message}`);
  }
  
  console.log("Published page:", pageData);

  const indexResponse = await pingIndexNow(url);
  await supabase.from("visibletoai_index_events").insert({
    business_id: business.id,
    url,
    event_type: "published",
    status: indexResponse?.status ?? null,
    response: indexResponse ? { body: indexResponse.body } : null,
  });

  return { url, slug: business.slug };
}

async function fetchLatestAsset(businessId: string): Promise<Asset | null> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("visibletoai_assets")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !data?.length) {
    return null;
  }

  return data[0];
}

async function getPublicAssetUrl(path: string): Promise<string> {
  const env = getServerEnv();
  const supabase = getServiceSupabase();
  const { data } = supabase.storage.from(env.SUPABASE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function fetchAssetBuffer(asset: Asset): Promise<Buffer> {
  const env = getServerEnv();
  const supabase = getServiceSupabase();
  const download = await supabase.storage.from(env.SUPABASE_BUCKET).download(asset.file_path);

  if (!download.error && download.data) {
    return Buffer.from(await download.data.arrayBuffer());
  }

  const publicUrl = await getPublicAssetUrl(asset.file_path);
  const response = await fetch(publicUrl);

  if (!response.ok) {
    throw new Error(`Unable to fetch asset from public URL (${response.status})`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function extractAssetText(asset: Asset): Promise<string> {
  const buffer = await fetchAssetBuffer(asset);

  if (asset.mime_type === "application/pdf") {
    return pdfToText(buffer);
  }

  if (asset.mime_type.startsWith("text/")) {
    return buffer.toString("utf8");
  }

  if (asset.mime_type.startsWith("image/")) {
    return (await extractTextWithOcr(buffer, asset.mime_type)) || "";
  }

  return "";
}

