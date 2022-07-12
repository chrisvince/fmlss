import {
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import CategoriesPage from '../../components/CategoriesPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import type { CategoriesSortMode, Post } from '../../types'
import { createCategoriesCacheKey } from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
}

const Feed = ({ fallback }: PropTypes) => {
  return (
    <SWRConfig value={{ fallback }}>
      <CategoriesPage />
    </SWRConfig>
  )
}

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
}

const getServerSidePropsFn = async ({
  params: { sortMode: sortModeArray },
}: {
  params: { sortMode: string }
}) => {
  if (sortModeArray?.length > 1) {
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'popular'
  const sortMode = SORT_MODE_MAP[sortModeParam] as CategoriesSortMode

  if (!sortMode) {
    return { notFound: true }
  }

  const categoriesCacheKey = createCategoriesCacheKey(sortMode)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const categories = await getCategories({
    db: adminDb,
    sortMode,
  })

  // @ts-expect-error
  await admin.app().delete()

  return {
    props: {
      fallback: {
        [categoriesCacheKey]: categories,
      },
      key: categoriesCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Feed as any)
