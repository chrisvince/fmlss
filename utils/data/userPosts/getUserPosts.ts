import constants from '../../../constants'
import { AuthorRequest, Post, PostTypeQuery } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
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
import mapAuthorDocToData from '../../mapAuthorDocToData'

const { AUTHORS_COLLECTION, POST_PAGINATION_COUNT } = constants

const getUserPosts = async (
  uid: string,
  {
    startAfter: startAfterProp,
    type = PostTypeQuery.Post,
  }: {
    startAfter?: Post | null
    type?: PostTypeQuery
  }
): Promise<Post[]> => {
  const db = getFirestore()
  const typeIsBoth = type === PostTypeQuery.Both

  if (startAfterProp && !startAfterProp.author) {
    throw new Error('startAfterProp must have an author property')
  }

  const queryElements = [
    where('uid', '==', uid),
    !typeIsBoth && where('post.type', '==', type),
    orderBy('createdAt', 'desc'),
    startAfterProp &&
      startAfterProp.author &&
      startAfter(Timestamp.fromMillis(startAfterProp.author.createdAt)),
    limit(POST_PAGINATION_COUNT),
  ].filter(Boolean) as QueryConstraint[]

  const dbRef = query(collectionGroup(db, AUTHORS_COLLECTION), ...queryElements)
  const authorDocs = await getDocs(dbRef)
  if (authorDocs.empty) return []

  const posts = await Promise.all(
    authorDocs.docs.map(async authorDoc => {
      const authorDocData = authorDoc.data() as AuthorRequest
      const authorData = mapAuthorDocToData(authorDoc)
      const postDoc = await getDoc(authorDocData.post.ref)

      const postWithAttachments = await getPostDocWithAttachmentsFromPostDoc(
        postDoc
      )

      const postData = mapPostDocToData(postWithAttachments)

      const [likedByUser, userIsWatching, reaction] = await Promise.all([
        checkIsLikedByUser(postData.slug, uid),
        checkUserIsWatching(postData.slug, uid),
        getPostReaction(postData.slug, uid),
      ])

      return {
        author: authorData,
        data: postData,
        user: {
          created: true,
          like: likedByUser,
          reaction,
          watching: userIsWatching,
        },
      }
    })
  )

  return posts
}

export default getUserPosts
