import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { FirebaseDoc, Post, PostData } from '../../../types'
import {
  createPostAuthorCacheKey,
  createPostFeedCacheKey,
} from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'

const firebaseDb = firebase.firestore()
const isServer = typeof window === 'undefined'
const postFeedCacheKey = createPostFeedCacheKey()

const {
  AUTHORED_POSTS_COLLECTION,
  FEED_CACHE_TIME,
  PAGINATION_COUNT,
  POST_AUTHOR_CACHE_TIME,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

type GetPosts = (
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    startAfter?: FirebaseDoc
    uid?: string | null
  }
) => Promise<Post[]>

const getPostFeed: GetPosts = async (
  {
    db = firebaseDb,
    startAfter,
    uid,
  } = {},
) => {
  let postDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let postData: PostData[] = []

  const cachedData = get(postFeedCacheKey)

  if (isServer && cachedData) {
    postData = cachedData as PostData[]
    postDocs = null
  } else {
    postDocs =  await pipe(
      () => db.collection(POSTS_COLLECTION).orderBy('createdAt', 'desc'),
      query => startAfter ? query.startAfter(startAfter) : query,
      query => query.limit(PAGINATION_COUNT).get(),
    )()

    if (postDocs.empty) return []

    postData = postDocs.docs.map((doc) => mapPostDocToData(doc))
    put(postFeedCacheKey, postData, FEED_CACHE_TIME)
  }

  const postsPromise = postData.map(async (postDataItem, index) => {
    const postDoc = postDocs?.docs[index] ?? null

    if (!uid) {
      return {
        createdByUser: false,
        data: postDataItem,
        doc: !isServer ? postDoc : null,
      }
    }

    let createdByUser: boolean = false
    const postAuthorCacheKey = createPostAuthorCacheKey(postDataItem.slug)
    const cachedAuthorUid = get(postAuthorCacheKey)

    if (isServer && cachedAuthorUid) {
      createdByUser = uid === cachedAuthorUid
    } else {
      const authoredPostsRef = await db
        .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
        .where('originId', '==', postDataItem.id)
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
      data: postDataItem,
      doc: !isServer ? postDoc : null,
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getPostFeed
