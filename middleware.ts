import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
}

export async function middleware(request: NextRequest) {
  // Check if the route is administrative
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Ignore the login route
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
      // Verify the token
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );

      // Check if the token has expired
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

      // Valid token
      console.log('Token válido, permitindo acesso');
      return NextResponse.next();
    } catch (error) {
      // Invalid or expired token
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