import pdf from "pdf-parse";

export async function pdfToText(buffer: ArrayBuffer | Buffer): Promise<string> {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const result = await pdf(buf);
  return (result.text || "").trim();
}

