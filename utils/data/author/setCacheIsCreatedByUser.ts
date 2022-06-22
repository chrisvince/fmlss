import { put } from 'memory-cache'
import constants from '../../../constants'
import { createPostAuthorCacheKey } from '../../createCacheKeys'

const { POST_AUTHOR_CACHE_TIME } = constants

type SetCacheIsCreatedByUser = (
  slug: string,
  uid: string,
) => void

const isServer = typeof window === 'undefined'

const setCacheIsCreatedByUser: SetCacheIsCreatedByUser = (slug, uid) => {
  if (!isServer) return
  const postAuthorCacheKey = createPostAuthorCacheKey(slug)
  put(postAuthorCacheKey, uid, POST_AUTHOR_CACHE_TIME)
}

export default setCacheIsCreatedByUser
