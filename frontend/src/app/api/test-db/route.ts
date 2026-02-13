import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await pool.query('SELECT NOW()');
    return NextResponse.json({ 
      success: true, 
      message: "¡Conexión exitosa!",
      dbTime: res.rows[0].now 
    });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}