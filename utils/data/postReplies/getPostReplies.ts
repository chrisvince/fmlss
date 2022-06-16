import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { Post, PostData } from '../../../types'
import constants from '../../../constants'
import mapPostDocToData from '../../mapPostDocToData'

const firebaseDb = firebase.firestore()
const isServer = typeof window === 'undefined'
const {
  AUTHORED_POSTS_COLLECTION,
  PAGINATION_COUNT,
  REPLIES_CACHE_TIME,
  USERS_COLLECTION,
} = constants

type GetPostReplies = (
  reference: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    uid?: string | null
  }
) => Promise<Post[]>

const getPostReplies: GetPostReplies = async (
  reference,
  {
    db = firebaseDb,
    uid,
  } = {},
) => {
  let replyDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let replyData: PostData[] = []

  const cacheKey = `${reference}/posts`
  const collection = `${reference}/posts`
  const cachedData = get(cacheKey)

  if (isServer && cachedData) {
    replyData = cachedData
    replyDocs = null
  } else {
    replyDocs = await db
      .collection(collection)
      .orderBy('createdAt')
      .limit(PAGINATION_COUNT)
      .get()
    replyData = replyDocs.docs.map(doc => mapPostDocToData(doc))

    const cacheTime =
      replyData.length < PAGINATION_COUNT ? REPLIES_CACHE_TIME : undefined

    put(cacheKey, replyData, cacheTime)
  }

  const repliesPromise = replyData.map(async (replyDataItem, index) => {
    const replyDoc = replyDocs?.docs[index] ?? null

    if (!uid) {
      return {
        createdByUser: false,
        data: replyDataItem,
        doc: !isServer ? replyDoc : null,
      }
    }

    const authoredPostsRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .where('originId', '==', replyDataItem.id)
      .limit(1)
      .get()

    const createdByUser = !authoredPostsRef.empty

    return {
      createdByUser,
      data: replyDataItem,
      doc: !isServer ? replyDoc : null,
    }
  })
  const replies = await Promise.all(repliesPromise)

  return replies
}

export default getPostReplies
