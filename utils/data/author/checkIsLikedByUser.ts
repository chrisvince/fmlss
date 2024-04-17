import constants from '../../../constants'
import {
  collectionGroup,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore'

const { LIKES_COLLECTION } = constants

const checkIsLikedByUser = async (
  slug: string,
  uid: string
): Promise<boolean> => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, LIKES_COLLECTION)

  const dbRef = query(
    collectionGroupRef,
    where('uid', '==', uid),
    where('post.slug', '==', slug),
    limit(1)
  )

  const postLikesRef = await getDocs(dbRef)
  return !postLikesRef.empty
}

export default checkIsLikedByUser
