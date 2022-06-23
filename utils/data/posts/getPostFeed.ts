import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { FirebaseDoc, Post, PostData } from '../../../types'
import { createPostFeedCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'

const firebaseDb = firebase.firestore()
const isServer = typeof window === 'undefined'
const postFeedCacheKey = createPostFeedCacheKey()

const { FEED_CACHE_TIME, PAGINATION_COUNT, POSTS_COLLECTION } = constants

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
        data: postDataItem,
        doc: !isServer ? postDoc : null,
      }
    }

    const createdByUser = await checkIsCreatedByUser(postDataItem.slug, uid, {
      db
    })
    const likedByUser = await checkIsLikedByUser(postDataItem.slug, uid, { db })

    return {
      data: postDataItem,
      doc: !isServer ? postDoc : null,
      user: {
        created: createdByUser,
        like: likedByUser,
      }
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getPostFeed
