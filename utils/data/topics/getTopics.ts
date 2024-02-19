import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { TopicsSortMode, Topic, TopicData, FirebaseDoc } from '../../../types'
import { createTopicsCacheKey } from '../../createCacheKeys'
import mapTopicDocToData from '../../mapTopicDocToData'
import isServer from '../../isServer'

const { TOPICS_CACHE_TIME, TOPICS_COLLECTION, POST_PAGINATION_COUNT } =
  constants

type GetTopics = (options?: {
  cacheKey?: string
  cacheTime?: number
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  limit?: number
  parentTopicRef?: string
  sortMode?: TopicsSortMode
  startAfter?: FirebaseDoc
}) => Promise<Topic[]>

const getTopics: GetTopics = async ({
  cacheTime = TOPICS_CACHE_TIME,
  db: dbProp,
  limit = POST_PAGINATION_COUNT,
  parentTopicRef,
  sortMode = TopicsSortMode.Popular,
  cacheKey = createTopicsCacheKey({ sortMode, parentTopicRef, limit }),
  startAfter,
} = {}) => {
  const db = dbProp || firebase.firestore()

  let topicDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null

  let topicData: TopicData[] = []

  const serverCachedData = get(cacheKey)

  if (serverCachedData) {
    topicData = serverCachedData
    topicDocs = null
  } else {
    topicDocs = await pipe(
      () =>
        db.collection(
          parentTopicRef
            ? `${parentTopicRef}/${TOPICS_COLLECTION}`
            : TOPICS_COLLECTION
        ),
      query =>
        sortMode === TopicsSortMode.Popular
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
