import constants from '../../../constants'
import { TopicsSortMode, Topic } from '../../../types'
import mapTopicDocToData from '../../mapTopicDocToData'
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

const { TOPICS_COLLECTION, TOPICS_PAGINATION_COUNT } = constants

const getTopics = async ({
  limit: limitProp = TOPICS_PAGINATION_COUNT,
  parentTopicRef,
  sortMode = TopicsSortMode.Popular,
  startAfter: startAfterProp,
}: {
  limit?: number
  parentTopicRef?: string
  sortMode?: TopicsSortMode
  startAfter?: Topic | null
} = {}): Promise<Topic[]> => {
  const db = getFirestore()
  const isPopularSortMode = sortMode === TopicsSortMode.Popular

  const collectionPath = parentTopicRef
    ? `${parentTopicRef}/${TOPICS_COLLECTION}`
    : TOPICS_COLLECTION

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

  const dbRef = query(collection(db, collectionPath), ...queryElements)
  const topicDocs = await getDocs(dbRef)
  if (topicDocs.empty) return []
  const topicData = topicDocs.docs.map(doc => mapTopicDocToData(doc))
  const topics = topicData.map(data => ({ data }))
  return topics
}

export default getTopics
