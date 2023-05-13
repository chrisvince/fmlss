import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import { createPostAuthorCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import isServer from '../../isServer'

const { AUTHORED_POSTS_COLLECTION, POST_AUTHOR_CACHE_TIME, USERS_COLLECTION } =
  constants

const checkIsCreatedByUser = async (
  slug: string,
  uid: string,
  {
    db: dbProp,
  }: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  } = {}
) => {
  const db = dbProp || firebase.firestore()
  let createdByUser = false
  const postAuthorCacheKey = createPostAuthorCacheKey(slug)
  const cachedAuthorUid = get(postAuthorCacheKey)

  if (isServer && cachedAuthorUid) {
    createdByUser = uid === cachedAuthorUid
  } else {
    const authoredPostsRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .where('slug', '==', slug)
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
