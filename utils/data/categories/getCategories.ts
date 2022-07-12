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

const firebaseDb = firebase.firestore()

const {
  CATEGORIES_CACHE_TIME,
  CATEGORIES_COLLECTION,
  PAGINATION_COUNT,
} = constants

type GetCategories = (
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    startAfter?: FirebaseDoc
    sortMode?: CategoriesSortMode
  }
) => Promise<Category[]>

const getCategories: GetCategories = async (
  {
    db = firebaseDb,
    startAfter,
    sortMode = 'popular'
  } = {},
) => {
  let categoryDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null
  let categoryData: CategoryData[] = []

  const categoriesCacheKey = createCategoriesCacheKey(sortMode)
  const cachedData = get(categoriesCacheKey)
  
  if (isServer && cachedData) {
    categoryData = cachedData
    categoryDocs = null
  } else {
    categoryDocs = await pipe(
      () => db.collection(CATEGORIES_COLLECTION),
      query =>
        sortMode === 'popular' ? query.orderBy('viewCount', 'desc') : query,
      query => query.orderBy('createdAt', 'desc'),
      query => startAfter ? query.startAfter(startAfter) : query,
      query => query.limit(PAGINATION_COUNT).get(),
    )()

    if (categoryDocs.empty) return []

    categoryData = categoryDocs.docs.map(doc => mapCategoryDocToData(doc))
    put(categoriesCacheKey, categoryData, CATEGORIES_CACHE_TIME)
  }

  const categories = categoryData.map((data, index) => ({
    data,
    doc: !isServer ? (categoryDocs?.docs[index] ?? null) : null,
  }))

  return categories
}

export default getCategories
