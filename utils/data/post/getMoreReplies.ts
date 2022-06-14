import firebase from 'firebase/app'
import 'firebase/firestore'

import { Post } from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'

const db = firebase.firestore()

const {
  POSTS_COLLECTION,
  PAGINATION_COUNT,
  USERS_COLLECTION,
  AUTHORED_REPLIES_COLLECTION,
} = constants

type GetMoreReplies = (
  post: Post,
  options?: { uid?: string | null }
) => Promise<Post>

const getMoreReplies: GetMoreReplies = async (post, { uid } = {}) => {
  if (!post.doc) {
    console.error('Could not get more replies. No post doc exists.')
    return post
  }

  const lastReply = post?.replies?.[post?.replies?.length - 1]

  if (!lastReply || !lastReply.doc) {
    console.error('Could not get more replies. No last post doc exists.')
    return post
  }

  const replyDocs = await post.doc.ref
    .collection(POSTS_COLLECTION)
    .orderBy('createdAt')
    .startAfter(lastReply.doc)
    .limit(PAGINATION_COUNT)
    .get()

  const repliesPromise = replyDocs.docs.map(async (replyDoc) => {
    if (!uid) {
      return {
        createdByUser: false,
        data: mapPostDocToData(replyDoc),
        doc: replyDoc,
      }
    }

    const authoredRepliesRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_REPLIES_COLLECTION}`)
      .where('originReference', '==', replyDoc.ref)
      .limit(1)
      .get()

    const createdByUser = !authoredRepliesRef.empty
    return {
      createdByUser,
      data: mapPostDocToData(replyDoc),
      doc: replyDoc,
    }
  })
  const newReplies = await Promise.all(repliesPromise)

  return {
    ...post,
    replies: [
      ...(post.replies ? post.replies : []),
      ...newReplies,
    ]
  }
}

export default getMoreReplies
