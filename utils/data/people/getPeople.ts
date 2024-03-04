import firebase from 'firebase/app'
import 'firebase/firestore'
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

const { PEOPLE_CACHE_TIME, PEOPLE_COLLECTION, POST_PAGINATION_COUNT } =
  constants

type GetPeople = (options?: {
  cacheKey?: string
  cacheTime?: number
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  limit?: number
  sortMode?: PeopleSortMode
  startAfter?: FirebaseDoc
}) => Promise<Person[]>

const getPeople: GetPeople = async ({
  cacheKey: cacheKeyProp,
  cacheTime = PEOPLE_CACHE_TIME,
  db: dbProp,
  limit = POST_PAGINATION_COUNT,
  sortMode = PeopleSortMode.Popular,
  startAfter,
} = {}) => {
  const db = dbProp || firebase.firestore()

  let peopleDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null

  let peopleData: PersonData[] = []

  const cacheKey = cacheKeyProp ?? createPeopleCacheKey({ sortMode })
  const serverCachedData = get(cacheKey)

  if (serverCachedData) {
    peopleData = serverCachedData
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

  const people = peopleData.map((data, index) => ({
    data,
    doc: !isServer ? peopleDocs?.docs[index] ?? null : null,
  }))

  return people
}

export default getPeople
