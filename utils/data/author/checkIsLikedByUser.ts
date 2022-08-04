import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import constants from '../../../constants'
import { createPostLikeCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'

const {
  POST_LIKES_COLLECTION,
  USERS_COLLECTION,
  POST_LIKES_CACHE_TIME,
} = constants

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
  let likedByUser: boolean = false
  const postLikesCacheKey = createPostLikeCacheKey(slug, uid)
  const cachedLike = get(postLikesCacheKey) as boolean | null

  if (isServer && cachedLike !== null) {
    likedByUser = cachedLike
  } else {
    const postLikesRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${POST_LIKES_COLLECTION}`)
      .where('slug', '==', slug)
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
