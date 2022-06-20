import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { FirebaseDoc, Post, PostData } from '../../../types'
import {
  createHashtagPostsCacheKey,
  createPostAuthorCacheKey,
} from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'

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
    startAfter?: FirebaseDoc
    uid?: string | null
  }
) => Promise<Post[]>

const getHashtagPosts: GetHashtagPosts = async (
  hashtag,
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

  const lowerCaseHashtag = hashtag.toLowerCase()
  const hashtagPostsCacheKey = createHashtagPostsCacheKey(lowerCaseHashtag)
  const cachedData = get(hashtagPostsCacheKey)

  if (isServer && cachedData) {
    postData = cachedData as PostData[]
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db
          .collectionGroup(POSTS_COLLECTION)
          .orderBy('createdAt', 'desc')
          .where('hashtags', 'array-contains', lowerCaseHashtag),
      query => startAfter ? query.startAfter(startAfter) : query,
      query => query.limit(PAGINATION_COUNT).get()
    )()

    if (postDocs.empty) return []

    postData = postDocs.docs.map(doc => mapPostDocToData(doc))
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

    const createdByUser = await checkIsCreatedByUser(postDataItem.id, uid, {
      db,
    })

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
