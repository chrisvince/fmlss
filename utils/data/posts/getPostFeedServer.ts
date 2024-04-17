import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  FeedSortMode,
  Post,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import { createPostFeedCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import isServer from '../../isServer'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import checkIsCreatedByUserServer from '../author/checkIsCreatedByUserServer'
import checkIsLikedByUserServer from '../author/checkIsLikedByUserServer'
import checkUserIsWatchingServer from '../author/checkUserIsWatchingServer'
import getPostReactionServer from '../author/getPostReactionServer'

const { FEED_CACHE_TIME, POST_PAGINATION_COUNT, POSTS_COLLECTION } = constants

const getPostFeedServer = async ({
  uid,
  sortMode = FeedSortMode.Latest,
}: {
  uid: string
  sortMode?: FeedSortMode
}): Promise<Post[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()

  let postDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let postData: PostData[] = []

  const postFeedCacheKey = createPostFeedCacheKey({ sortMode })
  const cachedData = get(postFeedCacheKey)

  if (cachedData) {
    postData = cachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () => db.collection(POSTS_COLLECTION),
      query =>
        sortMode === FeedSortMode.Popular
          ? query.orderBy('popularityScoreRecent', 'desc')
          : query,
      query => query.orderBy('createdAt', 'desc'),
      query => query.limit(POST_PAGINATION_COUNT).get()
    )()

    if (postDocs.empty) return []

    const postDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
      postDocs.docs.map(getPostDocWithAttachmentsFromPostDoc)
    )

    postData = postDocsWithAttachments.map(mapPostDocToData)
    put(postFeedCacheKey, postData, FEED_CACHE_TIME)
  }

  console.log('postData', postData)

  const postsPromise = postData.map(async postDataItem => {
    const [createdByUser, likedByUser, userIsWatching, reaction] =
      await Promise.all([
        checkIsCreatedByUserServer(postDataItem.slug, uid),
        checkIsLikedByUserServer(postDataItem.slug, uid),
        checkUserIsWatchingServer(postDataItem.slug, uid),
        getPostReactionServer(postDataItem.slug, uid),
      ])

    return {
      data: postDataItem,
      user: {
        created: createdByUser,
        like: likedByUser,
        reaction,
        watching: userIsWatching,
      },
    }
  })

  const posts = await Promise.all(postsPromise)
  console.log('posts', posts)
  return posts
}

export default getPostFeedServer
