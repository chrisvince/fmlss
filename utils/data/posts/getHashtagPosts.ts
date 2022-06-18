import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import constants from '../../../constants'
import { Post, PostData } from '../../../types'
import {
  createHashtagPostsCacheKey,
  createPostAuthorCacheKey,
} from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'

const firebaseDb = firebase.firestore()
const isServer = typeof window === 'undefined'

const {
  AUTHORED_POSTS_COLLECTION,
  HASHTAG_LIST_CACHE_TIME,
  PAGINATION_COUNT,
  POST_AUTHOR_CACHE_TIME,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

type GetHashtagPosts = (
  hashtag: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    uid?: string | null
  }
) => Promise<Post[]>

const getHashtagPosts: GetHashtagPosts = async (
  hashtag,
  {
    db = firebaseDb,
    uid,
  } = {},
) => {
  let postDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let postData: PostData[] = []

  const lowerCaseHashtag = hashtag.toLowerCase()
  const hashtagPostsCacheKey = createHashtagPostsCacheKey(lowerCaseHashtag)
  const cachedData = get(hashtagPostsCacheKey)

  if (isServer && cachedData) {
    postData = cachedData as PostData[]
    postDocs = null
  } else {
    postDocs = await db
      .collectionGroup(POSTS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .where('hashtags', 'array-contains', lowerCaseHashtag)
      .limit(PAGINATION_COUNT)
      .get()

    if (postDocs.empty) {
      return []
    }

    postData = postDocs.docs.map((doc) => mapPostDocToData(doc))
    put(hashtagPostsCacheKey, postData, HASHTAG_LIST_CACHE_TIME)
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

export default getHashtagPosts
