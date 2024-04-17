import { pipe } from 'ramda'
import constants from '../../../constants'
import { FirebaseDoc, Post, PostDocWithAttachments } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import isServer from '../../isServer'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'
import {
  DocumentData,
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
import { Like } from '../../../types/Like'

const { LIKES_COLLECTION, POST_PAGINATION_COUNT } = constants

type GetUserLikes = (
  uid: string,
  options?: {
    startAfter?: FirebaseDoc
  }
) => Promise<Post[]>

const getUserLikes: GetUserLikes = async (
  uid,
  { startAfter: startAfterProp } = {}
) => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, LIKES_COLLECTION)

  const dbRef = pipe(
    ref => query(ref, where('uid', '==', uid), orderBy('createdAt', 'desc')),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(POST_PAGINATION_COUNT))
  )(collectionGroupRef)

  const postDocs = await getDocs(dbRef)
  if (postDocs.empty) return []

  const originPostDocsPromise = postDocs.docs.map(doc =>
    getDoc((doc.data() as Like).post.ref)
  )

  const originPostDocs = await Promise.all(originPostDocsPromise)

  const postDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
    originPostDocs.map(getPostDocWithAttachmentsFromPostDoc)
  )

  const postData = postDocsWithAttachments.map(mapPostDocToData)

  const postsPromise = postData.map(async (postDataItem, index) => {
    const postDoc = postDocs?.docs[index] ?? null

    const [createdByUser, userIsWatching, reaction] = await Promise.all([
      checkIsCreatedByUser(postDataItem.slug, uid),
      checkUserIsWatching(postDataItem.slug, uid),
      getPostReaction(postDataItem.slug, uid),
    ])

    return {
      data: postDataItem,
      doc: !isServer ? postDoc : null,
      user: {
        created: createdByUser,
        like: true,
        reaction,
        watching: userIsWatching,
      },
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getUserLikes
