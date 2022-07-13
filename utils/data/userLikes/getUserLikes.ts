import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { FirebaseDoc, Post, PostData } from '../../../types'
import { createUserLikesCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import setCacheIsLikedByUser from '../author/setCacheIsLikedByUser'
import isServer from '../../isServer'

const {
  PAGINATION_COUNT,
  POST_LIKES_COLLECTION,
  USER_LIKES_CACHE_TIME,
  USERS_COLLECTION,
} = constants

type GetUserLikes = (
  uid: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    startAfter?: FirebaseDoc
  }
) => Promise<Post[]>

const getUserLikes: GetUserLikes = async (
  uid,
  { db: dbProp, startAfter } = {}
) => {
  const db = dbProp || firebase.firestore()

  let postDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let postData: PostData[] = []

  const userLikesCacheKey = createUserLikesCacheKey(uid)
  const cachedData = get(userLikesCacheKey)

  if (isServer && cachedData) {
    postData = cachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db
          .collection(`${USERS_COLLECTION}/${uid}/${POST_LIKES_COLLECTION}`)
          .orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(PAGINATION_COUNT).get()
    )()

    if (postDocs.empty) return []

    const originPostDocsPromise = postDocs.docs.map(doc => (
      doc.data().originReference.get()
    ))
    const originPostDocs = await Promise.all(originPostDocsPromise)

    postData = originPostDocs.map(doc => mapPostDocToData(doc))
    put(userLikesCacheKey, postData, USER_LIKES_CACHE_TIME)
  }

  const postsPromise = postData.map(async (postDataItem, index) => {
    const postDoc = postDocs?.docs[index] ?? null

    const createdByUser = await checkIsCreatedByUser(postDataItem.slug, uid, {
      db,
    })

    setCacheIsLikedByUser(postDataItem.slug, uid)

    return {
      data: postDataItem,
      doc: !isServer ? postDoc : null,
      user: {
        created: createdByUser,
        like: true,
      }
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getUserLikes
