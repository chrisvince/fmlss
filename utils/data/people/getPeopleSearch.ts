import constants from '../../../constants'
import mapPersonDocToData from '../../mapPersonDocToData'
import slugify from '../../slugify'
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore'
import { Person } from '../../../types'

const { AUTOCOMPLETE_LENGTH, PEOPLE_COLLECTION } = constants

const getPeopleSearch = async (searchString: string): Promise<Person[]> => {
  const db = getFirestore()
  const slug = slugify(searchString)
  const collectionRef = collection(db, PEOPLE_COLLECTION)

  const dbRef = query(
    collectionRef,
    where('slug', '>=', slug),
    where('slug', '<=', slug + '\uf8ff'),
    limit(AUTOCOMPLETE_LENGTH)
  )

  const personDocs = await getDocs(dbRef)
  if (personDocs.empty) return []
  const personData = personDocs.docs.map(mapPersonDocToData)
  const people = personData.map(data => ({ data }))
  return people
}

export default getPeopleSearch
