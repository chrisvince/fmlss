import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { FirebaseDoc } from '../../../types'
import { createPeopleCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import mapPersonDocToData from '../../mapPersonDocToData'
import { PersonData } from '../../../types/PersonData'
import { Person } from '../../../types/Person'

const { PEOPLE_CACHE_TIME, PEOPLE_COLLECTION, POST_PAGINATION_COUNT } =
  constants

type GetPeople = (options?: {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  startAfter?: FirebaseDoc
}) => Promise<Person[]>

const getPeople: GetPeople = async ({ db: dbProp, startAfter } = {}) => {
  const db = dbProp || firebase.firestore()

  let peopleDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null

  let peopleData: PersonData[] = []

  const cacheKey = createPeopleCacheKey()
  const cachedData = get(cacheKey)

  if (isServer && cachedData) {
    peopleData = cachedData
    peopleDocs = null
  } else {
    peopleDocs = await pipe(
      () => db.collection(PEOPLE_COLLECTION),
      query => query.orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(POST_PAGINATION_COUNT).get()
    )()

    if (peopleDocs.empty) return []

    peopleData = peopleDocs.docs.map(doc => mapPersonDocToData(doc))
    put(cacheKey, peopleData, PEOPLE_CACHE_TIME)
  }

  const people = peopleData.map((data, index) => ({
    data,
    doc: !isServer ? peopleDocs?.docs[index] ?? null : null,
  }))

  return people
}

export default getPeople
