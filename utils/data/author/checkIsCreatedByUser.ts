import firebase from 'firebase/app'
import 'firebase/firestore'

import { get, put } from '../../serverCache'
import { createPostAuthorCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'

const { AUTHORS_COLLECTION, POST_AUTHOR_CACHE_TIME } = constants

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
  const serverCachedAuthorUid = get(postAuthorCacheKey)

  if (serverCachedAuthorUid) {
    createdByUser = uid === serverCachedAuthorUid
  } else {
    const authoredPostsRef = await db
      .collectionGroup(AUTHORS_COLLECTION)
      .where('uid', '==', uid)
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
