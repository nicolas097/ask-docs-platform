import { Pool, PoolClient } from "pg";
import { CreateDocumentDTO } from '@/lib/types/database.types';
import { MessageSource } from "@/lib/types/database.types";
import { pool as defaultPool } from "@/lib/db";
import { BaseRepository } from "@/lib/repositories/base-repository";


export class SourceRepository extends BaseRepository {


    async insertMessageSource(data: MessageSource, client?: PoolClient): Promise<void> {
        const query = `
        INSERT INTO message_sources (message_id, document_id, page_number, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (message_id, document_id, page_number ) DO NOTHING;
    `;

        try {
            await this.getExecutor(client).query(query, [
                data.message_id,
                data.documentId,
                data.page_number
            ]);
        } catch (error: any) {
            console.error("ERROR AL INSERTAR FUENTE:", error.message);
            throw error;
        }
    }


    async getLatestPagesByUrl(chatId: string, client?: PoolClient): Promise<number[]> {
        const query = `
            SELECT array_agg(ms.page_number ORDER BY ms.page_number) AS "latestPages"
            FROM message_sources ms
            INNER JOIN messages m ON m.id = ms.message_id
            WHERE m.chat_id = $1
            AND m.created_at = (SELECT MAX(created_at) FROM messages WHERE chat_id = $1);`;

        try {
            const res = await this.getExecutor(client).query(query,
                [chatId]
            );
            
            return res.rows[0]?.latestPages;
        } catch (error: any) {
            console.error("ERROR SQL AL RECUPERAR ÚLTIMAS PÁGINAS:", error.message);
            return [];
        }
    }

}