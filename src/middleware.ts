import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const url = new URL(request.url);

    const protectedRoutes = ['/profile', '/logout', '/checkout'];
    const loginRoutes = ['/login', '/register'];

    if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyToken`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `accessToken=${token}`,
            },
        });

        const { valid } = await res.json();

        if (valid) {
            // Jika sudah login
            if (loginRoutes.includes(url.pathname)) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } else {
        // Jika belum login
        if (protectedRoutes.includes(url.pathname)) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/profile/:path*', '/checkout/:path*', '/logout', '/login', '/register'],
};
