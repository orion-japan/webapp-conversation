// pages/_app.tsx

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    useEffect(() => {
        const userFromURL = router.query.user as string
        if (userFromURL) {
            // ✅ Cookie に保存（ブラウザ側でも）
            document.cookie = `user=${userFromURL}; path=/; max-age=${60 * 60 * 24 * 30}`
        }
    }, [router.query])

    return <Component {...pageProps} />
}
