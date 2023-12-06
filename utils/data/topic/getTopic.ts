import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import constants from '../../../constants'
import { Topic, TopicData } from '../../../types'
import { createTopicCacheKey } from '../../createCacheKeys'
import mapTopicDocToData from '../../mapTopicDocToData'
import isServer from '../../isServer'

const { TOPICS_COLLECTION, TOPIC_CACHE_TIME } = constants

type GetTopic = (
  slug: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    uid?: string | null
  }
) => Promise<Topic | null>

const getTopic: GetTopic = async (path, { db: dbProp } = {}) => {
  const db = dbProp || firebase.firestore()

  let doc:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | null
  let data: TopicData

  const topicCacheKey = createTopicCacheKey(path)
  const cachedData = get(topicCacheKey)

  if (isServer && cachedData) {
    data = cachedData
    doc = null
  } else {
    const topicsRef = await db
      .collectionGroup(TOPICS_COLLECTION)
      .where('path', '==', path)
      .limit(1)
      .get()

    if (topicsRef.empty) {
      return null
    }

    doc = topicsRef.docs[0]
    data = mapTopicDocToData(doc)
    put(topicCacheKey, data, TOPIC_CACHE_TIME)
  }

  return {
    data,
    doc: !isServer ? doc : null,
  }
}

export default getTopic
