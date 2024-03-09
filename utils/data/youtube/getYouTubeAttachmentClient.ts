import { PostAttachmentYouTube } from '../../../types'

const getYouTubeAttachmentClient = async (url: string) => {
  const response = await fetch(
    `/api/youtube-attachment?url=${encodeURIComponent(url)}`
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data as PostAttachmentYouTube
}

export default getYouTubeAttachmentClient
