import constants from '../../../constants'
import mapPersonDocToData from '../../mapPersonDocToData'
import { Person } from '../../../types/Person'
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore'

const { PEOPLE_COLLECTION } = constants

const getPerson = async (slug: string): Promise<Person | null> => {
  const db = getFirestore()

  const collectionRef = collection(db, PEOPLE_COLLECTION)
  const dbRef = query(collectionRef, where('slug', '==', slug), limit(1))
  const peopleRef = await getDocs(dbRef)

  if (peopleRef.empty) {
    return null
  }

  const doc = peopleRef.docs[0]
  const data = mapPersonDocToData(doc)
  return { data }
}

export default getPerson
