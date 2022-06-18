import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import constants from '../../../constants'
import { Post, PostData } from '../../../types'
import {
  createPostCacheKey,
  createPostAuthorCacheKey,
} from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'

const firebaseDb = firebase.firestore()

const {
  AUTHORED_POSTS_COLLECTION,
  POST_AUTHOR_CACHE_TIME,
  POST_CACHE_TIME,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

const isServer = typeof window === 'undefined'

type GetPost = (
  slug: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    uid?: string | null
  }
) => Promise<Post>

const getPost: GetPost = async (
  slug,
  {
    db = firebaseDb,
    uid,
  } = {},
) => {
  let doc:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | null
  let data: PostData

  const postCacheKey = createPostCacheKey(slug)
  const cachedPostData = get(postCacheKey)

  if (isServer && cachedPostData) {
    data = cachedPostData
    doc = null
  } else {
    const postsRef = await db
      .collectionGroup(POSTS_COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (postsRef.empty) {
      throw new Error('Post does not exist')
    }

    doc = postsRef.docs[0]
    data = mapPostDocToData(doc)
    put(postCacheKey, data, POST_CACHE_TIME)
  }

  if (!uid) {
    return {
      createdByUser: false,
      data: data,
      doc: !isServer ? doc : null,
    }
  }

  let createdByUser: boolean = false
  const postAuthorCacheKey = createPostAuthorCacheKey(slug)
  const cachedAuthorUid = get(postAuthorCacheKey)

  if (isServer && cachedAuthorUid) {
    createdByUser = uid === cachedAuthorUid
  } else {
    const authoredPostsRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .where('originId', '==', data.id)
      .limit(1)
      .get()

    if (authoredPostsRef.empty) {
      createdByUser = false
    } else {
      createdByUser = true
      put(postAuthorCacheKey, uid, POST_AUTHOR_CACHE_TIME)
    }
  }

  return {
    createdByUser,
    data: data,
    doc: !isServer ? doc : null,
  }
}

export default getPost
