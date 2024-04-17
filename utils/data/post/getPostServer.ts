import { get, put } from '../../serverCache'
import constants from '../../../constants'
import { Post, PostData } from '../../../types'
import { createPostCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import isServer from '../../isServer'
import checkUserIsWatching from '../author/checkUserIsWatching'
import getPostDocWithAttachmentsFromPostDoc from '../postAttachment/getPostDocWithAttachmentsFromPostDoc'
import getPostReaction from '../author/getPostReaction'
import initFirebaseAdmin from '../../initFirebaseAdmin'
import checkIsCreatedByUserServer from '../author/checkIsCreatedByUserServer'
import checkIsLikedByUserServer from '../author/checkIsLikedByUserServer'
import checkUserIsWatchingServer from '../author/checkUserIsWatchingServer'
import getPostReactionServer from '../author/getPostReactionServer'

const { POST_CACHE_TIME, POSTS_COLLECTION } = constants

const getPostServer = async (
  slug: string,
  {
    uid,
  }: {
    uid?: string | null
  } = {}
): Promise<Post | null> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let data: PostData
  const postCacheKey = createPostCacheKey(slug)
  const cachedPostData = get(postCacheKey)

  if (cachedPostData) {
    data = cachedPostData
  } else {
    const postsRef = await db
      .collectionGroup(POSTS_COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (postsRef.empty) {
      return null
    }

    const postDocWithAttachments = await getPostDocWithAttachmentsFromPostDoc(
      postsRef.docs[0]
    )

    data = mapPostDocToData(postDocWithAttachments)
    put(postCacheKey, data, POST_CACHE_TIME)
  }

  if (!uid) {
    return { data }
  }

  const [createdByUser, likedByUser, userIsWatching, reaction] =
    await Promise.all([
      checkIsCreatedByUserServer(data.slug, uid),
      checkIsLikedByUserServer(data.slug, uid),
      checkUserIsWatchingServer(data.slug, uid),
      getPostReactionServer(data.slug, uid),
    ])

  return {
    data,
    user: {
      created: createdByUser,
      like: likedByUser,
      reaction,
      watching: userIsWatching,
    },
  }
}

export default getPostServer
