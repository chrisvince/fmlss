import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import { createPostAuthorCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'

const {
  AUTHORED_POSTS_COLLECTION,
  POST_AUTHOR_CACHE_TIME,
  USERS_COLLECTION,
} = constants

const firebaseDb = firebase.firestore()

const isServer = typeof window === 'undefined'

const checkIsCreatedByUser = async (
  postId: string,
  uid: string,
  {
    db = firebaseDb,
  }: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  } = {},
) => {
  let createdByUser: boolean = false

  const postAuthorCacheKey = createPostAuthorCacheKey(postId)
  const cachedAuthorUid = get(postAuthorCacheKey)

  if (isServer && cachedAuthorUid) {
    createdByUser = uid === cachedAuthorUid
  } else {
    const authoredPostsRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .where('originId', '==', postId)
      .limit(1)
      .get()

    if (authoredPostsRef.empty) {
      createdByUser = false
    } else {
      createdByUser = true
      put(postAuthorCacheKey, uid, POST_AUTHOR_CACHE_TIME)
    }
  }

  return createdByUser
}

export default checkIsCreatedByUser
