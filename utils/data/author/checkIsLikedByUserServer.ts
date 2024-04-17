import firebase from 'firebase/app'

import { get, put } from '../../serverCache'
import constants from '../../../constants'
import { createPostLikeCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { LIKES_COLLECTION, POST_LIKES_CACHE_TIME } = constants

const checkIsLikedByUserServer = async (
  slug: string,
  uid: string
): Promise<boolean> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()

  let likedByUser = false
  const postLikesCacheKey = createPostLikeCacheKey(slug, uid)
  const cachedLike = get(postLikesCacheKey)

  if (cachedLike !== null) {
    likedByUser = cachedLike
  } else {
    const postLikesRef = await db
      .collectionGroup(LIKES_COLLECTION)
      .where('uid', '==', uid)
      .where('post.slug', '==', slug)
      .limit(1)
      .get()

    likedByUser = !postLikesRef.empty
    put(postLikesCacheKey, likedByUser, POST_LIKES_CACHE_TIME)
  }

  return likedByUser
}

export default checkIsLikedByUserServer
