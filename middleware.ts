import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add basic error handling
  try {
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    )
  }
}

export const config = {
  matcher: '/:path*',
}