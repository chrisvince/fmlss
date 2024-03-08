import constants from '../../../constants'
import { createTwitterAttachmentCacheKey } from '../../createCacheKeys'
import { get, put } from '../../serverCache'
import mapTwitterOembedToAttachment from './mapTwitterOembedToAttachment'

const { TWITTER_ATTACHMENT_CACHE_TIME } = constants

const getTwitterAttachmentServer = async (url: string) => {
  const cacheKey = createTwitterAttachmentCacheKey(url)
  const cachedData = get(cacheKey)

  if (cachedData) {
    return cachedData
  }

  const response = await fetch(
    `https://publish.twitter.com/oembed?url=${encodeURIComponent(
      url
    )}&omit_script=1`
  )
  const json = await response.json()
  const data = mapTwitterOembedToAttachment(json)
  put(cacheKey, data, TWITTER_ATTACHMENT_CACHE_TIME)
  return data
}

export default getTwitterAttachmentServer
