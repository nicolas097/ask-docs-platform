// @ts-nocheck
import { Storage } from "@google-cloud/storage";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import path from "path";

// Parche vital para Next.js 15 / pdf-parse
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0; }
  };
}

export async function processGCSFile(fileName: string) {
  try {
    const keyPath = path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS!);
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: keyPath,
    });

    const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);
    const file = bucket.file(fileName);

    const [downloadedBuffer] = await file.download();
    console.log(`Archivo bajado: ${downloadedBuffer.length} bytes`);

    const blob = new Blob([new Uint8Array(downloadedBuffer)]);

    const loader = new PDFLoader(blob, { splitPages: true });
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });

    return await splitter.splitDocuments(docs);
    
  } catch (error) {
    console.error("Error en pdf-service:", error);
    throw error;
  }
}


