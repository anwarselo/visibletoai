import OpenAI from "openai";
import { getServerEnv } from "./env";

let cachedClient: OpenAI | null = null;

function getOpenAiClient(): OpenAI | null {
  const env = getServerEnv();
  if (!env.OPENAI_API_KEY) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return cachedClient;
}

export async function summarizeText(input: string): Promise<string> {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  const env = getServerEnv();
  const client = getOpenAiClient();

  if (!client) {
    return trimmed;
  }

  const limited = trimmed.slice(0, 6000);
  
  try {
    const response = await client.chat.completions.create({
      model: env.LLM_MODEL_NAME,
      max_tokens: env.LLM_MAX_TOKENS,
      messages: [
        {
          role: "system",
          content:
            "You rewrite business descriptions into short, factual paragraphs suitable for a microsite. Keep headings or bullet points when provided.",
        },
        {
          role: "user",
          content: limited,
        },
      ],
    });

    return response.choices[0]?.message?.content?.trim() || trimmed;
  } catch (error) {
    console.warn("LLM summarization failed, returning raw text:", error);
    return trimmed;
  }
}

