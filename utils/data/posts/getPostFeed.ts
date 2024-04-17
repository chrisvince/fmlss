import { pipe } from 'ramda'

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
  getFirestore,
  orderBy,
  startAfter,
  query,
  limit,
  getDocs,
} from 'firebase/firestore'

const { POST_PAGINATION_COUNT, POSTS_COLLECTION } = constants

const getPostFeed = async ({
  startAfter: startAfterProp,
  uid,
  sortMode = FeedSortMode.Latest,
}: {
  startAfter?: number
  uid: string
  sortMode?: FeedSortMode
}): Promise<Post[]> => {
  const db = getFirestore()

  const dbRef = pipe(
    () => collection(db, POSTS_COLLECTION),
    ref =>
      sortMode === FeedSortMode.Popular
        ? query(ref, orderBy('popularityScoreRecent', 'desc'))
        : ref,
    ref => query(ref, orderBy('createdAt', 'desc')),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(POST_PAGINATION_COUNT))
  )()

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
