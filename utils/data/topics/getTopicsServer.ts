import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { TopicsSortMode, Topic, TopicData, FirebaseDoc } from '../../../types'
import { createTopicsCacheKey } from '../../createCacheKeys'
import mapTopicDocToData from '../../mapTopicDocToData'
import isServer from '../../isServer'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { TOPICS_CACHE_TIME, TOPICS_COLLECTION, POST_PAGINATION_COUNT } =
  constants

const getTopicsServer = async ({
  cacheTime = TOPICS_CACHE_TIME,
  limit = POST_PAGINATION_COUNT,
  parentTopicRef,
  sortMode = TopicsSortMode.Popular,
  cacheKey = createTopicsCacheKey({ sortMode, parentTopicRef, limit }),
  startAfter,
}: {
  cacheKey?: string
  cacheTime?: number
  limit?: number
  parentTopicRef?: string
  sortMode?: TopicsSortMode
  startAfter?: FirebaseDoc
} = {}): Promise<Topic[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()

  let topicDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let topicData: TopicData[] = []
  const cachedData = get(cacheKey)

  const collectionPath = parentTopicRef
    ? `${parentTopicRef}/${TOPICS_COLLECTION}`
    : TOPICS_COLLECTION

  if (cachedData) {
    topicData = cachedData
    topicDocs = null
  } else {
    topicDocs = await pipe(
      () => db.collection(collectionPath),
      query =>
        sortMode === TopicsSortMode.Popular
          ? query.orderBy('popularityScoreRecent', 'desc')
          : query,
      query => query.orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(limit).get()
    )()

    if (topicDocs.empty) return []
    topicData = topicDocs.docs.map(doc => mapTopicDocToData(doc))
    put(cacheKey, topicData, cacheTime)
  }

  const topics = topicData.map(data => ({ data }))
  return topics
}

export default getTopicsServer
