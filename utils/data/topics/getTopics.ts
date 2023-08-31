import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { TopicsSortMode, Topic, TopicData, FirebaseDoc } from '../../../types'
import { createTopicsCacheKey } from '../../createCacheKeys'
import mapTopicDocToData from '../../mapTopicDocToData'
import isServer from '../../isServer'

const { TOPICS_CACHE_TIME, TOPICS_COLLECTION, PAGINATION_COUNT } = constants

type GetTopics = (options?: {
  cacheKey?: string
  cacheTime?: number
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  limit?: number
  sortMode?: TopicsSortMode
  startAfter?: FirebaseDoc
}) => Promise<Topic[]>

const getTopics: GetTopics = async ({
  sortMode = 'popular',
  cacheKey = createTopicsCacheKey(sortMode),
  cacheTime = TOPICS_CACHE_TIME,
  db: dbProp,
  limit = PAGINATION_COUNT,
  startAfter,
} = {}) => {
  const db = dbProp || firebase.firestore()

  let topicDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null

  let topicData: TopicData[] = []

  const cachedData = get(cacheKey)

  if (isServer && cachedData) {
    topicData = cachedData
    topicDocs = null
  } else {
    topicDocs = await pipe(
      () => db.collection(TOPICS_COLLECTION),
      query =>
        sortMode === 'popular'
          ? query.orderBy('recentViewCount', 'desc')
          : query,
      query => query.orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(limit).get()
    )()

    if (topicDocs.empty) return []

    topicData = topicDocs.docs.map(doc => mapTopicDocToData(doc))
    put(cacheKey, topicData, cacheTime)
  }

  const topics = topicData.map((data, index) => ({
    data,
    doc: !isServer ? topicDocs?.docs[index] ?? null : null,
  }))

  return topics
}

export default getTopics
