import { z } from "zod";

const envSchema = z
  .object({
    BASE_URL: z.string().url().default("http://localhost:3000"),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SUPABASE_ANON_KEY: z.string().min(1).optional(),
    SUPABASE_BUCKET: z.string().default("business-assets"),
    OCR_ENABLED: z.coerce.boolean().default(true),
    OCR_USE_DEEPSEEK: z.coerce.boolean().default(true),
    DEEPSEEK_OCR_MODEL_PATH: z.string().optional(),
    DEEPSEEK_OCR_DEVICE: z.string().optional(),
    DEEPSEEK_OCR_COMPRESSION_RATIO: z.coerce.number().int().positive().optional(),
    DEEPSEEK_OCR_BATCH_SIZE: z.coerce.number().int().positive().optional(),
    DEEPSEEK_OCR_API_KEY: z.string().optional(),
    DEEPSEEK_OCR_API_URL: z.string().url().default("https://api.novita.ai/openai"),
    DEEPSEEK_OCR_MODEL: z.string().default("deepseek/deepseek-ocr"),
    DEEPSEEK_OCR_MAX_TOKENS: z.coerce.number().int().positive().default(4096),
    TESSERACT_LANG: z.string().default("eng"),
    TESSERACT_PATH: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    LLM_MODEL_NAME: z.string().default("gpt-5-mini"),
    LLM_MAX_TOKENS: z.coerce.number().int().positive().default(2048),
    INDEXNOW_KEY: z.string().optional(),
    INDEXNOW_KEY_PATH: z.string().optional(),
  })
  .transform((value) => ({
    ...value,
    BASE_URL: value.BASE_URL.replace(/\/$/, ""),
  }));

export type ServerEnv = z.infer<typeof envSchema>;

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(
      `Environment validation failed: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ")}`,
    );
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function resetEnvCache() {
  cachedEnv = null;
}

