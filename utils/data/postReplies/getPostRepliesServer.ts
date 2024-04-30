import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import {
  FirebaseDoc,
  Post,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'
import { createPostRepliesCacheKey } from '../../createCacheKeys'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import isServer from '../../isServer'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import checkIsCreatedByUserServer from '../author/checkIsCreatedByUserServer'
import checkIsLikedByUserServer from '../author/checkIsLikedByUserServer'
import checkUserIsWatchingServer from '../author/checkUserIsWatchingServer'
import getPostReactionServer from '../author/getPostReactionServer'

const { POST_REPLIES_PAGINATION_COUNT, REPLIES_CACHE_TIME } = constants

const getPostRepliesServer = async (
  reference: string,
  slug: string,
  {
    startAfter,
    uid,
  }: {
    startAfter?: FirebaseDoc
    uid?: string | null
  } = {}
): Promise<Post[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let replyDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let replyData: PostData[] = []
  const postRepliesCacheKey = createPostRepliesCacheKey(slug)
  const collection = `${reference}/posts`
  const cachedData = get(postRepliesCacheKey)

  if (cachedData) {
    replyData = cachedData
    replyDocs = null
  } else {
    replyDocs = await pipe(
      () => db.collection(collection).orderBy('createdAt', 'asc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(POST_REPLIES_PAGINATION_COUNT).get()
    )()

    if (replyDocs.empty) return []

    const replyDocsWithAttachments: PostDocWithAttachments[] =
      await Promise.all(
        replyDocs.docs.map(getPostDocWithAttachmentsFromPostDoc)
      )

    replyData = replyDocsWithAttachments.map(mapPostDocToData)

    const cacheTime =
      replyData.length < POST_REPLIES_PAGINATION_COUNT
        ? REPLIES_CACHE_TIME
        : undefined

    put(postRepliesCacheKey, replyData, cacheTime)
  }

  const repliesPromise = replyData.map(async replyDataItem => {
    if (!uid) {
      return {
        data: replyDataItem,
      }
    }

    const [createdByUser, likedByUser, userIsWatching, reaction] =
      await Promise.all([
        checkIsCreatedByUserServer(replyDataItem.slug, uid),
        checkIsLikedByUserServer(replyDataItem.slug, uid),
        checkUserIsWatchingServer(replyDataItem.slug, uid),
        getPostReactionServer(replyDataItem.slug, uid),
      ])

    return {
      data: replyDataItem,
      user: {
        created: createdByUser,
        like: likedByUser,
        reaction,
        watching: userIsWatching,
      },
    }
  })

  const replies = await Promise.all(repliesPromise)
  return replies
}

export default getPostRepliesServer
