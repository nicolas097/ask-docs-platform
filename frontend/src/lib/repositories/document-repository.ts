import { Pool, PoolClient } from 'pg';
import { CreateDocumentDTO } from '@/lib/types/database.types';
import { InsertChunkDTO } from "@/lib/types/database.types";


export class DocumentRepository {
    private db: Pool;

    constructor(pool: Pool) {
        this.db = pool;
    }


    async create(data: CreateDocumentDTO, client?: PoolClient): Promise<string> {
        const executor = client || this.db;

        const query = `
      INSERT INTO documents (file_name, gcs_path, file_size, status) 
      VALUES ($1, $2, $3, 'PENDING') 
      RETURNING id
    `;

        const res = await executor.query(query, [
            data.fileName,
            data.gcsPath,
            data.fileSize
        ]);

        return res.rows[0].id;
    }



    async insertChunk(data: InsertChunkDTO, client?: PoolClient): Promise<void> {
        const executor = client || this.db;

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
            await executor.query(query, [
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
}