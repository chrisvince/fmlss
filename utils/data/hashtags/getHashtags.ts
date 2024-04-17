import { pipe } from 'ramda'
import constants from '../../../constants'
import {
  FirebaseDoc,
  Hashtag,
  HashtagDataRequest,
  HashtagsSortMode,
} from '../../../types'
import mapHashtagDocToData from '../../mapHashtagDocToData'
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'

const { POST_PAGINATION_COUNT, HASHTAGS_COLLECTION } = constants

const getHashtags = async ({
  sortMode = HashtagsSortMode.Popular,
  limit: limitProp = POST_PAGINATION_COUNT,
  startAfter: startAfterProp,
}: {
  cacheKey?: string
  cacheTime?: number
  limit?: number
  sortMode?: HashtagsSortMode
  startAfter?: FirebaseDoc
} = {}): Promise<Hashtag[]> => {
  const db = getFirestore()
  const collectionRef = collection(db, HASHTAGS_COLLECTION)

  const dbRef = pipe(
    ref =>
      sortMode === HashtagsSortMode.Popular
        ? query(ref, orderBy('popularityScoreRecent', 'desc'))
        : ref,
    ref => query(ref, orderBy('createdAt', 'desc')),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(limitProp))
  )(collectionRef)

  const hashtagDocs = await getDocs(dbRef)
  if (hashtagDocs.empty) return []
  const hashtagData = hashtagDocs.docs.map(mapHashtagDocToData)
  const hashtags = hashtagData.map(data => ({ data }))
  return hashtags
}

export default getHashtags
