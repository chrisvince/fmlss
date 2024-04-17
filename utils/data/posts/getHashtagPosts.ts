import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  HashtagSortMode,
  FirebaseDoc,
  PostDocWithAttachments,
} from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'
import {
  collectionGroup,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'

const { POST_PAGINATION_COUNT, POSTS_COLLECTION } = constants

export enum HashtagShowType {
  Post = 'post',
  Both = 'both',
}

const getHashtagPosts = async (
  slug: string,
  {
    startAfter: startAfterProp,
    uid,
    showType = HashtagShowType.Post,
    sortMode = HashtagSortMode.Latest,
  }: {
    startAfter?: FirebaseDoc
    uid: string
    showType?: HashtagShowType
    sortMode?: HashtagSortMode
  }
) => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, POSTS_COLLECTION)

  const dbRef = pipe(
    ref =>
      query(ref, where('hashtagSlugs', 'array-contains', slug.toLowerCase())),
    ref =>
      showType !== 'both' ? query(ref, where('type', '==', showType)) : ref,
    ref =>
      sortMode === HashtagSortMode.Popular
        ? query(ref, orderBy('popularityScoreRecent', 'desc'))
        : ref,
    ref => query(ref, orderBy('createdAt', 'desc')),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(POST_PAGINATION_COUNT))
  )(collectionGroupRef)

  const postDocs = await getDocs(dbRef)
  if (postDocs.empty) return []

  const postDocsWithAttachments: PostDocWithAttachments[] = await Promise.all(
    postDocs.docs.map(getPostDocWithAttachmentsFromPostDoc)
  )

  const postData = postDocsWithAttachments.map(mapPostDocToData)

  const postsPromise = postData.map(async postDataItem => {
    const [createdByUser, likedByUser, userIsWatching, reaction] =
      await Promise.all([
        checkIsCreatedByUser(postDataItem.slug, uid),
        checkIsLikedByUser(postDataItem.slug, uid),
        checkUserIsWatching(postDataItem.slug, uid),
        getPostReaction(postDataItem.slug, uid),
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

export default getHashtagPosts
