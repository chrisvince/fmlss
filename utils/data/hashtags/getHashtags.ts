import constants from '../../../constants'
import { Hashtag, HashtagsSortMode } from '../../../types'
import mapHashtagDocToData from '../../mapHashtagDocToData'
import {
  QueryConstraint,
  Timestamp,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'

const { HASHTAGS_PAGINATION_COUNT, HASHTAGS_COLLECTION } = constants

const getHashtags = async ({
  sortMode = HashtagsSortMode.Popular,
  limit: limitProp = HASHTAGS_PAGINATION_COUNT,
  startAfter: startAfterProp,
}: {
  cacheKey?: string
  cacheTime?: number
  limit?: number
  sortMode?: HashtagsSortMode
  startAfter?: Hashtag
} = {}): Promise<Hashtag[]> => {
  const db = getFirestore()
  const isPopularSortMode = sortMode === HashtagsSortMode.Popular

  const startAfterValue = startAfterProp
    ? [
        isPopularSortMode && startAfterProp.data.popularityScoreRecent,
        Timestamp.fromMillis(startAfterProp.data.createdAt),
      ].filter(value => value !== false)
    : null

  const queryElements = [
    isPopularSortMode && orderBy('popularityScoreRecent', 'desc'),
    orderBy('createdAt', 'desc'),
    startAfterValue && startAfter(...startAfterValue),
    limit(limitProp),
  ].filter(Boolean) as QueryConstraint[]

  const dbRef = query(collection(db, HASHTAGS_COLLECTION), ...queryElements)
  const hashtagDocs = await getDocs(dbRef)
  if (hashtagDocs.empty) return []
  const hashtagData = hashtagDocs.docs.map(mapHashtagDocToData)
  const hashtags = hashtagData.map(data => ({ data }))
  return hashtags
}

export default getHashtags
