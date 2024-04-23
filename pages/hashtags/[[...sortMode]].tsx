import { SWRConfig } from 'swr'

import HashtagsPage from '../../components/HashtagsPage'
import type { HashtagsSortMode } from '../../types'
import { createHashtagSWRGetKey } from '../../utils/createCacheKeys'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer, {
  SidebarResourceKey,
} from '../../utils/data/sidebar/getSidebarDataServer'
import getHashtagsServer from '../../utils/data/hashtags/getHashtagsServer'
import { GetServerSideProps } from 'next'
import { unstable_serialize } from 'swr/infinite'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Hashtags = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <HashtagsPage />
  </SWRConfig>
)

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const sortModeArray = (params?.sortModeArray as string[] | undefined) ?? []

  if (sortModeArray?.length > 1) {
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'popular'
  const sortMode = SORT_MODE_MAP[sortModeParam] as HashtagsSortMode

  if (!sortMode) {
    return { notFound: true }
  }

  const hashtagsCacheKey = createHashtagSWRGetKey({ sortMode })

  const sidebarDataPromise = getSidebarDataServer({
    exclude: [SidebarResourceKey.Hashtags],
  })

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
      },
    }
  }

  const [hashtags, sidebarFallbackData] = await Promise.all([
    getHashtagsServer({ sortMode }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [unstable_serialize(hashtagsCacheKey)]: [hashtags],
      },
    },
  }
}

export default Hashtags
