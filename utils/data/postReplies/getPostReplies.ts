import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import { FirebaseDoc, Post, PostData } from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'
import {
  createPostRepliesCacheKey,
  createPostAuthorCacheKey,
} from '../../createCacheKeys'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'

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
    startAfter?: FirebaseDoc
    uid?: string | null
    viewMode?: 'start' | 'end'
  }
) => Promise<Post[]>

const getPostReplies: GetPostReplies = async (
  reference,
  slug,
  {
    db = firebaseDb,
    startAfter,
    uid,
    viewMode = 'start',
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
    replyDocs = await pipe(
      () => db.collection(collection).orderBy(
        'createdAt',
        viewMode === 'end' ? 'desc' : 'asc',
      ),
      query => startAfter ? query.startAfter(startAfter) : query,
      query => query.limit(PAGINATION_COUNT).get(),
    )()

    if (replyDocs.empty) return []

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

    const createdByUser = await checkIsCreatedByUser(replyDataItem.id, uid, {
      db
    })

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
