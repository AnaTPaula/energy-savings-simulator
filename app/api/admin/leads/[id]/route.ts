import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Start a transaction
    await db.query('BEGIN');

    // Delete related consumption records first
    await db.query('DELETE FROM consumption WHERE lead_id = $1', [id]);

    // Then delete the lead
    await db.query('DELETE FROM leads WHERE id = $1', [id]);

    // Commit the transaction
    await db.query('COMMIT');

    return NextResponse.json(
      { message: 'Lead excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    // Rollback in case of error
    await db.query('ROLLBACK');
    console.error('Erro ao excluir lead:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir lead' },
      { status: 500 }
    );
  }
} 