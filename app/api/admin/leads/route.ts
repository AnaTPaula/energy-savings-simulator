import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
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