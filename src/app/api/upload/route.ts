import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { publishBusiness } from "@/lib/publish";
import { getServerEnv } from "@/lib/env";
import { getServiceSupabase } from "@/lib/supa";
import { generateSlug } from "@/lib/slug";

const acceptedMime = [
  "application/pdf",
  "text/plain",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const formSchema = z.object({
  name: z.string().min(2).max(120),
  file: z
    .any()
    .refine((value) => value instanceof File, "File is required")
    .refine((value: File) => acceptedMime.includes(value.type), "Unsupported file type"),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = formSchema.safeParse({
    name: formData.get("name"),
    file: formData.get("file"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { name, file } = parsed.data;
  const env = getServerEnv();
  const supabase = getServiceSupabase();
  const slug = generateSlug(name);

  const { data: business, error: bizError } = await supabase
    .from("visibletoai_businesses")
    .insert({ name, slug })
    .select("*")
    .single();

  if (bizError || !business) {
    return NextResponse.json(
      { error: bizError?.message || "Unable to create business" },
      { status: 500 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  const storagePath = `businesses/${business.id}/${file.name}`;

  const upload = await supabase.storage
    .from(env.SUPABASE_BUCKET)
    .upload(storagePath, buffer, { contentType: file.type, upsert: true });

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 });
  }

  const assetInsert = await supabase.from("visibletoai_assets").insert({
    business_id: business.id,
    file_path: storagePath,
    mime_type: file.type,
    sha256,
  });

  if (assetInsert.error) {
    return NextResponse.json({ error: assetInsert.error.message }, { status: 500 });
  }

  await publishBusiness(business.id);

  return NextResponse.json({ slug: business.slug }, { status: 201 });
}

