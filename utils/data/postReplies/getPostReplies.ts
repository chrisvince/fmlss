import { Post, PostDocWithAttachments } from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'
import {
  QueryConstraint,
  Timestamp,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'

const { POST_REPLIES_PAGINATION_COUNT } = constants

const getPostReplies = async (
  reference: string,
  {
    startAfter: startAfterProp,
    uid,
  }: {
    startAfter?: Post
    uid?: string | null
  } = {}
): Promise<Post[]> => {
  const db = getFirestore()

  const queryElements = [
    orderBy('createdAt', 'asc'),
    startAfterProp &&
      startAfter(Timestamp.fromMillis(startAfterProp.data.createdAt)),
    limit(POST_REPLIES_PAGINATION_COUNT),
  ].filter(Boolean) as QueryConstraint[]

  const dbRef = query(collection(db, `${reference}/posts`), ...queryElements)
  const replyDocs = await getDocs(dbRef)
  if (replyDocs.empty) return []

  const replyDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
    replyDocs.docs.map(getPostDocWithAttachmentsFromPostDoc)
  )

  const replyData = replyDocsWithAttachments.map(mapPostDocToData)

  const repliesPromise = replyData.map(async replyDataItem => {
    if (!uid) {
      return {
        data: replyDataItem,
      }
    }

    const [createdByUser, likedByUser, userIsWatching, reaction] =
      await Promise.all([
        checkIsCreatedByUser(replyDataItem.slug, uid),
        checkIsLikedByUser(replyDataItem.slug, uid),
        checkUserIsWatching(replyDataItem.slug, uid),
        getPostReaction(replyDataItem.slug, uid),
      ])

    return {
      data: replyDataItem,
      user: {
        created: createdByUser,
        like: likedByUser,
        reaction,
        watching: userIsWatching,
      },
    }
  })

  const replies = await Promise.all(repliesPromise)
  return replies
}

export default getPostReplies
