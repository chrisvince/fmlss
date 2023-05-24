import constants from '../../../constants'
import {
  createSidebarCategoriesCacheKey,
  createSidebarHashtagsCacheKey,
} from '../../createCacheKeys'
import getCategories from '../categories/getCategories'
import getHashtags from '../hashtags/getHashtags'
import firebase from 'firebase/app'

const { CATEGORIES_ENABLED, SIDEBAR_LIST_CACHE_TIME, SIDEBAR_LIST_COUNT } =
  constants

export enum SidebarResourceKey {
  HASHTAGS = 'hashtags',
  CATEGORIES = 'categories',
}

const fetchSidebarData = async ({
  db,
  exclude = [],
}: {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  exclude?: (SidebarResourceKey.HASHTAGS | SidebarResourceKey.CATEGORIES)[]
}) => {
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarCategoriesCacheKey = createSidebarCategoriesCacheKey()

  const getSidebarHashtags = () =>
    getHashtags({
      cacheKey: sidebarHashtagsCacheKey,
      cacheTime: SIDEBAR_LIST_CACHE_TIME,
      db,
      limit: SIDEBAR_LIST_COUNT,
    })

  const getSidebarCategories = () =>
    getCategories({
      cacheKey: sidebarCategoriesCacheKey,
      cacheTime: SIDEBAR_LIST_CACHE_TIME,
      db,
      limit: SIDEBAR_LIST_COUNT,
    })

  const [sidebarHashtags, sidebarCategories] = await Promise.all([
    exclude.includes(SidebarResourceKey.HASHTAGS) ? [] : getSidebarHashtags(),
    exclude.includes(SidebarResourceKey.CATEGORIES) || !CATEGORIES_ENABLED
      ? []
      : getSidebarCategories(),
  ])

  return {
    sidebarHashtags,
    sidebarCategories,
  }
}

export default fetchSidebarData
