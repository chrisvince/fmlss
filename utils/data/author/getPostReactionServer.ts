import firebase from 'firebase/app'

import { get, put } from '../../serverCache'
import constants from '../../../constants'
import { createPostReactionCacheKey } from '../../createCacheKeys'
import { PostReaction, ReactionId } from '../../../types/Reaction'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { POST_REACTIONS_CACHE_TIME, REACTIONS_COLLECTION } = constants

const getPostReactionServer = async (
  slug: string,
  uid: string
): Promise<ReactionId | null> => {
  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  const postReactionCacheKey = createPostReactionCacheKey(slug, uid)
  const cachedReaction = get(postReactionCacheKey)
  let postReaction: ReactionId | null = null

  if (cachedReaction !== null) {
    postReaction = cachedReaction
  } else {
    const postReactionsRef = await db
      .collectionGroup(REACTIONS_COLLECTION)
      .where('uid', '==', uid)
      .where('post.slug', '==', slug)
      .limit(1)
      .get()

    if (postReactionsRef.empty) {
      postReaction = null
    } else {
      const postReactionDoc = postReactionsRef.docs[0]
      const postReactionData = postReactionDoc.data() as PostReaction
      postReaction = postReactionData.reaction
    }

    put(postReactionCacheKey, postReaction, POST_REACTIONS_CACHE_TIME)
  }

  return postReaction
}

export default getPostReactionServer
