import constants from '../constants'

const { APP_URL } = constants

const generateTweetPostLink = (slug: string) => {
  const baseUrl = process.env.VERCEL_URL || APP_URL
  const text = `Check out this post on Fameless!

${baseUrl}/post/${slug}`

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export default generateTweetPostLink
