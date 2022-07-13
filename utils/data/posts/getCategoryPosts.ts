import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import { CategorySortMode, FirebaseDoc, Post, PostData } from '../../../types'
import { createCategoryPostsCacheKey } from '../../createCacheKeys'
import mapPostDocToData from '../../mapPostDocToData'
import checkIsCreatedByUser from '../author/checkIsCreatedByUser'
import checkIsLikedByUser from '../author/checkIsLikedByUser'
import isServer from '../../isServer'

const {
  CATEGORY_LIST_CACHE_TIME,
  PAGINATION_COUNT,
  POSTS_COLLECTION,
} = constants

type GetCategoryPosts = (
  slug: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    startAfter?: FirebaseDoc
    uid?: string | null
    sortMode?: CategorySortMode
  }
) => Promise<Post[]>

const getCategoryPosts: GetCategoryPosts = async (
  slug,
  {
    db: dbProp,
    startAfter,
    uid,
    sortMode = 'latest',
  } = {},
) => {
  const db = dbProp || firebase.firestore()

  let postDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let postData: PostData[] = []

  const lowerCaseSlug = slug.toLowerCase()
  const categoryPostsCacheKey = createCategoryPostsCacheKey(
    lowerCaseSlug,
    sortMode
  )
  const cachedData = get(categoryPostsCacheKey)

  if (isServer && cachedData) {
    postData = cachedData
    postDocs = null
  } else {
    postDocs = await pipe(
      () =>
        db
          .collectionGroup(POSTS_COLLECTION)
          .where('category.slug', '==', lowerCaseSlug),
      query =>
        sortMode === 'popular' ? query.orderBy('viewCount', 'desc') : query,
      query =>
        sortMode === 'mostLikes' ? query.orderBy('likesCount', 'desc') : query,
      query => query.orderBy('createdAt', 'desc'),
      query => startAfter ? query.startAfter(startAfter) : query,
      query => query.limit(PAGINATION_COUNT).get()
    )()

    if (postDocs.empty) return []

    postData = postDocs.docs.map(doc => mapPostDocToData(doc))
    put(categoryPostsCacheKey, postData, CATEGORY_LIST_CACHE_TIME)
  }

  const postsPromise = postData.map(async (postDataItem, index) => {
    const postDoc = postDocs?.docs[index] ?? null

    if (!uid) {
      return {
        data: postDataItem,
        doc: !isServer ? postDoc : null,
      }
    }

    const supportingDataPromises = [
      checkIsCreatedByUser(postDataItem.slug, uid, { db }),
      checkIsLikedByUser(postDataItem.slug, uid, { db }),
    ]

    const [createdByUser, likedByUser] = await Promise.all(
      supportingDataPromises
    )

    return {
      data: postDataItem,
      doc: !isServer ? postDoc : null,
      user: {
        created: createdByUser,
        like: likedByUser,
      }
    }
  })
  const posts = await Promise.all(postsPromise)
  return posts
}

export default getCategoryPosts
