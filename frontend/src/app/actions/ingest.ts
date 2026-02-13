'use server'

import pool from '@/lib/db';
import { processGCSFile } from '@/lib/services/pdf-service';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import {DocumentRepository} from "@/lib/repositories/document-repository"
import { aiService } from '@/lib/services/ai-service';

export async function ingestDocumentAction(fileName: string, size: number) {

  // llamamos a la clase repositorioa 

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN')
  const docRepo = new DocumentRepository(pool);
    ;
    console.log("Insertando");


    console.log("2. Llamando al repo...");

    const docId = await docRepo.create({
      fileName: fileName,      // Cambiado de fileName a name (según el DTO)
      fileSize: size,          // Ahora pasamos el tamaño que recibes por parámetro
      gcsPath: fileName    // O la ruta que definas en GCS
    }, client);

    fetch('http://localhost:3000/api/workers/process-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ docId, fileName })
    }).catch(err => {
      console.error("Error al disparar el worker:", err);
    });
    console.log("No ha llamado a ninugna api")

    await client.query('COMMIT');

    return { success: true, docId: docId};

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error("Error en la ingesta:", error.message);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}