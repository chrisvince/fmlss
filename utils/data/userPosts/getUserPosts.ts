import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { FirebaseDoc, Post, PostData } from '../../../types'
import { createUserPostsCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import setCacheIsCreatedByUser from '../author/setCacheIsCreatedByUser'
import isServer from '../../isServer'

const firebaseDb = firebase.firestore()

const {
  AUTHORED_POSTS_COLLECTION,
  PAGINATION_COUNT,
  USER_POSTS_CACHE_TIME,
  USERS_COLLECTION,
} = constants

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
  { db = firebaseDb, startAfter, type = 'post' } = {}
) => {
  let postDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let postData: PostData[] = []

  const userPostsCacheKey = createUserPostsCacheKey(uid)
  const cachedData = get(userPostsCacheKey)

  if (isServer && cachedData) {
    postData = cachedData as PostData[]
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db
          .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
          .where('type', '==', type)
          .orderBy('createdAt', 'desc'),
      query => startAfter ? query.startAfter(startAfter) : query,
      query => query.limit(PAGINATION_COUNT).get()
    )()

    if (postDocs.empty) return []

    const originPostDocsPromise = postDocs.docs.map(doc =>
      doc.data().originReference.get()
    )
    const originPostDocs = await Promise.all(originPostDocsPromise)

    postData = originPostDocs.map(doc => mapPostDocToData(doc))
    put(userPostsCacheKey, postData, USER_POSTS_CACHE_TIME)
  }

  const postsPromise = postData.map(async (postDataItem, index) => {
    const postDoc = postDocs?.docs[index] ?? null

    setCacheIsCreatedByUser(postDataItem.slug, uid)

    const likedByUser = await checkIsLikedByUser(postDataItem.slug, uid, {
      db,
    })

    return {
      data: postDataItem,
      doc: !isServer ? postDoc : null,
      user: {
        created: true,
        like: likedByUser,
      }
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getUserPosts
