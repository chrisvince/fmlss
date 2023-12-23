import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { TopicSortMode, FirebaseDoc, Post, PostData } from '../../../types'
import { createTopicPostsCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import isServer from '../../isServer'
import checkUserIsWatching from '../author/checkUserIsWatching'

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
  const cachedData = get(topicPostsCacheKey)

  if (isServer && cachedData) {
    postData = cachedData
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

    postData = postDocs.docs.map(doc => mapPostDocToData(doc))
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

    const [createdByUser, likedByUser, userIsWatching] = await Promise.all([
      checkIsCreatedByUser(postDataItem.slug, uid, { db }),
      checkIsLikedByUser(postDataItem.slug, uid, { db }),
      checkUserIsWatching(postDataItem.slug, uid, { db }),
    ])

    return {
      data: postDataItem,
      doc: !isServer ? postDoc : null,
      user: {
        created: createdByUser,
        like: likedByUser,
        watching: userIsWatching,
      },
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getTopicPosts
