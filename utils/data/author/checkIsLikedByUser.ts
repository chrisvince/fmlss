import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import constants from '../../../constants'
import { createPostLikeCacheKey } from '../../createCacheKeys'

const firebaseDb = firebase.firestore()
const {
  POST_LIKES_COLLECTION,
  USERS_COLLECTION,
  POST_LIKES_CACHE_TIME,
} = constants

const isServer = typeof window === 'undefined'

const checkIsLikedByUser = async (
  postId: string,
  uid: string,
  {
    db = firebaseDb,
  }: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  } = {}
) => {
  let likedByUser: boolean = false
  const postLikesCacheKey = createPostLikeCacheKey(postId, uid)
  const cachedLike = get(postLikesCacheKey) as boolean | null
  console.log('cachedLike', cachedLike)

  if (isServer && cachedLike !== null) {
    likedByUser = cachedLike
  } else {
    const postLikesRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${POST_LIKES_COLLECTION}`)
      .where('originId', '==', postId)
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
