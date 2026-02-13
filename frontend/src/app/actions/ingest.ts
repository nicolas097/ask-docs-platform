'use server'

import pool from '@/lib/db';
import { processGCSFile } from '@/lib/services/pdf-service';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { aiService } from '@/lib/services/ai-service';
import { dbService } from '@/lib/services/db-service';

export async function ingestDocumentAction(fileName: string, size: number) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const docId = await dbService.createDocument(client, {name: fileName, size});
    const chunks = await processGCSFile(fileName);
    const model = aiService.getEmbeddings();


    for (const chunk of chunks) {
      const vector = await model.embedQuery(chunk.pageContent);
      await dbService.insertChunk(client, docId, chunk.pageContent, vector, chunk.metadata);
    }


    await client.query("UPDATE documents SET status = 'COMPLETED' WHERE id = $1", [docId]);
    await client.query('COMMIT');
    

    // 1. Registro inicial
    // const insertDocQuery = `
    //   INSERT INTO documents (file_name, gcs_path, file_size, status)
    //   VALUES ($1, $2, $3, 'PROCESSING')
    //   RETURNING id
    // `;
    // const docRes = await client.query(insertDocQuery, [fileName, fileName, fileSize]);
    // const documentId = docRes.rows[0].id;

    // // 2. PROCESAMIENTO (Usa el script de descarga verificado)
    // //const chunks = await processGCSFile(fileName);
    // console.log(`📄 Documento dividido en ${chunks.length} fragmentos.`);

    // // 3. IA: EMBEDDINGS
    // const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    //   modelName: "models/gemini-embedding-001",
    // });

    
    

    // // 4. GUARDADO EN PGVECTOR
    // for (const chunk of chunks) {
    //   // Nota: embedQuery devuelve el array de números (el vector)
    //   const embedding = await embeddingsModel.embedQuery(chunk.pageContent);

    //   const insertChunkQuery = `
    //     INSERT INTO document_chunks (document_id, content, embedding, metadata)
    //     VALUES ($1, $2, $3::vector, $4)
    //   `;

    //   await client.query(insertChunkQuery, [
    //     documentId,
    //     chunk.pageContent,
    //     `[${embedding.join(",")}]`, 
    //     JSON.stringify(chunk.metadata)
    //   ]);
    // }

    // 5. FINALIZAR
 

    return { success: true, message: "Ingesta completada" };

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error("Error en la ingesta:", error.message);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}