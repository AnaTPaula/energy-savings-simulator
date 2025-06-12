import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    await db.query('DELETE FROM leads WHERE id = $1', [id]);

    return NextResponse.json(
      { message: 'Lead excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir lead:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir lead' },
      { status: 500 }
    );
  }
} 