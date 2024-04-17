import { get, put } from '../../serverCache'
import { pipe } from 'ramda'
import constants from '../../../constants'
import {
  TopicSortMode,
  FirebaseDoc,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import { createTopicPostsCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import isServer from '../../isServer'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import checkIsCreatedByUserServer from '../author/checkIsCreatedByUserServer'
import checkIsLikedByUserServer from '../author/checkIsLikedByUserServer'
import checkUserIsWatchingServer from '../author/checkUserIsWatchingServer'
import getPostReactionServer from '../author/getPostReactionServer'

const { TOPIC_LIST_CACHE_TIME, POST_PAGINATION_COUNT, POSTS_COLLECTION } =
  constants

const getTopicPostsServer = async (
  path: string,
  {
    startAfter,
    uid,
    sortMode = TopicSortMode.Popular,
  }: {
    startAfter?: FirebaseDoc
    uid: string
    sortMode?: TopicSortMode
  }
) => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let postDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let postData: PostData[] = []

  const topicPostsCacheKey = createTopicPostsCacheKey(path, {
    sortMode,
  })

  const cachedData = get(topicPostsCacheKey)

  if (cachedData) {
    postData = cachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db.collectionGroup(POSTS_COLLECTION).where('topic.path', '==', path),
      query =>
        sortMode === TopicSortMode.Popular
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
    put(topicPostsCacheKey, postData, TOPIC_LIST_CACHE_TIME)
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

export default getTopicPostsServer
