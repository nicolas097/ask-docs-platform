import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; 
import {HistoryService} from '@/lib/services/history-service';

export async function GET(req: Request, { params }: { params: { chatId: string } }){

  const client = await pool.connect();

  const {chatId} = await params;

  try {
  
    // const query = 'SELECT status FROM documents WHERE id = $1';
    // const result = await client.query(query, [docId]);

    const getChats = await HistoryService.getValidHistory(chatId);

    // if (result.rows.length === 0) {
    //   return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    // }

    // const status = result.rows[0].status; 

    return NextResponse.json(getChats);

  } catch (error) {
    console.error('Error consultando estado:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  } finally {
    client.release();
  }
}