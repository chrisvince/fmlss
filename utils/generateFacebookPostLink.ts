const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID

const generateFacebookPostLink = (slug: string) => {
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/post/${slug}`
  return `https://www.facebook.com/dialog/feed?app_id=${FACEBOOK_APP_ID}&display=page&link=${encodeURIComponent(
    link
  )}`
}

export default generateFacebookPostLink
