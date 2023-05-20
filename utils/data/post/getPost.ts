import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import constants from '../../../constants'
import { Post, PostData } from '../../../types'
import { createPostCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import isServer from '../../isServer'

const { POST_CACHE_TIME, POSTS_COLLECTION } = constants

type GetPost = (
  slug?: string | null,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    uid?: string | null
  }
) => Promise<Post | null>

const getPost: GetPost = async (slug, { db: dbProp, uid } = {}) => {
  if (!slug) return null

  const db = dbProp || firebase.firestore()

  let doc:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | null
  let data: PostData

  const postCacheKey = createPostCacheKey(slug)
  const cachedPostData = get(postCacheKey)

  if (isServer && cachedPostData) {
    data = cachedPostData
    doc = null
  } else {
    const postsRef = await db
      .collectionGroup(POSTS_COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (postsRef.empty) {
      return null
    }

    doc = postsRef.docs[0]
    data = mapPostDocToData(doc)
    put(postCacheKey, data, POST_CACHE_TIME)
  }

  if (!uid) {
    return {
      data,
      doc: !isServer ? doc : null,
    }
  }

  const supportingDataPromises = [
    checkIsCreatedByUser(data.slug, uid, { db }),
    checkIsLikedByUser(data.slug, uid, { db }),
  ]

  const [createdByUser, likedByUser] = await Promise.all(supportingDataPromises)

  return {
    data,
    doc: !isServer ? doc : null,
    user: {
      created: createdByUser,
      like: likedByUser,
    },
  }
}

export default getPost
