import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; 

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: docId } = await params;

  const client = await pool.connect();

  try {
  
    const query = 'SELECT status FROM documents WHERE id = $1';
    const result = await client.query(query, [docId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }

    const status = result.rows[0].status; 

    return NextResponse.json({ status });

  } catch (error) {
    console.error('Error consultando estado:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  } finally {
    client.release();
  }
}