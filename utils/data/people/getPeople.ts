import constants from '../../../constants'
import mapPersonDocToData from '../../mapPersonDocToData'
import { Person } from '../../../types/Person'
import { PeopleSortMode } from '../../../types/PeopleSortMode'
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

const { PEOPLE_COLLECTION, POST_PAGINATION_COUNT } = constants

const getPeople = async ({
  limit: limitProp = POST_PAGINATION_COUNT,
  sortMode = PeopleSortMode.Popular,
  startAfter: startAfterProp,
}: {
  limit?: number
  sortMode?: PeopleSortMode
  startAfter?: Person | null
} = {}): Promise<Person[]> => {
  const db = getFirestore()
  const isPopularSortMode = sortMode === PeopleSortMode.Popular

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

  const dbRef = query(collection(db, PEOPLE_COLLECTION), ...queryElements)
  const peopleDocs = await getDocs(dbRef)
  if (peopleDocs.empty) return []
  const peopleData = peopleDocs.docs.map(mapPersonDocToData)
  const people = peopleData.map(data => ({ data }))
  return people
}

export default getPeople
