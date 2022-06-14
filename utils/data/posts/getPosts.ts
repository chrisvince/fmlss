import firebase from 'firebase/app'
import 'firebase/firestore'

import constants from '../../../constants'
import { Post } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'

const firebaseDb = firebase.firestore()

const {
  AUTHORED_POSTS_COLLECTION,
  PAGINATION_COUNT,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

type GetPosts = (
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    includeFirebaseDocs?: boolean
    uid?: string | null
  }
) => Promise<Post[]>

const getPosts: GetPosts = async (
  {
    db = firebaseDb,
    includeFirebaseDocs = true,
    uid,
  } = {},
) => {
  const postsRef = await db
    .collection(POSTS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(PAGINATION_COUNT)
    .get()

  if (postsRef.empty) {
    return []
  }

  const postsPromise = postsRef.docs.map(async post => {
    if (!uid) {
      return {
        createdByUser: false,
        data: mapPostDocToData(post),
        doc: includeFirebaseDocs ? post : null,
      }
    }

    const authoredRepliesRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .where('originReference', '==', post.ref)
      .limit(1)
      .get()

    const createdByUser = !authoredRepliesRef.empty
    return {
      createdByUser,
      data: mapPostDocToData(post),
      doc: includeFirebaseDocs ? post : null,
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getPosts
