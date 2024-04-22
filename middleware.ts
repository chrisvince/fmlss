import { NextRequest, NextResponse } from 'next/server'
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from 'next-firebase-auth-edge'
import constants from './constants'

const { AUTH_API_LOGIN_PATH, AUTH_API_LOGOUT_PATH } = constants
const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/forgot-password']
const PUBLIC_AND_PRIVATE_PATHS = ['/people', '/topics', '/hashtags']

const PUBLIC_AND_PRIVATE_DYNAMIC_PATHS = [
  '/confirm-email/[A-Za-z0-9]+$',
  '/hashtag/[A-Za-z0-9]+$',
  '/people/[A-Za-z0-9]+$',
  '/post/[A-Za-z0-9]+$',
  '/reset-password/[A-Za-z0-9]+$',
  '/topic/[A-Za-z0-9]+$',
]

const allStaticPublicPaths = [...PUBLIC_PATHS, ...PUBLIC_AND_PRIVATE_PATHS]

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const isPublicDynamicPath = PUBLIC_AND_PRIVATE_DYNAMIC_PATHS.some(path =>
    new RegExp(path).test(pathname)
  )

  const publicPaths = isPublicDynamicPath
    ? [...allStaticPublicPaths, pathname]
    : allStaticPublicPaths

  return authMiddleware(request, {
    loginPath: AUTH_API_LOGIN_PATH,
    logoutPath: AUTH_API_LOGOUT_PATH,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
    cookieName: 'AuthToken',
    cookieSignatureKeys: [
      process.env.AUTH_COOKIE_SECRET_CURRENT as string,
      process.env.AUTH_COOKIE_SECRET_PREVIOUS as string,
    ],
    cookieSerializeOptions: {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
      maxAge: 14 * 60 * 60 * 24,
    },
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
        : undefined,
    },
    debug: false,
    checkRevoked: true,
    handleValidToken: async (_, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request)
      }

      return NextResponse.next({
        request: {
          headers,
        },
      })
    },
    handleInvalidToken: async () => {
      return redirectToLogin(request, {
        path: '/sign-in',
        publicPaths,
      })
    },
    handleError: async () => {
      return redirectToLogin(request, {
        path: '/sign-in',
        publicPaths,
      })
    },
  })
}

export const config = {
  matcher: [
    '/api/sign-in',
    '/api/sign-out',
    '/',
    '/((?!_next|favicon.ico|api|.*\\.).*)',
  ],
}
