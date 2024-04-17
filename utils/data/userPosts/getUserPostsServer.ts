import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  FirebaseDoc,
  Post,
  PostData,
  PostDocWithAttachments,
  PostType,
} from '../../../types'
import {
  createUserPostsCacheKey,
  createUserRepliesCacheKey,
} from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import setCacheIsCreatedByUser from '../author/setCacheIsCreatedByUser'
import isServer from '../../isServer'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import checkIsLikedByUserServer from '../author/checkIsLikedByUserServer'
import checkUserIsWatchingServer from '../author/checkUserIsWatchingServer'
import getPostReactionServer from '../author/getPostReactionServer'

const { AUTHORS_COLLECTION, POST_PAGINATION_COUNT, USER_POSTS_CACHE_TIME } =
  constants

const getUserPostsServer = async (
  uid: string,
  {
    startAfter,
    type = PostType.Post,
  }: {
    startAfter?: FirebaseDoc
    type?: PostType
  }
): Promise<Post[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let authorDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null
  let postData: PostData[] = []

  const createCacheKey = {
    post: createUserPostsCacheKey,
    reply: createUserRepliesCacheKey,
  }[type]

  const userPostsCacheKey = createCacheKey(uid)
  const cachedData = get(userPostsCacheKey)

  if (cachedData) {
    postData = cachedData
    authorDocs = null
  } else {
    authorDocs = await pipe(
      () =>
        db
          .collectionGroup(AUTHORS_COLLECTION)
          .where('uid', '==', uid)
          .where('post.type', '==', type)
          .orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(POST_PAGINATION_COUNT).get()
    )()

    if (authorDocs.empty) return []

    const postDocsPromise = authorDocs.docs.map(doc =>
      doc.data().post.ref.get()
    )
    const postDocs = await Promise.all(postDocsPromise)

    const postDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
      postDocs.map(getPostDocWithAttachmentsFromPostDoc)
    )

    postData = postDocsWithAttachments.map(mapPostDocToData)
    put(userPostsCacheKey, postData, USER_POSTS_CACHE_TIME)
  }

  const postsPromise = postData.map(async postDataItem => {
    setCacheIsCreatedByUser(postDataItem.slug, uid)

    const [likedByUser, userIsWatching, reaction] = await Promise.all([
      checkIsLikedByUserServer(postDataItem.slug, uid),
      checkUserIsWatchingServer(postDataItem.slug, uid),
      getPostReactionServer(postDataItem.slug, uid),
    ])

    return {
      data: postDataItem,
      user: {
        created: true,
        like: likedByUser,
        reaction,
        watching: userIsWatching,
      },
    }
  })

  const posts = await Promise.all(postsPromise)
  return posts
}

export default getUserPostsServer
