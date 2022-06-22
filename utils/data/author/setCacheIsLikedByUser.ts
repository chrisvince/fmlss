import { put } from 'memory-cache'
import constants from '../../../constants'
import { createPostLikeCacheKey } from '../../createCacheKeys'

const { POST_LIKES_CACHE_TIME } = constants

type SetCacheIsCreatedByUser = (
  slug: string,
  uid: string,
) => void

const isServer = typeof window === 'undefined'

const setCacheIsLikedByUser: SetCacheIsCreatedByUser = (slug, uid) => {
  if (!isServer) return
  const postLikesCacheKey = createPostLikeCacheKey(slug, uid)
  put(postLikesCacheKey, true, POST_LIKES_CACHE_TIME)
}

export default setCacheIsLikedByUser
