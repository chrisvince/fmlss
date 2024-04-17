import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { FirebaseDoc } from '../../../types'
import { createPeopleCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import mapPersonDocToData from '../../mapPersonDocToData'
import { PersonData } from '../../../types/PersonData'
import { Person } from '../../../types/Person'
import { PeopleSortMode } from '../../../types/PeopleSortMode'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { PEOPLE_CACHE_TIME, PEOPLE_COLLECTION, POST_PAGINATION_COUNT } =
  constants

const getPeopleServer = async ({
  cacheKey: cacheKeyProp,
  cacheTime = PEOPLE_CACHE_TIME,
  limit = POST_PAGINATION_COUNT,
  sortMode = PeopleSortMode.Popular,
  startAfter,
}: {
  cacheKey?: string
  cacheTime?: number
  limit?: number
  sortMode?: PeopleSortMode
  startAfter?: FirebaseDoc
} = {}): Promise<Person[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()

  let peopleDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let peopleData: PersonData[] = []
  const cacheKey = cacheKeyProp ?? createPeopleCacheKey({ sortMode })
  const cachedData = get(cacheKey)

  if (cachedData) {
    peopleData = cachedData
    peopleDocs = null
  } else {
    peopleDocs = await pipe(
      () => db.collection(PEOPLE_COLLECTION),
      query =>
        sortMode === PeopleSortMode.Popular
          ? query.orderBy('popularityScoreRecent', 'desc')
          : query,
      query => query.orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(limit).get()
    )()

    if (peopleDocs.empty) return []
    peopleData = peopleDocs.docs.map(doc => mapPersonDocToData(doc))
    put(cacheKey, peopleData, cacheTime)
  }

  const people = peopleData.map(data => ({ data }))
  return people
}

export default getPeopleServer
