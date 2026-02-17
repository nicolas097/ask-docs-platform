'use server'

import pool from '@/lib/db';
import { processGCSFile } from '@/lib/services/pdf-service';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { DocumentRepository } from "@/lib/repositories/document-repository"
import { aiService } from '@/lib/services/ai-service';
import { ChatRepository } from "@/lib/repositories/chat-repository"


export async function ingestDocumentAction(fileName: string, size: number) {

  // llamamos a la clase repositorioa 

  const client = await pool.connect();

  try {
    await client.query('BEGIN')
    const docRepo = new DocumentRepository(pool);
    const chatRepo = new ChatRepository(pool);
    console.log("Insertando");


    console.log("2. Llamando al repo...");

    const docId = await docRepo.create({
      fileName: fileName,
      fileSize: size,
      gcsPath: fileName
    }, client);

    const chatId = await chatRepo.create({
      title: `${fileName}`,
      documentId: docId
    }, client)
    await client.query('COMMIT');


    fetch('http://localhost:3000/api/workers/process-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ docId, fileName })
    }).catch(err => {
      console.error("Error al disparar el worker:", err);
    });


    return { success: true, docId: docId, chatId: chatId };

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error("Error en la ingesta:", error.message);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}