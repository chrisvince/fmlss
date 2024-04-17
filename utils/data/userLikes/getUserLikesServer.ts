import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  FirebaseDoc,
  Post,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import { createUserLikesCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import setCacheIsLikedByUser from '../author/setCacheIsLikedByUser'
import isServer from '../../isServer'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import checkIsCreatedByUserServer from '../author/checkIsCreatedByUserServer'
import checkUserIsWatchingServer from '../author/checkUserIsWatchingServer'
import getPostReactionServer from '../author/getPostReactionServer'

const { LIKES_COLLECTION, POST_PAGINATION_COUNT, USER_LIKES_CACHE_TIME } =
  constants

const getUserLikesServer = async (
  uid: string,
  {
    startAfter,
  }: {
    startAfter?: FirebaseDoc
  } = {}
): Promise<Post[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let postDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let postData: PostData[] = []
  const userLikesCacheKey = createUserLikesCacheKey(uid)
  const cachedData = get(userLikesCacheKey)

  if (cachedData) {
    postData = cachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db
          .collectionGroup(LIKES_COLLECTION)
          .where('uid', '==', uid)
          .orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(POST_PAGINATION_COUNT).get()
    )()

    if (postDocs.empty) return []

    const originPostDocsPromise = postDocs.docs.map(doc =>
      doc.data().post.ref.get()
    )

    const originPostDocs = await Promise.all(originPostDocsPromise)

    const postDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
      originPostDocs.map(getPostDocWithAttachmentsFromPostDoc)
    )

    postData = postDocsWithAttachments.map(mapPostDocToData)
    put(userLikesCacheKey, postData, USER_LIKES_CACHE_TIME)
  }

  const postsPromise = postData.map(async postDataItem => {
    const [createdByUser, userIsWatching, reaction] = await Promise.all([
      checkIsCreatedByUserServer(postDataItem.slug, uid),
      checkUserIsWatchingServer(postDataItem.slug, uid),
      getPostReactionServer(postDataItem.slug, uid),
    ])

    setCacheIsLikedByUser(postDataItem.slug, uid)

    return {
      data: postDataItem,
      user: {
        created: createdByUser,
        like: true,
        reaction,
        watching: userIsWatching,
      },
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getUserLikesServer
