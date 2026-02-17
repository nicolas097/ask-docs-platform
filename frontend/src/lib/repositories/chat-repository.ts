import { Pool, PoolClient } from 'pg';
import { CreateMessageDTO } from '@/lib/types/database.types';
import { CreateChatDTO } from '@/lib/types/database.types';



export class ChatRepository{

    private db: Pool;

    constructor(pool: Pool){
        this.db = pool
    }


   async create(data: CreateChatDTO, client?: PoolClient): Promise<string> {
    // Si no hay título, usamos uno por defecto o las primeras palabras del prompt

    const executor = client || this.db; 
    const title = data.title || 'Nueva conversación';
    
    const query = `
      INSERT INTO chats (title, document_id, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id
    `;

    const res = await executor.query(query, [
        title, 
        data.documentId || null 
    ]);
    
    return res.rows[0].id;
  }

  async addMessage(data: CreateMessageDTO): Promise<void> {
    const query = `
      INSERT INTO messages (chat_id, role, content, created_at)
      VALUES ($1, $2, $3, NOW())
    `;

    await this.db.query(query, [
      data.chatId, 
      data.role, 
      data.content
    ]);
  }

  async getHistory(chatId: string) {
    const query = `
      SELECT role, content 
      FROM messages 
      WHERE chat_id = $1 
      ORDER BY created_at ASC
    `;
    const res = await this.db.query(query, [chatId]);
    return res.rows;
  }
}



