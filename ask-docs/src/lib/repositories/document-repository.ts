import { Pool, PoolClient } from "../../../node_modules/@types/pg";
import { CreateDocumentDTO,  InsertChunkDTO} from '@/lib/types/database.types';
import { pool as defaultPool } from "@/lib/db";
import { BaseRepository } from "@/lib/repositories/base-repository";
import { notFound } from "next/navigation";

export class DocumentRepository extends BaseRepository {



    async create(data: CreateDocumentDTO, client?: PoolClient): Promise<string> {

        const query = `
      INSERT INTO documents (file_name, gcs_path, file_size, status) 
      VALUES ($1, $2, $3, 'PENDING') 
      RETURNING id
    `;


        const res = await this.getExecutor(client).query(
            query, [
            data.fileName,
            data.gcsPath,
            data.fileSize
        ]
        )
        return res.rows[0].id;

    }



    async insertChunk(data: InsertChunkDTO, client?: PoolClient): Promise<void> {

        if (!data.embedding || data.embedding.length === 0) {
            console.error("ERROR CRÍTICO: El vector embedding está vacío o es null.");
            throw new Error("Vector vacío");
        }

        const vectorStr = `[${data.embedding.join(',')}]`;
        const metadataJson = JSON.stringify(data.metadata);

        const query = `
        INSERT INTO document_chunks (document_id, content, embedding, metadata) 
        VALUES ($1, $2, $3::vector, $4)
    `;

        try {


            await this.getExecutor(client).query(
                query, [
                data.documentId,
                data.content,
                vectorStr,
                metadataJson
            ]);


        } catch (error: any) {
            console.error("ERROR SQL INSERTANDO CHUNK:", error.message);
            throw error;
        }
    }

    async getFindGcsPath(docId: string, client?: PoolClient) {

        const query = `SELECT gcs_path FROM documents WHERE id = $1`;
        const res = await this.getExecutor(client).query(query, [docId]);
        return res.rows[0];
    }

    async getDocumentStatus(docId: string, client?: PoolClient): Promise<String> {

        try {
            const query = 'SELECT status FROM documents WHERE id = $1';
            const res = await this.getExecutor(client).query(query, [docId]);

            if (res.rows.length === 0) {
                console.log("Documento no encontrados")
            }

            const status = res.rows[0].status;

            return status;

        } catch (error) {
            console.error('Error consultando estado:', error);
            throw error;
        }

    }

    async findRelevantChunks(docId: string, embedding: number[], limit = 5) {
        
        const query = `
                SELECT 
                content, 
                (metadata->>'pageNumber')::int AS page_number 
                FROM document_chunks 
                WHERE document_id = $1  
                ORDER BY embedding <=> $2::vector 
                LIMIT $3
            `;

        // Convertimos el array de JS a un formato que Postgres entienda como vector
        const res = await this.getExecutor().query(query, [
            docId,
            JSON.stringify(embedding),
            limit
        ]);
        return res.rows;
    }


   

}