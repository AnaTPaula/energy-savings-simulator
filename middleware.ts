import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_aqui';

export async function middleware(request: NextRequest) {
  // Verificar se a rota é administrativa
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Ignorar a rota de login
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
      console.log('Token não encontrado nos cookies');
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    try {
      // Verificar o token
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );

      // Verificar se o token expirou
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token expirado:', {
          exp: payload.exp,
          currentTime,
          difference: payload.exp - currentTime,
          url: request.url
        });
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('token');
        return response;
      }

      // Token válido
      console.log('Token válido, permitindo acesso');
      return NextResponse.next();
    } catch (error) {
      // Token inválido ou expirado
      console.error('Erro ao verificar token:', error);
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 