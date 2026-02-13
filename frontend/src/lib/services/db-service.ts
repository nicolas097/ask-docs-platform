import { PoolClient } from 'pg';

export const dbService = {
  async createDocument(client: PoolClient, data: { name: string, size: number }) {
    const sql = `INSERT INTO documents (file_name, gcs_path, file_size, status) VALUES ($1, $2, $3, $4) RETURNING id`;
    const res = await client.query(sql, [data.name, data.name, data.size, 'PROCESSING']);
    return res.rows[0].id;
  },
  
  async insertChunk(client: PoolClient, docId: string, content: string, vector: number[], meta: any) {
    const sql = `INSERT INTO document_chunks (document_id, content, embedding, metadata) VALUES ($1, $2, $3::vector, $4)`;
    await client.query(sql, [docId, content, `[${vector.join(',')}]`, JSON.stringify(meta)]);
  },

  async insertChat(client: PoolClient, docId: string){

  }
};