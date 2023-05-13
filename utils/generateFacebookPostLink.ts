import constants from '../constants'

const { APP_URL } = constants
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID

const generateFacebookPostLink = (slug: string) => {
  const baseUrl = process.env.VERCEL_URL || APP_URL
  const link = `${baseUrl}/post/${slug}`
  return `https://www.facebook.com/dialog/feed?app_id=${FACEBOOK_APP_ID}&display=page&link=${encodeURIComponent(
    link
  )}`
}

export default generateFacebookPostLink
