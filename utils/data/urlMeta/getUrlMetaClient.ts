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
  const response = await fetch(`/api/url-meta?url=${url}`)

  if (!response.ok) {
    throw new Error((await response.json()).error)
  }

  const data = (await response.json()) as PostAttachmentUrl
  return data
}

export default getUrlMetaClient
