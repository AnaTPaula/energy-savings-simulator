import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
}

export async function GET(request: Request) {
  try {
    // Check token
    const token = request.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
    }

    const leads = await db.query(`
      SELECT 
        l.id,
        l.name,
        c.city,
        c.state,
        c.monthly_bill_value AS "billValue"
      FROM leads l
      LEFT JOIN consumption c ON l.id = c.lead_id
      ORDER BY l.created_at DESC
    `);
    
    return NextResponse.json(leads.rows);
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    await db.query('DELETE FROM leads WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar lead:', error);
    return NextResponse.json({ error: 'Erro ao deletar lead' }, { status: 500 });
  }
} 