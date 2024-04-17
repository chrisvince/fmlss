import firebase from 'firebase/app'

import { get, put } from '../../serverCache'
import { pipe } from 'ramda'

import {
  FirebaseDoc,
  Post,
  PostData,
  PostDocWithAttachments,
} from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'
import { createPostRepliesCacheKey } from '../../createCacheKeys'
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
  startAfter,
} from 'firebase/firestore'

const { POST_PAGINATION_COUNT, REPLIES_CACHE_TIME } = constants

const getPostReplies = async (
  reference: string,
  slug: string,
  {
    startAfter: startAfterProp,
    uid,
    viewMode = 'start',
  }: {
    startAfter?: FirebaseDoc
    uid?: string | null
    viewMode?: 'start' | 'end'
  } = {}
): Promise<Post[]> => {
  const db = getFirestore()
  const collectionPath = `${reference}/posts`
  const collectionRef = collection(db, collectionPath)

  const dbRef = pipe(
    ref =>
      query(ref, orderBy('createdAt', viewMode === 'end' ? 'desc' : 'asc')),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(POST_PAGINATION_COUNT))
  )(collectionRef)

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
