// will return url if valid, undefined if not
const validateUrl = (url: string | undefined): string | undefined => {
  if (!url) {
    return undefined
  }

  try {
    const { href } = new URL(url)
    return href
  } catch (error) {
    return undefined
  }
}

export default validateUrl
