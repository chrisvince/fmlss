import { pipe } from 'ramda'

import constants from '../../../constants'
import { FirebaseDoc, PostDocWithAttachments } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'
import { PersonPostsSortMode } from '../../../types/PersonPostsSortMode'
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

const getPersonPosts = async (
  slug: string,
  {
    sortMode = PersonPostsSortMode.Popular,
    startAfter: startAfterProp,
    uid,
  }: {
    sortMode?: PersonPostsSortMode
    startAfter?: FirebaseDoc
    uid: string
  }
) => {
  const db = getFirestore()
  const lowerCaseSlug = slug.toLowerCase()

  const collectionGroupRef = collectionGroup(db, POSTS_COLLECTION)

  const dbRef = pipe(
    ref => query(ref, where('peopleSlugs', 'array-contains', lowerCaseSlug)),
    ref =>
      sortMode === PersonPostsSortMode.Popular
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

export default getPersonPosts
