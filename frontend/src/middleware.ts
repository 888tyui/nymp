import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const shouldBypassRewrite = (pathname: string) => {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  )
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() || ''
  const url = request.nextUrl.clone()

  if (host === 'build.nym.fun') {
    if (!url.pathname.startsWith('/builder') && !shouldBypassRewrite(url.pathname)) {
      url.pathname = '/builder'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|assets).*)',
  ],
}


