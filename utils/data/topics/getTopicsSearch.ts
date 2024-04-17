import { Topic } from '../../../types'
import constants from '../../../constants'
import mapTopicDocToData from '../../mapTopicDocToData'
import {
  collectionGroup,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore'

const { AUTOCOMPLETE_LENGTH, TOPICS_COLLECTION } = constants

const getTopicsSearch = async (searchString: string): Promise<Topic[]> => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, TOPICS_COLLECTION)

  const dbRef = query(
    collectionGroupRef,
    where('searchString', '>=', searchString),
    where('searchString', '<=', searchString + '\uf8ff'),
    limit(AUTOCOMPLETE_LENGTH)
  )

  const docsRef = await getDocs(dbRef)
  if (docsRef.empty) return []
  const topicData = docsRef.docs.map(doc => mapTopicDocToData(doc))
  const topics = topicData.map((data, index) => ({ data }))
  return topics
}

export default getTopicsSearch
