import { pipe } from 'ramda'
import constants from '../../../constants'
import { TopicsSortMode, Topic, FirebaseDoc } from '../../../types'
import mapTopicDocToData from '../../mapTopicDocToData'
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'

const { TOPICS_COLLECTION, POST_PAGINATION_COUNT } = constants

const getTopics = async ({
  limit: limitProp = POST_PAGINATION_COUNT,
  parentTopicRef,
  sortMode = TopicsSortMode.Popular,
  startAfter: startAfterProp,
}: {
  limit?: number
  parentTopicRef?: string
  sortMode?: TopicsSortMode
  startAfter?: FirebaseDoc
} = {}): Promise<Topic[]> => {
  const db = getFirestore()

  const collectionPath = parentTopicRef
    ? `${parentTopicRef}/${TOPICS_COLLECTION}`
    : TOPICS_COLLECTION

  const collectionRef = collection(db, collectionPath)

  const dbRef = pipe(
    ref =>
      sortMode === TopicsSortMode.Popular
        ? query(ref, orderBy('popularityScoreRecent', 'desc'))
        : ref,
    ref => query(ref, orderBy('createdAt', 'desc')),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(limitProp))
  )(collectionRef)

  const topicDocs = await getDocs(dbRef)
  if (topicDocs.empty) return []
  const topicData = topicDocs.docs.map(doc => mapTopicDocToData(doc))
  const topics = topicData.map(data => ({ data }))
  return topics
}

export default getTopics
