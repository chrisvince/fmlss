import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import constants from '../../../constants'
import { Category, CategoryData } from '../../../types'
import { createCategoryCacheKey } from '../../createCacheKeys'
import mapCategoryDocToData from '../../mapCategoryDocToData'
import isServer from '../../isServer'

const { CATEGORIES_COLLECTION, CATEGORY_CACHE_TIME } = constants

type GetCategory = (
  slug: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    uid?: string | null
  }
) => Promise<Category | null>

const getCategory: GetCategory = async (slug, { db: dbProp } = {}) => {
  const db = dbProp || firebase.firestore()

  let doc:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | null
  let data: CategoryData

  const categoryCacheKey = createCategoryCacheKey(slug)
  const cachedData = get(categoryCacheKey)

  if (isServer && cachedData) {
    data = cachedData
    doc = null
  } else {
    const categoriesRef = await db
      .collection(CATEGORIES_COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (categoriesRef.empty) {
      throw new Error('Category not found')
    }

    doc = categoriesRef.docs[0]
    data = mapCategoryDocToData(doc)
    put(categoryCacheKey, data, CATEGORY_CACHE_TIME)
  }

  return {
    data: data,
    doc: !isServer ? doc : null,
  }
}

export default getCategory
