import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { Hashtag, HashtagData, HashtagsSortMode } from '../../../types'
import { createHashtagsCacheKeyServer } from '../../createCacheKeys'
import mapHashtagDocToData from '../../mapHashtagDocToData'
import isServer from '../../isServer'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { HASHTAGS_CACHE_TIME, HASHTAGS_COLLECTION, HASHTAGS_PAGINATION_COUNT } =
  constants

const getHashtagsServer = async ({
  sortMode = HashtagsSortMode.Popular,
  cacheKey = createHashtagsCacheKeyServer(sortMode),
  cacheTime = HASHTAGS_CACHE_TIME,
  limit = HASHTAGS_PAGINATION_COUNT,
}: {
  cacheKey?: string
  cacheTime?: number
  limit?: number
  sortMode?: HashtagsSortMode
} = {}): Promise<Hashtag[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let hashtagDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let hashtagData: HashtagData[] = []
  const cachedData = get(cacheKey)

  if (cachedData) {
    hashtagData = cachedData
    hashtagDocs = null
  } else {
    hashtagDocs = await pipe(
      () => db.collection(HASHTAGS_COLLECTION),
      query =>
        sortMode === HashtagsSortMode.Popular
          ? query.orderBy('popularityScoreRecent', 'desc')
          : query,
      query => query.orderBy('createdAt', 'desc'),
      query => query.limit(limit).get()
    )()

    if (hashtagDocs.empty) return []

    hashtagData = hashtagDocs.docs.map(doc => mapHashtagDocToData(doc))
    put(cacheKey, hashtagData, cacheTime)
  }

  const hashtags = hashtagData.map(data => ({ data }))

  return hashtags
}

export default getHashtagsServer
