import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  FeedSortMode,
  FirebaseDoc,
  Post,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import { createPostFeedCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import isServer from '../../isServer'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'

const { FEED_CACHE_TIME, POST_PAGINATION_COUNT, POSTS_COLLECTION } = constants

type GetPosts = (options?: {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  startAfter?: FirebaseDoc
  uid?: string | null
  sortMode?: FeedSortMode
}) => Promise<Post[]>

const getPostFeed: GetPosts = async ({
  db: dbProp,
  startAfter,
  uid,
  sortMode = FeedSortMode.Latest,
} = {}) => {
  const db = dbProp || firebase.firestore()

  let postDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let postData: PostData[] = []

  const postFeedCacheKey = createPostFeedCacheKey(sortMode)
  const cachedData = get(postFeedCacheKey)

  if (isServer && cachedData) {
    postData = cachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () => db.collection(POSTS_COLLECTION),
      query =>
        sortMode === FeedSortMode.Popular
          ? query.orderBy('recentViewCount', 'desc')
          : query,
      query => query.orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(POST_PAGINATION_COUNT).get()
    )()

    if (postDocs.empty) return []

    const postDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
      postDocs.docs.map(getPostDocWithAttachmentsFromPostDoc)
    )

    postData = postDocsWithAttachments.map(mapPostDocToData)
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

    const [createdByUser, likedByUser, userIsWatching, reaction] =
      await Promise.all([
        checkIsCreatedByUser(postDataItem.slug, uid, { db }),
        checkIsLikedByUser(postDataItem.slug, uid, { db }),
        checkUserIsWatching(postDataItem.slug, uid, { db }),
        getPostReaction(postDataItem.slug, uid, { db }),
      ])

    return {
      data: postDataItem,
      doc: !isServer ? postDoc : null,
      user: {
        created: createdByUser,
        like: likedByUser,
        reaction,
        watching: userIsWatching,
      },
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getPostFeed
