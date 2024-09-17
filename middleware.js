import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (token) {
    // Clone the request headers and add the user ID
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", token.sub)

    // Return the response with the modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

// Optional: Configure which routes use this middleware
export const config = {
  matcher: ['/api/:path*'],
}