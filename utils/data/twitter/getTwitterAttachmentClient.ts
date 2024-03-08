import { PostAttachmentTwitter } from '../../../types'

const getTwitterAttachmentClient = async (url: string) => {
  const response = await fetch(
    `/api/twitter-attachment?url=${encodeURIComponent(url)}`
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data as PostAttachmentTwitter
}

export default getTwitterAttachmentClient
