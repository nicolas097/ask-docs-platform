import { Pool, PoolClient } from "pg";
import { CreateDocumentDTO } from '@/lib/types/database.types';
import { InsertChunkDTO } from "@/lib/types/database.types";
import { pool as defaultPool } from "@/lib/db";
import { BaseRepository } from "@/lib/repositories/base-repository";

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

}