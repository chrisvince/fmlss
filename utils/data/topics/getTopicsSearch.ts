import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from '../../serverCache'

import { TopicData } from '../../../types'
import { createTopicsStartsWithCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import isServer from '../../isServer'
import mapTopicDocToData from '../../mapTopicDocToData'

const { AUTOCOMPLETE_LENGTH, TOPICS_COLLECTION, TOPIC_STARTS_WITH_CACHE_TIME } =
  constants

interface Options {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
}

const getTopicsSearch = async (
  searchString: string,
  { db: dbProp }: Options = {}
) => {
  const db = dbProp || firebase.firestore()
  const cacheKey = createTopicsStartsWithCacheKey(searchString)

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
    topicDocs = await db
      .collectionGroup(TOPICS_COLLECTION)
      .where('searchString', '>=', searchString)
      .where('searchString', '<=', searchString + '\uf8ff')
      .limit(AUTOCOMPLETE_LENGTH)
      .get()

    if (topicDocs.empty) return []

    topicData = topicDocs.docs.map(doc => mapTopicDocToData(doc))
    put(cacheKey, topicData, TOPIC_STARTS_WITH_CACHE_TIME)
  }

  const topics = topicData.map((data, index) => ({
    data,
    doc: !isServer ? topicDocs?.docs[index] ?? null : null,
  }))

  return topics
}

export default getTopicsSearch
