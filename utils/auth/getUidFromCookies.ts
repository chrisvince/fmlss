import getAuthFromCookies from './getAuthFromCookies'

const getUidFromCookies = async (
  cookies: Partial<{
    [key: string]: string
  }>
): Promise<string | null> => {
  const auth = await getAuthFromCookies(cookies)
  return auth?.uid ?? null
}

export default getUidFromCookies
