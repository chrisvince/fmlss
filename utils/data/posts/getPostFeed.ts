import constants from '../../../constants'
import { FeedSortMode, Post, PostDocWithAttachments } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  Timestamp,
} from 'firebase/firestore'

const { POST_PAGINATION_COUNT, POSTS_COLLECTION } = constants

const getPostFeed = async ({
  startAfter: startAfterProp,
  uid,
  sortMode = FeedSortMode.Latest,
}: {
  startAfter?: Post | null
  uid: string
  sortMode?: FeedSortMode
}): Promise<Post[]> => {
  const db = getFirestore()
  const isPopularSortMode = sortMode === FeedSortMode.Popular

  const startAfterValue = startAfterProp
    ? [
        isPopularSortMode && startAfterProp.data.popularityScoreRecent,
        Timestamp.fromMillis(startAfterProp.data.createdAt),
      ].filter(value => value !== false)
    : null

  const queryElements = [
    isPopularSortMode && orderBy('popularityScoreRecent', 'desc'),
    orderBy('createdAt', 'desc'),
    startAfterValue && startAfter(...startAfterValue),
    limit(POST_PAGINATION_COUNT),
  ].filter(Boolean) as QueryConstraint[]

  const dbRef = query(collection(db, POSTS_COLLECTION), ...queryElements)
  const postDocs = await getDocs(dbRef)
  if (postDocs.empty) return []

  const postDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
    postDocs.docs.map(getPostDocWithAttachmentsFromPostDoc)
  )

  const postData = postDocsWithAttachments.map(mapPostDocToData)

  const postsPromise = postData.map(async postDataItem => {
    const [createdByUser, likedByUser, reaction, userIsWatching] =
      await Promise.all([
        checkIsCreatedByUser(postDataItem.slug, uid),
        checkIsLikedByUser(postDataItem.slug, uid),
        getPostReaction(postDataItem.slug, uid),
        checkUserIsWatching(postDataItem.slug, uid),
      ])

    return {
      data: postDataItem,
      user: {
        created: createdByUser,
        like: likedByUser,
        reaction,
        watching: userIsWatching,
      },
    }
  })

  const posts = await Promise.all(postsPromise)
  return posts
}

export default getPostFeed
