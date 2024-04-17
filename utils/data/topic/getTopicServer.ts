import { get, put } from '../../serverCache'
import constants from '../../../constants'
import { Topic, TopicData } from '../../../types'
import { createTopicCacheKey } from '../../createCacheKeys'
import mapTopicDocToData from '../../mapTopicDocToData'
import isServer from '../../isServer'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { TOPICS_COLLECTION, TOPIC_CACHE_TIME } = constants

const getTopicServer = async (path: string): Promise<Topic | null> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData> | null
  let data: TopicData
  const topicCacheKey = createTopicCacheKey(path)
  const cachedData = get(topicCacheKey)

  if (cachedData) {
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

  return { data }
}

export default getTopicServer
