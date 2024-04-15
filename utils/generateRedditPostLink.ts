import constants from '../constants'

const { APP_URL, BRAND_NAME } = constants

const generateRedditPostLink = (slug: string) => {
  const baseUrl = process.env.VERCEL_URL || APP_URL
  const link = `${baseUrl}/post/${slug}`
  const title = `Check out this post on ${BRAND_NAME}!`

  return `https://reddit.com/submit?url=${encodeURIComponent(
    link
  )}&title=${encodeURIComponent(title)}`
}

export default generateRedditPostLink
