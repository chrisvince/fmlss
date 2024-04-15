import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  FirebaseDoc,
  Post,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import {
  createUserPostsCacheKey,
  createUserRepliesCacheKey,
} from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import setCacheIsCreatedByUser from '../author/setCacheIsCreatedByUser'
import isServer from '../../isServer'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'

const { AUTHORS_COLLECTION, POST_PAGINATION_COUNT, USER_POSTS_CACHE_TIME } =
  constants

type GetUserPosts = (
  uid: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    startAfter?: FirebaseDoc
    type?: 'post' | 'reply'
  }
) => Promise<Post[]>

const getUserPosts: GetUserPosts = async (
  uid,
  { db: dbProp, startAfter, type = 'post' } = {}
) => {
  const db = dbProp || firebase.firestore()

  let authorDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let postData: PostData[] = []

  const createCacheKey = {
    post: createUserPostsCacheKey,
    reply: createUserRepliesCacheKey,
  }[type]

  const userPostsCacheKey = createCacheKey(uid)
  const serverCachedData = get(userPostsCacheKey)

  if (serverCachedData) {
    postData = serverCachedData
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

  const postsPromise = postData.map(async (postDataItem, index) => {
    const postDoc = authorDocs?.docs[index] ?? null

    setCacheIsCreatedByUser(postDataItem.slug, uid)

    const [likedByUser, userIsWatching, reaction] = await Promise.all([
      checkIsLikedByUser(postDataItem.slug, uid, { db }),
      checkUserIsWatching(postDataItem.slug, uid, { db }),
      getPostReaction(postDataItem.slug, uid, { db }),
    ])

    return {
      data: postDataItem,
      doc: !isServer ? postDoc : null,
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

export default getUserPosts
