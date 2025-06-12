import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_aqui';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Buscar usuário no banco de dados
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 