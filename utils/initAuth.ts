import absoluteUrl from 'next-absolute-url'
import { init } from 'next-firebase-auth'

const AUTH_DESTINATION_QUERY_PARAM = 'destination'
const AUTH_DEFAULT_DESTINATION = '/feed'

const daysToMilliseconds = (days: number) => days * 60 * 60 * 24 * 1000

const initAuth = () => {
  init({
    authPageURL: ({ ctx }) => {
      const isServerSide = typeof window === 'undefined'

      const destPath = isServerSide
        ? ctx.resolvedUrl
        : window.location.href.split(window.location.origin)[1]

      return `/?${AUTH_DESTINATION_QUERY_PARAM}=${encodeURIComponent(destPath)}`
    },

    appPageURL: ({ ctx }) => {
      const isServerSide = typeof window === 'undefined'

      const origin = isServerSide
        ? absoluteUrl(ctx.req).origin
        : window.location.origin

      const params = isServerSide
        ? // @ts-expect-error: url is defined on server
          new URL(ctx.req.url, origin).searchParams
        : new URLSearchParams(window.location.search)

      const destinationParamVal = params.get(AUTH_DESTINATION_QUERY_PARAM)

      if (!destinationParamVal) {
        return AUTH_DEFAULT_DESTINATION
      }

      const redirectURL = `${origin}${decodeURIComponent(destinationParamVal)}`
      return redirectURL
    },
    loginAPIEndpoint: '/api/auth/signIn',
    logoutAPIEndpoint: '/api/auth/signOut',
    onLoginRequestError: err => {
      console.error(err)
    },
    onLogoutRequestError: err => {
      console.error(err)
    },
    firebaseAuthEmulatorHost: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR
      ? '127.0.0.1:9099'
      : undefined,
    firebaseAdminInitConfig: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      credential: {
        projectId: <string>process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: <string>process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
          ? JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
          : undefined,
      },
      databaseURL: <string>process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    },
    firebaseClientInitConfig: {
      apiKey: <string>process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: 'Fameless',
      keys: [
        process.env.AUTH_COOKIE_SECRET_CURRENT,
        process.env.AUTH_COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: daysToMilliseconds(12),
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: true,
      signed: true,
    },
    onVerifyTokenError: err => {
      console.error(err)
    },
    onTokenRefreshError: err => {
      console.error(err)
    },
  })
}

export default initAuth
