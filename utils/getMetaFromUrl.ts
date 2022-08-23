export type UrlMeta = {
  description?: string
  icon?: string | undefined
  image?: string | undefined
  siteName?: string
  title: string
  url: string
}

const getMetaFromUrl = async (url: string) => {
  if (!url) return undefined
  try {
    const response = await fetch(`/api/url-meta?url=${url}`)
    const meta = (await response.json()) as UrlMeta
    return meta
  } catch (error) {
    console.error(error) 
  }
}

export default getMetaFromUrl
