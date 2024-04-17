import constants from '../../../constants'
import { PostReaction, ReactionId } from '../../../types/Reaction'
import {
  collectionGroup,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore'

const { REACTIONS_COLLECTION } = constants

const getPostReaction = async (
  slug: string,
  uid: string
): Promise<ReactionId | null> => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, REACTIONS_COLLECTION)

  const dbRef = query(
    collectionGroupRef,
    where('uid', '==', uid),
    where('post.slug', '==', slug),
    limit(1)
  )

  const postReactionsRef = await getDocs(dbRef)

  if (postReactionsRef.empty) {
    return null
  }

  const postReactionDoc = postReactionsRef.docs[0]
  const postReactionData = postReactionDoc.data() as PostReaction
  return postReactionData.reaction
}

export default getPostReaction
