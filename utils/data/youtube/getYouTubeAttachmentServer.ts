import constants from '../../../constants'
import { createYouTubeAttachmentCacheKey } from '../../createCacheKeys'
import { get, put } from '../../serverCache'
import mapYouTubeOembedToAttachment from './mapYouTubeOembedToAttachment'

const { YOUTUBE_ATTACHMENT_CACHE_TIME } = constants

const getYouTubeAttachmentServer = async (url: string) => {
  const cacheKey = createYouTubeAttachmentCacheKey(url)
  const cachedData = get(cacheKey)

  if (cachedData) {
    return cachedData
  }

  const response = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}`
  )
  const json = await response.json()
  const data = mapYouTubeOembedToAttachment(json, url)
  put(cacheKey, data, YOUTUBE_ATTACHMENT_CACHE_TIME)
  return data
}

export default getYouTubeAttachmentServer
