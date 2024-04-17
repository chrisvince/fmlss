import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  HashtagSortMode,
  FirebaseDoc,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import { createHashtagPostsCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import isServer from '../../isServer'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import checkIsCreatedByUserServer from '../author/checkIsCreatedByUserServer'
import checkIsLikedByUserServer from '../author/checkIsLikedByUserServer'
import checkUserIsWatchingServer from '../author/checkUserIsWatchingServer'
import getPostReactionServer from '../author/getPostReactionServer'

const { HASHTAG_LIST_CACHE_TIME, POST_PAGINATION_COUNT, POSTS_COLLECTION } =
  constants

export enum HashtagShowType {
  Post = 'post',
  Both = 'both',
}

const getHashtagPostsServer = async (
  slug: string,
  {
    startAfter,
    uid,
    showType = HashtagShowType.Post,
    sortMode = HashtagSortMode.Latest,
  }: {
    startAfter?: FirebaseDoc
    uid: string
    showType?: HashtagShowType
    sortMode?: HashtagSortMode
  }
) => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let postDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let postData: PostData[] = []
  const lowerCaseSlug = slug.toLowerCase()

  const hashtagPostsCacheKey = createHashtagPostsCacheKey(
    lowerCaseSlug,
    showType,
    sortMode
  )

  const cachedData = get(hashtagPostsCacheKey)

  if (cachedData) {
    postData = cachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db
          .collectionGroup(POSTS_COLLECTION)
          .where('hashtagSlugs', 'array-contains', lowerCaseSlug),
      query =>
        showType !== 'both' ? query.where('type', '==', showType) : query,
      query =>
        sortMode === HashtagSortMode.Popular
          ? query.orderBy('popularityScoreRecent', 'desc')
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
    put(hashtagPostsCacheKey, postData, HASHTAG_LIST_CACHE_TIME)
  }

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
  return posts
}

export default getHashtagPostsServer
