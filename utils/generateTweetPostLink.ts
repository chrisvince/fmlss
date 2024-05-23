const generateTweetPostLink = (slug: string) => {
  const text = `Check out this post on Fameless!

${process.env.NEXT_PUBLIC_APP_URL}/post/${slug}`

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export default generateTweetPostLink
