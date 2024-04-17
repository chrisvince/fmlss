import constants from '../../../constants'
import { Post } from '../../../types'
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
  query,
  where,
} from 'firebase/firestore'

const { POSTS_COLLECTION } = constants

const getPost = async (
  slug: string,
  {
    uid,
  }: {
    uid?: string | null
  } = {}
): Promise<Post | null> => {
  const db = getFirestore()
  const collectionGroupRef = collectionGroup(db, POSTS_COLLECTION)
  const dbRef = query(collectionGroupRef, where('slug', '==', slug), limit(1))
  const postsRef = await getDocs(dbRef)

  if (postsRef.empty) {
    return null
  }

  const postDocWithAttachments = await getPostDocWithAttachmentsFromPostDoc(
    postsRef.docs[0]
  )

  const data = mapPostDocToData(postDocWithAttachments)

  if (!uid) {
    return { data }
  }

  const [createdByUser, likedByUser, userIsWatching, reaction] =
    await Promise.all([
      checkIsCreatedByUser(data.slug, uid),
      checkIsLikedByUser(data.slug, uid),
      checkUserIsWatching(data.slug, uid),
      getPostReaction(data.slug, uid),
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

export default getPost
