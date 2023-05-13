import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import { FirebaseDoc, Post, PostData } from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'
import { createPostRepliesCacheKey } from '../../createCacheKeys'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import isServer from '../../isServer'

const { PAGINATION_COUNT, REPLIES_CACHE_TIME } = constants

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
  { db: dbProp, startAfter, uid, viewMode = 'start' } = {}
) => {
  const db = dbProp || firebase.firestore()

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
      () =>
        db
          .collection(collection)
          .orderBy('createdAt', viewMode === 'end' ? 'desc' : 'asc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(PAGINATION_COUNT).get()
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
        data: replyDataItem,
        doc: !isServer ? replyDoc : null,
      }
    }

    const supportingDataPromises = [
      checkIsCreatedByUser(replyDataItem.slug, uid, { db }),
      checkIsLikedByUser(replyDataItem.slug, uid, { db }),
    ]

    const [createdByUser, likedByUser] = await Promise.all(
      supportingDataPromises
    )

    return {
      data: replyDataItem,
      doc: !isServer ? replyDoc : null,
      user: {
        created: createdByUser,
        like: likedByUser,
      },
    }
  })
  const replies = await Promise.all(repliesPromise)

  return replies
}

export default getPostReplies
