import firebase from 'firebase/app'

import { get, put } from '../../serverCache'
import { createPostAuthorCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import isServer from '../../isServer'

const { AUTHORS_COLLECTION, POST_AUTHOR_CACHE_TIME } = constants

const checkIsCreatedByUserServer = async (
  slug: string,
  uid: string
): Promise<boolean> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()

  let createdByUser = false
  const postAuthorCacheKey = createPostAuthorCacheKey(slug)
  const cachedAuthorUid = get(postAuthorCacheKey)

  if (cachedAuthorUid) {
    createdByUser = uid === cachedAuthorUid
  } else {
    const authoredPostsRef = await db
      .collectionGroup(AUTHORS_COLLECTION)
      .where('uid', '==', uid)
      .where('post.slug', '==', slug)
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

export default checkIsCreatedByUserServer
