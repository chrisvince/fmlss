import { Image, PostAttachmentUrl } from '../../../types'

export interface UrlMeta {
  description: string
  image: Image | undefined
  siteName: string
  title: string
  type: string
  url: string
}

const getUrlMetaClient = async (url: string) => {
  const response = await fetch(`/api/url-meta?url=${encodeURIComponent(url)}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data as PostAttachmentUrl
}

export default getUrlMetaClient
