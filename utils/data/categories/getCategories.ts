import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import { pipe } from 'ramda'

import constants from '../../../constants'
import {
  CategoriesSortMode,
  Category,
  CategoryData,
  FirebaseDoc,
} from '../../../types'
import { createCategoriesCacheKey } from '../../createCacheKeys'
import mapCategoryDocToData from '../../mapCategoryDocToData'
import isServer from '../../isServer'

const { CATEGORIES_CACHE_TIME, CATEGORIES_COLLECTION, PAGINATION_COUNT } =
  constants

type GetCategories = (options?: {
  cacheKey?: string
  cacheTime?: number
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  limit?: number
  sortMode?: CategoriesSortMode
  startAfter?: FirebaseDoc
}) => Promise<Category[]>

const getCategories: GetCategories = async ({
  sortMode = 'popular',
  cacheKey = createCategoriesCacheKey(sortMode),
  cacheTime = CATEGORIES_CACHE_TIME,
  db: dbProp,
  limit = PAGINATION_COUNT,
  startAfter,
} = {}) => {
  const db = dbProp || firebase.firestore()

  let categoryDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let categoryData: CategoryData[] = []

  const cachedData = get(cacheKey)

  if (isServer && cachedData) {
    categoryData = cachedData
    categoryDocs = null
  } else {
    categoryDocs = await pipe(
      () => db.collection(CATEGORIES_COLLECTION),
      query =>
        sortMode === 'popular'
          ? query.orderBy('recentViewCount', 'desc')
          : query,
      query => query.orderBy('createdAt', 'desc'),
      query => (startAfter ? query.startAfter(startAfter) : query),
      query => query.limit(limit).get()
    )()

    if (categoryDocs.empty) return []

    categoryData = categoryDocs.docs.map(doc => mapCategoryDocToData(doc))
    put(cacheKey, categoryData, cacheTime)
  }

  const categories = categoryData.map((data, index) => ({
    data,
    doc: !isServer ? categoryDocs?.docs[index] ?? null : null,
  }))

  return categories
}

export default getCategories
