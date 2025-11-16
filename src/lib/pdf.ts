import { createRequire } from "node:module";
import { PDFParse } from "pdf-parse";

let workerConfigured = false;

function ensurePdfWorker() {
  if (workerConfigured) {
    return;
  }

  const require = createRequire(import.meta.url);
  const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
  PDFParse.setWorker(workerPath);
  workerConfigured = true;
}

export async function pdfToText(buffer: ArrayBuffer | Buffer): Promise<string> {
  ensurePdfWorker();
  const data = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const parser = new PDFParse({ data });

  try {
    const result = await parser.getText();
    return (result.text || "").trim();
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

