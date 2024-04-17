import constants from '../../../constants'
import {
  collectionGroup,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore'

const { WATCHERS_COLLECTION } = constants

const checkUserIsWatching = async (
  slug: string,
  uid: string
): Promise<boolean> => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, WATCHERS_COLLECTION)

  const dbRef = query(
    collectionGroupRef,
    where('uid', '==', uid),
    where('post.slug', '==', slug),
    limit(1)
  )

  const postWatchersRef = await getDocs(dbRef)
  return !postWatchersRef.empty
}

export default checkUserIsWatching
