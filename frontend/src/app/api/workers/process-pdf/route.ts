import { NextResponse } from 'next/server';
import {DocumentRepository} from "@/lib/repositories/document-repository"
import { processGCSFile } from '@/lib/services/pdf-service';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { aiService } from '@/lib/services/ai-service';
import pool from '@/lib/db';


export async function POST(req: Request) {
  const { docId, fileName } = await req.json();
  const docRepo = new DocumentRepository(pool);
  
  (async () => {
      const client = await pool.connect();
      try {
          await client.query("UPDATE documents SET status = 'PROCESSING' WHERE id = $1", [docId]);

  
          const chunks = await processGCSFile(fileName); 
          const model = aiService.getEmbeddings();
          
          for (const chunk of chunks) {
              const vector = await model.embedQuery(chunk.pageContent);
               await docRepo.insertChunk({
                  documentId: docId,
                  content: chunk.pageContent,
                  embedding: vector,
                  metadata: {
                      pageNumber: chunk.metadata?.loc?.pageNumber ?? chunk.metadata?.page ?? 1,
                      source: fileName
                  }
              }, client);

          }

          await client.query("UPDATE documents SET status = 'COMPLETED' WHERE id = $1", [docId]);
          
      } catch (error) {
          console.error(error);
          await client.query("UPDATE documents SET status = 'FAILED' WHERE id = $1", [docId]);
      } finally {
          client.release();
      }
  })();

  
  return NextResponse.json({ started: true });
}