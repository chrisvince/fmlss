import { Tokens, getTokensFromObject } from 'next-firebase-auth-edge'
import { Auth } from '../../types/Auth'

const mapTokensToAuth = (tokens: Tokens | null): Auth => ({
  displayName: null,
  email: tokens?.decodedToken.email ?? null,
  emailVerified: tokens?.decodedToken.email_verified ?? null,
  uid: tokens?.decodedToken.uid ?? null,
})

const getAuthFromCookies = async (
  cookies: Partial<{
    [key: string]: string
  }>
): Promise<Auth> => {
  if (!cookies) {
    return mapTokensToAuth(null)
  }

  const tokens = await getTokensFromObject(cookies, {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
    cookieName: 'AuthToken',
    cookieSignatureKeys: [
      process.env.AUTH_COOKIE_SECRET_CURRENT as string,
      process.env.AUTH_COOKIE_SECRET_PREVIOUS as string,
    ],
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
        : undefined,
    },
  })

  return mapTokensToAuth(tokens)
}

export default getAuthFromCookies
