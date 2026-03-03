import { Pool, PoolClient } from 'pg';
import { CreateMessageDTO } from '@/lib/types/database.types';
import { CreateChatDTO } from '@/lib/types/database.types';
import { BaseRepository } from "@/lib/repositories/base-repository"



export class ChatRepository extends BaseRepository {


  async create(data: CreateChatDTO, client?: PoolClient): Promise<string> {
    // Si no hay título, usamos uno por defecto o las primeras palabras del prompt
    const title = data.title || 'Nueva conversación';

    const query = `
      INSERT INTO chats (title, document_id, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id
    `;

    const res = await this.getExecutor(client).query(
      query, [
      title,
      data.documentId || null
    ]
    )

    return res.rows[0].id;
  }

  async addMessage(data: CreateMessageDTO, client?: PoolClient): Promise<void> {
    const query = `
      INSERT INTO messages (chat_id, role, content, created_at)
      VALUES ($1, $2, $3, NOW())
    `;

    await this.getExecutor(client).query(
      query, [
      data.chatId,
      data.role,
      data.content
      ]
    )
  }

  async getHistory(chatId: string, client?: PoolClient) {
    const query = `
      SELECT id, role, content 
      FROM messages  
      WHERE chat_id = $1 
      ORDER BY created_at ASC
    `;
    const res = await this.getExecutor(client).query(query, [chatId]);
    return res.rows;
  }


  async getFindIdDocumentChat(chatId: string, client?: PoolClient) {
    const query = `SELECT document_id FROM chats WHERE id = $1`;
    const res = await this.getExecutor(client).query(query, [chatId]);
    return res.rows[0];
  }


  async updateTitle(chatId: string, title: string, client?: PoolClient): Promise<void> {
    const query = `
    UPDATE chats 
    SET title = $1, updated_at = NOW() 
    WHERE id = $2
  `;

    await this.getExecutor(client).query(query, [title, chatId]);
  }


   async getAllDocs (){

        const query = `SELECT * FROM chats c `;

        const res = await this.getExecutor().query(query);

        return res.rows;
    }
}




