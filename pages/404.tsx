import { getFirebaseAdmin } from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import NotFoundPage from '../components/NotFoundPage'
import constants from '../constants'
import {
  createMiniCategoriesCacheKey,
  createMiniHashtagsCacheKey,
} from '../utils/createCacheKeys'
import getCategories from '../utils/data/categories/getCategories'
import getHashtags from '../utils/data/hashtags/getHashtags'
import msToSeconds from '../utils/msToSeconds'

const { CATEGORIES_ENABLED, MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

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
  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const miniCategoriesCacheKey = createMiniCategoriesCacheKey()

  const getMiniHashtags = () =>
    getHashtags({
      cacheKey: miniHashtagsCacheKey,
      cacheTime: MINI_LIST_CACHE_TIME,
      db: adminDb,
      limit: MINI_LIST_COUNT,
    })

  const getMiniCategories = () =>
    getCategories({
      cacheKey: miniCategoriesCacheKey,
      cacheTime: MINI_LIST_CACHE_TIME,
      db: adminDb,
      limit: MINI_LIST_COUNT,
    })

  const [miniHashtags, miniCategories] = await Promise.all([
    getMiniHashtags(),
    CATEGORIES_ENABLED ? getMiniCategories() : [],
  ])

  return {
    props: {
      fallback: {
        ...(CATEGORIES_ENABLED
          ? { [miniCategoriesCacheKey]: miniCategories }
          : {}),
        [miniHashtagsCacheKey]: miniHashtags,
      },
    },
    revalidate: msToSeconds(MINI_LIST_CACHE_TIME),
  }
}

export default NotFound
