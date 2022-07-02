import { init } from 'next-firebase-auth'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const daysToMilliseconds = (days: number) => days * 60 * 60 * 24 * 1000

const initAuth = () => {
  init({
    authPageURL: '/',
    appPageURL: '/feed',
    loginAPIEndpoint: '/api/auth/signIn',
    logoutAPIEndpoint: '/api/auth/signOut',
    onLoginRequestError: (err) => {
      console.error(err)
    },
    onLogoutRequestError: (err) => {
      console.error(err)
    },
    firebaseAuthEmulatorHost:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST,
    firebaseAdminInitConfig: {
      // @ts-ignore
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      credential: {
        projectId: <string>process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: <string>process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: <string>
          process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
    onVerifyTokenError: (err) => {
      console.error(err)
    },
    onTokenRefreshError: (err) => {
      console.error(err)
    },
  })
}

export default initAuth
