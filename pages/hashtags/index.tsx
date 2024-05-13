import { SWRConfig } from 'swr'

import HashtagsPage from '../../components/HashtagsPage'
import { HashtagsSortMode } from '../../types'
import { createHashtagSWRGetKey } from '../../utils/createCacheKeys'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer, {
  SidebarResourceKey,
} from '../../utils/data/sidebar/getSidebarDataServer'
import getHashtagsServer from '../../utils/data/hashtags/getHashtagsServer'
import { GetServerSideProps } from 'next'
import { unstable_serialize } from 'swr/infinite'
import handleSWRError from '../../utils/handleSWRError'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Hashtags = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback, onError: handleSWRError }}>
    <HashtagsPage />
  </SWRConfig>
)

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const hashtagsCacheKey = createHashtagSWRGetKey({
    sortMode: HashtagsSortMode.Popular,
  })

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
    getHashtagsServer({ sortMode: HashtagsSortMode.Popular }),
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
