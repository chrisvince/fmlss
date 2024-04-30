import constants from '../../../constants'
import { LikeRequest, Post } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'
import {
  QueryConstraint,
  Timestamp,
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
import mapLikeDocToData from '../../mapLikeDocToData'

const { LIKES_COLLECTION, POST_PAGINATION_COUNT } = constants

const getUserLikes = async (
  uid: string,
  { startAfter: startAfterProp }: { startAfter?: Post | null } = {}
): Promise<Post[]> => {
  const db = getFirestore()

  if (startAfterProp && !startAfterProp.like) {
    throw new Error('startAfterProp must have a like property')
  }

  const queryElements = [
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    startAfterProp &&
      startAfterProp.like &&
      startAfter(Timestamp.fromMillis(startAfterProp.like.createdAt)),
    limit(POST_PAGINATION_COUNT),
  ].filter(Boolean) as QueryConstraint[]

  const dbRef = query(collectionGroup(db, LIKES_COLLECTION), ...queryElements)
  const likeDocs = await getDocs(dbRef)
  if (likeDocs.empty) return []

  const posts = await Promise.all(
    likeDocs.docs.map(async likeDoc => {
      const likeDocData = likeDoc.data() as LikeRequest
      const likeData = mapLikeDocToData(likeDoc)
      const postDoc = await getDoc(likeDocData.post.ref)

      const postWithAttachments = await getPostDocWithAttachmentsFromPostDoc(
        postDoc
      )

      const postData = mapPostDocToData(postWithAttachments)

      const [createdByUser, userIsWatching, reaction] = await Promise.all([
        checkIsCreatedByUser(postData.slug, uid),
        checkUserIsWatching(postData.slug, uid),
        getPostReaction(postData.slug, uid),
      ])

      return {
        data: postData,
        like: likeData,
        user: {
          created: createdByUser,
          like: true,
          reaction,
          watching: userIsWatching,
        },
      }
    })
  )

  return posts
}

export default getUserLikes
