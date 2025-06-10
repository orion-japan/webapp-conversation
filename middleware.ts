import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const uid = request.nextUrl.searchParams.get('uid');

    if (uid) {
        const redirectUrl = new URL(request.url);
        redirectUrl.searchParams.delete('uid');

        const response = NextResponse.redirect(redirectUrl);

        response.cookies.set('dify_user_id', uid, {
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
        });

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/chat', '/(.*)'],
};