import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import constants from '../../../constants'
import { Post, PostData } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'

const firebaseDb = firebase.firestore()
const isServer = typeof window === 'undefined'
const CACHE_KEY = 'feed'

const {
  AUTHORED_POSTS_COLLECTION,
  FEED_CACHE_TIME,
  PAGINATION_COUNT,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

type GetPosts = (
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    uid?: string | null
  }
) => Promise<Post[]>

const getPostFeed: GetPosts = async (
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

  const cachedData = get(CACHE_KEY)

  if (isServer && cachedData) {
    postData = cachedData as PostData[]
    postDocs = null
  } else {
    postDocs = await db
      .collection(POSTS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(PAGINATION_COUNT)
      .get()

    if (postDocs.empty) {
      return []
    }

    postData = postDocs.docs.map((doc) => mapPostDocToData(doc))
    put(CACHE_KEY, postData, FEED_CACHE_TIME)
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

    const authoredPostsRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .where('originId', '==', postDataItem.id)
      .limit(1)
      .get()

    const createdByUser = !authoredPostsRef.empty
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
