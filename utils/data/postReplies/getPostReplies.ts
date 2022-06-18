import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { Post, PostData } from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'
import {
  createPostRepliesCacheKey,
  createPostAuthorCacheKey,
} from '../../createCacheKeys'

const firebaseDb = firebase.firestore()
const isServer = typeof window === 'undefined'
const {
  AUTHORED_POSTS_COLLECTION,
  PAGINATION_COUNT,
  POST_AUTHOR_CACHE_TIME,
  REPLIES_CACHE_TIME,
  USERS_COLLECTION,
} = constants

type GetPostReplies = (
  reference: string,
  slug: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    uid?: string | null
  }
) => Promise<Post[]>

const getPostReplies: GetPostReplies = async (
  reference,
  slug,
  {
    db = firebaseDb,
    uid,
  } = {},
) => {
  let replyDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let replyData: PostData[] = []

  
  const postRepliesCacheKey = createPostRepliesCacheKey(slug)
  const collection = `${reference}/posts`
  const cachedData = get(postRepliesCacheKey)

  if (isServer && cachedData) {
    replyData = cachedData
    replyDocs = null
  } else {
    replyDocs = await db
      .collection(collection)
      .orderBy('createdAt')
      .limit(PAGINATION_COUNT)
      .get()
    replyData = replyDocs.docs.map(doc => mapPostDocToData(doc))

    const cacheTime =
      replyData.length < PAGINATION_COUNT ? REPLIES_CACHE_TIME : undefined

    put(postRepliesCacheKey, replyData, cacheTime)
  }

  const repliesPromise = replyData.map(async (replyDataItem, index) => {
    const replyDoc = replyDocs?.docs[index] ?? null

    if (!uid) {
      return {
        createdByUser: false,
        data: replyDataItem,
        doc: !isServer ? replyDoc : null,
      }
    }

    let createdByUser: boolean = false
    const postAuthorCacheKey = createPostAuthorCacheKey(replyDataItem.slug)
    const cachedAuthorUid = get(postAuthorCacheKey)

    if (isServer && cachedAuthorUid) {
      createdByUser = uid === cachedAuthorUid
    } else {
      const authoredPostsRef = await db
        .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
        .where('originId', '==', replyDataItem.id)
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
      data: replyDataItem,
      doc: !isServer ? replyDoc : null,
    }
  })
  const replies = await Promise.all(repliesPromise)

  return replies
}

export default getPostReplies
