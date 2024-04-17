import constants from '../../../constants'
import {
  collectionGroup,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore'

const { AUTHORS_COLLECTION } = constants

const checkIsCreatedByUser = async (
  slug: string,
  uid: string
): Promise<boolean> => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, AUTHORS_COLLECTION)

  const ref = query(
    collectionGroupRef,
    where('uid', '==', uid),
    where('post.slug', '==', slug),
    limit(1)
  )

  const authoredPostsRef = await getDocs(ref)
  return !authoredPostsRef.empty
}

export default checkIsCreatedByUser
