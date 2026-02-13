'use server' // <--- ESTO ES VITAL

import { Storage } from "@google-cloud/storage";
import path from "path";

export async function downloadFileFromGCSAction(fileName: string) {
  try {
    const keyPath = path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS!);
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: keyPath,
    });

    const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);
    const file = bucket.file(fileName);

    // Verificamos existencia
    const [exists] = await file.exists();
    if (!exists) return { success: false, error: "El archivo no existe en el bucket" };

    // Intentamos la descarga (esto verifica permisos de la Service Account)
    const [content] = await file.download();
    
    console.log(`✅ Verificación exitosa: ${content.length} bytes descargados.`);
    
    return { success: true, size: content.length };
  } catch (error: any) {
    console.error("❌ Error de verificación:", error.message);
    return { success: false, error: error.message };
  }
}