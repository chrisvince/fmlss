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

type GetHashtags = (
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    startAfter?: FirebaseDoc
    sortMode?: HashtagsSortMode
  }
) => Promise<Hashtag[]>

const getHashtags: GetHashtags = async (
  {
    db: dbProp,
    startAfter,
    sortMode = 'popular'
  } = {},
) => {
  const db = dbProp || firebase.firestore()

  let hashtagDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let hashtagData: HashtagData[] = []

  const hashtagsCacheKey = createHashtagsCacheKey(sortMode)
  const cachedData = get(hashtagsCacheKey)
  
  if (isServer && cachedData) {
    hashtagData = cachedData
    hashtagDocs = null
  } else {
    hashtagDocs = await pipe(
      () => db.collection(HASHTAGS_COLLECTION),
      query =>
        sortMode === 'popular' ? query.orderBy('viewCount', 'desc') : query,
      query => query.orderBy('createdAt', 'desc'),
      query => startAfter ? query.startAfter(startAfter) : query,
      query => query.limit(PAGINATION_COUNT).get(),
    )()

    if (hashtagDocs.empty) return []

    hashtagData = hashtagDocs.docs.map(doc => mapHashtagDocToData(doc))
    put(hashtagsCacheKey, hashtagData, HASHTAGS_CACHE_TIME)
  }

  const hashtags = hashtagData.map((data, index) => ({
    data,
    doc: !isServer ? (hashtagDocs?.docs[index] ?? null) : null,
  }))

  return hashtags
}

export default getHashtags
