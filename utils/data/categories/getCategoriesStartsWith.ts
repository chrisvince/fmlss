import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import { CategoryData } from '../../../types'
import { createCategoriesStartsWithCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import isServer from '../../isServer'
import mapCategoryDocToData from '../../mapCategoryDocToData'
import slugify from '../../slugify'
import unslugify from '../../unslugify'

const {
  AUTOCOMPLETE_LENGTH,
  CATEGORIES_COLLECTION,
  CATEGORY_STARTS_WITH_CACHE_TIME,
} = constants

interface Options {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
}

const getCategoriesStartsWith = async (
  searchString: string,
  { db: dbProp }: Options = {}
) => {
  const db = dbProp || firebase.firestore()
  const searchStringSlug = slugify(searchString)
  const searchStringQuery = unslugify(searchStringSlug)
  const cacheKey = createCategoriesStartsWithCacheKey(searchStringSlug)

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
    categoryDocs = await db
      .collection(CATEGORIES_COLLECTION)
      .where('name', '>=', searchStringQuery)
      .where('name', '<=', searchStringQuery + '\uf8ff')
      .limit(AUTOCOMPLETE_LENGTH)
      .get()

    if (categoryDocs.empty) return []

    categoryData = categoryDocs.docs.map(doc => mapCategoryDocToData(doc))
    put(cacheKey, categoryData, CATEGORY_STARTS_WITH_CACHE_TIME)
  }

  const categories = categoryData.map((data, index) => ({
    data,
    doc: !isServer ? categoryDocs?.docs[index] ?? null : null,
  }))

  return categories
}

export default getCategoriesStartsWith
