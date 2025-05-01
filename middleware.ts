import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Comment out Supabase authentication temporarily for development
  // const supabase = createMiddlewareClient({ req, res })
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()
  
  // For development, just set session to true
  const session = true;

  // If we're on a protected route and not logged in, redirect to sign in
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/loop')
  )) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth/sign-in'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Commented out for development to allow landing page access
  // If we're on an auth route but we're already logged in, redirect to dashboard
  // if (session && (
  //   req.nextUrl.pathname.startsWith('/auth') ||
  //   req.nextUrl.pathname === '/'
  // )) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = '/dashboard'
  //   return NextResponse.redirect(redirectUrl)
  // }

  return res
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/loop/:path*', '/auth/:path*'],
} 