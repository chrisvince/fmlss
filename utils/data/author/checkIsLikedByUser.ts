import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from '../../serverCache'
import constants from '../../../constants'
import { createPostLikeCacheKey } from '../../createCacheKeys'

const { LIKES_COLLECTION, POST_LIKES_CACHE_TIME } = constants

const checkIsLikedByUser = async (
  slug: string,
  uid: string,
  {
    db: dbProp,
  }: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  } = {}
) => {
  const db = dbProp || firebase.firestore()
  let likedByUser = false
  const postLikesCacheKey = createPostLikeCacheKey(slug, uid)
  const serverCachedLike = get(postLikesCacheKey) as boolean | null

  if (serverCachedLike !== null) {
    likedByUser = serverCachedLike
  } else {
    const postLikesRef = await db
      .collectionGroup(LIKES_COLLECTION)
      .where('uid', '==', uid)
      .where('post.slug', '==', slug)
      .limit(1)
      .get()

    if (postLikesRef.empty) {
      likedByUser = false
    } else {
      likedByUser = true
    }

    put(postLikesCacheKey, likedByUser, POST_LIKES_CACHE_TIME)
  }

  return likedByUser
}

export default checkIsLikedByUser
