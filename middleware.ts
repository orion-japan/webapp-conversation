// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // ✅ user クエリパラメータがあれば、Cookie に保存
    const user = request.nextUrl.searchParams.get('user')
    if (user) {
        response.cookies.set('user', user, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30日
        })
    }

    return response
}

// ✅ 適用するパス
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
