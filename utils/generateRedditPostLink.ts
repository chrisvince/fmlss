import constants from '../constants'

const { BRAND_NAME } = constants

const generateRedditPostLink = (slug: string) => {
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/post/${slug}`
  const title = `Check out this post on ${BRAND_NAME}!`

  return `https://reddit.com/submit?url=${encodeURIComponent(
    link
  )}&title=${encodeURIComponent(title)}`
}

export default generateRedditPostLink
