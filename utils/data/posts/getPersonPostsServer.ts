import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  FirebaseDoc,
  Post,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import { createPersonPostsCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import isServer from '../../isServer'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import { PersonPostsSortMode } from '../../../types/PersonPostsSortMode'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import checkIsCreatedByUserServer from '../author/checkIsCreatedByUserServer'
import checkIsLikedByUserServer from '../author/checkIsLikedByUserServer'
import checkUserIsWatchingServer from '../author/checkUserIsWatchingServer'
import getPostReactionServer from '../author/getPostReactionServer'

const { PERSON_POSTS_CACHE_TIME, POST_PAGINATION_COUNT, POSTS_COLLECTION } =
  constants

const getPersonPostsServer = async (
  slug: string,
  {
    sortMode = PersonPostsSortMode.Popular,
    startAfter,
    uid,
  }: {
    sortMode?: PersonPostsSortMode
    startAfter?: FirebaseDoc
    uid: string | null
  }
): Promise<Post[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let postDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let postData: PostData[] = []
  const lowerCaseSlug = slug.toLowerCase()

  const personPostsCacheKey = createPersonPostsCacheKey(lowerCaseSlug, {
    sortMode,
  })

  const cachedData = get(personPostsCacheKey)

  if (cachedData) {
    postData = cachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db
          .collectionGroup(POSTS_COLLECTION)
          .where('peopleSlugs', 'array-contains', lowerCaseSlug),
      query =>
        sortMode === PersonPostsSortMode.Popular
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
    put(personPostsCacheKey, postData, PERSON_POSTS_CACHE_TIME)
  }

  const postsPromise = postData.map(async postDataItem => {
    if (!uid) {
      return {
        data: postDataItem,
        user: {
          created: false,
          like: false,
          reaction: null,
          watching: false,
        },
      }
    }

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

export default getPersonPostsServer
