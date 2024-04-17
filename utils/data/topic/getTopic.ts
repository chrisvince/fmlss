import constants from '../../../constants'
import { Topic } from '../../../types'
import mapTopicDocToData from '../../mapTopicDocToData'
import {
  collectionGroup,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore'

const { TOPICS_COLLECTION } = constants

const getTopic = async (path: string): Promise<Topic | null> => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, TOPICS_COLLECTION)
  const dbRef = query(collectionGroupRef, where('path', '==', path), limit(1))
  const topicsRef = await getDocs(dbRef)

  if (topicsRef.empty) {
    return null
  }

  const doc = topicsRef.docs[0]
  const data = mapTopicDocToData(doc)
  return { data }
}

export default getTopic
