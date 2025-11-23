import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Force build.nym.fun to show /builder
  if (host.toLowerCase() === 'build.nym.fun') {
    if (!url.pathname.startsWith('/builder')) {
      url.pathname = '/builder'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      Apply the middleware on all routes so build.nym.fun is always rewritten.
      You can add exclusions like:
      '/((?!api|_next/static|_next/image|favicon.ico).*)'
    */
    '/:path*',
  ],
}

