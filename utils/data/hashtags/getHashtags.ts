import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  FirebaseDoc,
  Hashtag,
  HashtagData,
  HashtagsSortMode,
} from '../../../types'
import { createHashtagsCacheKey } from '../../createCacheKeys'
import mapHashtagDocToData from '../../mapHashtagDocToData'
import isServer from '../../isServer'

const { HASHTAGS_CACHE_TIME, PAGINATION_COUNT, HASHTAGS_COLLECTION } = constants

type GetHashtags = (options?: {
  cacheKey?: string
  cacheTime?: number
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  limit?: number
  sortMode?: HashtagsSortMode
  startAfter?: FirebaseDoc
}) => Promise<Hashtag[]>

const getHashtags: GetHashtags = async ({
  sortMode = 'popular',
  cacheKey = createHashtagsCacheKey(sortMode),
  cacheTime = HASHTAGS_CACHE_TIME,
  db: dbProp,
  limit = PAGINATION_COUNT,
  startAfter,
} = {}) => {
  const db = dbProp || firebase.firestore()

  let hashtagDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let hashtagData: HashtagData[] = []

  const cachedData = get(cacheKey)

  if (isServer && cachedData) {
    hashtagData = cachedData
    hashtagDocs = null
  } else {
    hashtagDocs = await pipe(
      () => db.collection(HASHTAGS_COLLECTION),
      query =>
        sortMode === 'popular'
          ? query.orderBy('recentViewCount', 'desc')
          : query,
      query => query.orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(limit).get()
    )()

    if (hashtagDocs.empty) return []

    hashtagData = hashtagDocs.docs.map(doc => mapHashtagDocToData(doc))
    put(cacheKey, hashtagData, cacheTime)
  }

  const hashtags = hashtagData.map((data, index) => ({
    data,
    doc: !isServer ? hashtagDocs?.docs[index] ?? null : null,
  }))

  return hashtags
}

export default getHashtags
