import { getTokensFromObject } from 'next-firebase-auth-edge'

const getUidFromCookies = async (
  cookies: Partial<{
    [key: string]: string
  }>
): Promise<string | null> => {
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

  return tokens?.decodedToken?.uid ?? null
}

export default getUidFromCookies
