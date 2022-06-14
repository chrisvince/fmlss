import firebase from 'firebase/app'
import 'firebase/firestore'

import { Post } from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'

const db = firebase.firestore()

const {
  AUTHORED_POSTS_COLLECTION,
  PAGINATION_COUNT,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

type GetMorePosts = (
  posts: Post[],
  options?: { uid?: string | null }
) => Promise<Post[]>

const getMorePosts: GetMorePosts = async (posts, { uid } = {}) => {
  const lastPost = posts[posts.length - 1]

  if (!lastPost || !lastPost.doc) {
    console.error('Could not get more posts. No last post doc exists.')
    return posts
  }

  const postDocs = await db
    .collection(POSTS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .startAfter(lastPost.doc)
    .limit(PAGINATION_COUNT)
    .get()

  const postsPromise = postDocs.docs.map(async postDoc => {
    if (!uid) {
      return {
        createdByUser: false,
        data: mapPostDocToData(postDoc),
        doc: postDoc,
      }
    }

    const authoredPostsRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .where('originReference', '==', postDoc.ref)
      .limit(1)
      .get()

    const createdByUser = !authoredPostsRef.empty
    return {
      createdByUser,
      data: mapPostDocToData(postDoc),
      doc: postDoc,
    }
  })
  const newPosts = await Promise.all(postsPromise)

  return [
    ...posts,
    ...newPosts,
  ]
}

export default getMorePosts
