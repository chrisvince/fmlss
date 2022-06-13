import firebase from 'firebase/app'
import 'firebase/firestore'

import constants from '../../../constants'
import { Post } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'

const firebaseDb = firebase.firestore()

const {
  AUTHORED_POSTS_COLLECTION,
  AUTHORED_REPLIES_COLLECTION,
  PAGINATION_COUNT,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

type firebaseDoc =
  | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>

type CheckPostIsCreatedByUser = (
  postDoc: firebaseDoc,
  uid: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  }
) => Promise<boolean>

const checkPostIsCreatedByUser: CheckPostIsCreatedByUser = async (
  postDoc,
  uid,
  { db = firebaseDb } = {},
) => {
  const authoredPostsRef = await db
    .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
    .where('originReference', '==', postDoc.ref)
    .limit(1)
    .get()

  return !authoredPostsRef.empty
}

type GetPost = (
  slug: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    includeFirebaseDocs?: boolean
    uid?: string | null
    withReplies?: boolean
  }
) => Promise<Post>

const getPost: GetPost = async (
  slug,
  {
    db = firebaseDb,
    includeFirebaseDocs = true,
    uid,
    withReplies = true,
  } = {},
) => {
  const postsRef = await db
    .collectionGroup(POSTS_COLLECTION)
    .where('slug', '==', slug)
    .limit(1)
    .get()

  if (postsRef.empty) {
    return {
      createdByUser: false,
      data: null,
      doc: null,
      replies: [],
    }
  }

  const postDoc = postsRef.docs[0]

  if (!withReplies) {
    if (!uid) {
      return {
        createdByUser: false,
        data: mapPostDocToData(postDoc),
        doc: includeFirebaseDocs ? postDoc : null,
        replies: [],
      }
    }

    const createdByUser = await checkPostIsCreatedByUser(postDoc, uid, { db })

    return {
      createdByUser,
      data: mapPostDocToData(postDoc),
      doc: includeFirebaseDocs ? postDoc : null,
      replies: [],
    }
  }

  const replyDocs = await postDoc.ref
    .collection(POSTS_COLLECTION)
    .orderBy('createdAt')
    .limit(PAGINATION_COUNT)
    .get()

  const repliesPromise = replyDocs.docs.map(async replyDoc => {
    if (!uid) {
      return {
        createdByUser: false,
        data: mapPostDocToData(replyDoc),
        doc: includeFirebaseDocs ? replyDoc : null,
      }
    }

    const authoredRepliesRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_REPLIES_COLLECTION}`)
      .where('originReference', '==', replyDoc.ref)
      .limit(1)
      .get()

    const createdByUser = !authoredRepliesRef.empty
    return {
      createdByUser: createdByUser,
      data: mapPostDocToData(replyDoc),
      doc: includeFirebaseDocs ? replyDoc : null,
    }
  })
  const replies = await Promise.all(repliesPromise)

  if (!uid) {
    return {
      createdByUser: false,
      data: mapPostDocToData(postDoc),
      doc: includeFirebaseDocs ? postDoc : null,
      replies,
    } 
  }

  const createdByUser = await checkPostIsCreatedByUser(postDoc, uid, { db })

  return {
    createdByUser,
    data: mapPostDocToData(postDoc),
    doc: includeFirebaseDocs ? postDoc : null,
    replies,
  }
}

export default getPost
