import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import constants from '../../../constants'
import { createPostReactionCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import { PostReaction, ReactionId } from '../../../types/Reaction'

const {
  POST_REACTIONS_CACHE_TIME,
  POST_REACTIONS_COLLECTION,
  USERS_COLLECTION,
} = constants

const getPostReaction = async (
  slug: string,
  uid: string,
  {
    db: dbProp,
  }: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  } = {}
) => {
  const db = dbProp || firebase.firestore()
  const postReactionCacheKey = createPostReactionCacheKey(slug, uid)
  const cachedReaction = get(postReactionCacheKey) as ReactionId | null
  let postReaction: ReactionId | null = null

  if (isServer && cachedReaction !== null) {
    postReaction = cachedReaction
  } else {
    const postReactionsRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${POST_REACTIONS_COLLECTION}`)
      .where('slug', '==', slug)
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

export default getPostReaction
