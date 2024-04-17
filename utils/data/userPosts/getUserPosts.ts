import firebase from 'firebase/app'
import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  Author,
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
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import setCacheIsCreatedByUser from '../author/setCacheIsCreatedByUser'
import isServer from '../../isServer'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'
import {
  collectionGroup,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'

const { AUTHORS_COLLECTION, POST_PAGINATION_COUNT, USER_POSTS_CACHE_TIME } =
  constants

const getUserPosts = async (
  uid: string,
  {
    startAfter: startAfterProp,
    type = PostType.Post,
  }: {
    startAfter?: FirebaseDoc
    type?: PostType
  }
): Promise<Post[]> => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, AUTHORS_COLLECTION)

  const dbRef = pipe(
    ref =>
      query(
        ref,
        where('uid', '==', uid),
        where('post.type', '==', type),
        orderBy('createdAt', 'desc')
      ),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(POST_PAGINATION_COUNT))
  )(collectionGroupRef)

  const authorDocs = await getDocs(dbRef)
  if (authorDocs.empty) return []

  const postDocsPromise = authorDocs.docs.map(doc =>
    getDoc((doc.data() as Author).post.ref)
  )

  const postDocs = await Promise.all(postDocsPromise)

  const postDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
    postDocs.map(getPostDocWithAttachmentsFromPostDoc)
  )

  const postData = postDocsWithAttachments.map(mapPostDocToData)

  const postsPromise = postData.map(async postDataItem => {
    const [likedByUser, userIsWatching, reaction] = await Promise.all([
      checkIsLikedByUser(postDataItem.slug, uid),
      checkUserIsWatching(postDataItem.slug, uid),
      getPostReaction(postDataItem.slug, uid),
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

export default getUserPosts
