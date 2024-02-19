import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  TopicSortMode,
  FirebaseDoc,
  Post,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import { createTopicPostsCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import isServer from '../../isServer'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'

const { TOPIC_LIST_CACHE_TIME, POST_PAGINATION_COUNT, POSTS_COLLECTION } =
  constants

type GetTopicPosts = (
  slug: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    startAfter?: FirebaseDoc
    uid?: string | null
    sortMode?: TopicSortMode
  }
) => Promise<Post[]>

const getTopicPosts: GetTopicPosts = async (
  path,
  { db: dbProp, startAfter, uid, sortMode = TopicSortMode.Latest } = {}
) => {
  const db = dbProp || firebase.firestore()

  let postDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let postData: PostData[] = []

  const topicPostsCacheKey = createTopicPostsCacheKey(path, {
    sortMode,
  })
  const serverCachedData = get(topicPostsCacheKey)

  if (serverCachedData) {
    postData = serverCachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db.collectionGroup(POSTS_COLLECTION).where('topic.path', '==', path),
      query =>
        sortMode === 'popular'
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
    put(topicPostsCacheKey, postData, TOPIC_LIST_CACHE_TIME)
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

export default getTopicPosts
