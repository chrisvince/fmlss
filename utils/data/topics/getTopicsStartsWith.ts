import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import { TopicData } from '../../../types'
import { createTopicsStartsWithCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import isServer from '../../isServer'
import mapTopicDocToData from '../../mapTopicDocToData'
import slugify from '../../slugify'
import unslugify from '../../unslugify'

const { AUTOCOMPLETE_LENGTH, TOPICS_COLLECTION, TOPIC_STARTS_WITH_CACHE_TIME } =
  constants

interface Options {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
}

const getTopicsStartsWith = async (
  searchString: string,
  { db: dbProp }: Options = {}
) => {
  const db = dbProp || firebase.firestore()
  const searchStringSlug = slugify(searchString)
  const searchStringQuery = unslugify(searchStringSlug)
  const cacheKey = createTopicsStartsWithCacheKey(searchStringSlug)

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
    topicDocs = await db
      .collection(TOPICS_COLLECTION)
      .where('name', '>=', searchStringQuery)
      .where('name', '<=', searchStringQuery + '\uf8ff')
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

export default getTopicsStartsWith
