import { PDFParse } from "pdf-parse";

export async function pdfToText(buffer: ArrayBuffer | Buffer): Promise<string> {
  const data = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const parser = new PDFParse({ data });

  try {
    const result = await parser.getText();
    return (result.text || "").trim();
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

