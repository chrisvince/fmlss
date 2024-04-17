import { pipe } from 'ramda'
import constants from '../../../constants'
import { FirebaseDoc } from '../../../types'
import mapPersonDocToData from '../../mapPersonDocToData'
import { Person } from '../../../types/Person'
import { PeopleSortMode } from '../../../types/PeopleSortMode'
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'
import { PersonDataRequest } from '../../../types/PersonDataRequest'

const { PEOPLE_CACHE_TIME, PEOPLE_COLLECTION, POST_PAGINATION_COUNT } =
  constants

const getPeople = async ({
  cacheKey: cacheKeyProp,
  cacheTime = PEOPLE_CACHE_TIME,
  limit: limitProp = POST_PAGINATION_COUNT,
  sortMode = PeopleSortMode.Popular,
  startAfter: startAfterProp,
}: {
  cacheKey?: string
  cacheTime?: number
  limit?: number
  sortMode?: PeopleSortMode
  startAfter?: FirebaseDoc
} = {}): Promise<Person[]> => {
  const db = getFirestore()

  const collectionRef = collection(db, PEOPLE_COLLECTION)

  const dbRef = pipe(
    ref =>
      sortMode === PeopleSortMode.Popular
        ? query(ref, orderBy('popularityScoreRecent', 'desc'))
        : ref,
    ref => query(ref, orderBy('createdAt', 'desc')),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(limitProp))
  )(collectionRef)

  const peopleDocs = await getDocs(dbRef)
  if (peopleDocs.empty) return []
  const peopleData = peopleDocs.docs.map(mapPersonDocToData)
  const people = peopleData.map(data => ({ data }))
  return people
}

export default getPeople
