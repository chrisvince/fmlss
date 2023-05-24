import { getFirebaseAdmin } from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import NotFoundPage from '../components/NotFoundPage'
import constants from '../constants'
import {
  createSidebarCategoriesCacheKey,
  createSidebarHashtagsCacheKey,
} from '../utils/createCacheKeys'
import getCategories from '../utils/data/categories/getCategories'
import getHashtags from '../utils/data/hashtags/getHashtags'
import msToSeconds from '../utils/msToSeconds'

const { CATEGORIES_ENABLED, SIDEBAR_LIST_CACHE_TIME, SIDEBAR_LIST_COUNT } =
  constants

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const NotFound = ({ fallback }: Props) => (
  <SWRConfig value={{ fallback }}>
    <NotFoundPage />
  </SWRConfig>
)

export const getStaticProps = async () => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarCategoriesCacheKey = createSidebarCategoriesCacheKey()

  const getSidebarHashtags = () =>
    getHashtags({
      cacheKey: sidebarHashtagsCacheKey,
      cacheTime: SIDEBAR_LIST_CACHE_TIME,
      db: adminDb,
      limit: SIDEBAR_LIST_COUNT,
    })

  const getsidebarCategories = () =>
    getCategories({
      cacheKey: sidebarCategoriesCacheKey,
      cacheTime: SIDEBAR_LIST_CACHE_TIME,
      db: adminDb,
      limit: SIDEBAR_LIST_COUNT,
    })

  const [sidebarHashtags, sidebarCategories] = await Promise.all([
    getSidebarHashtags(),
    CATEGORIES_ENABLED ? getsidebarCategories() : [],
  ])

  return {
    props: {
      fallback: {
        ...(CATEGORIES_ENABLED
          ? { [sidebarCategoriesCacheKey]: sidebarCategories }
          : {}),
        [sidebarHashtagsCacheKey]: sidebarHashtags,
      },
    },
    revalidate: msToSeconds(SIDEBAR_LIST_CACHE_TIME),
  }
}

export default NotFound
