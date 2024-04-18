import { SWRConfig } from 'swr'
import HashtagPage from '../../components/HashtagPage'
import { HashtagSortMode } from '../../types'
import { createHashtagPostsCacheKey } from '../../utils/createCacheKeys'
import { HashtagShowType } from '../../utils/data/posts/getHashtagPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer from '../../utils/data/sidebar/getSidebarDataServer'
import getHashtagPostsServer from '../../utils/data/posts/getHashtagPostsServer'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../../utils/auth/getUidFromCookies'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const DEFAULT_POST_TYPE = HashtagShowType.Post

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  slug: string
}

const Hashtag = ({ fallback, slug }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <HashtagPage slug={slug} />
  </SWRConfig>
)

const SORT_MODE_MAP: {
  [key: string]: HashtagSortMode
} = {
  [HashtagSortMode.Latest]: HashtagSortMode.Latest,
  [HashtagSortMode.Popular]: HashtagSortMode.Popular,
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  req,
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const slug = params?.slug as string
  const sort = (query?.sort as string | undefined) ?? HashtagSortMode.Popular
  const uid = await getUidFromCookies(req.cookies)

  const sortMode = (SORT_MODE_MAP[sort] ??
    HashtagSortMode.Popular) as HashtagSortMode

  const hashtagPostsCacheKey = createHashtagPostsCacheKey(
    slug,
    DEFAULT_POST_TYPE,
    sortMode
  )

  const sidebarDataPromise = getSidebarDataServer()

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        slug,
        key: hashtagPostsCacheKey,
      },
    }
  }

  const [posts, sidebarFallbackData] = await Promise.all([
    getHashtagPostsServer(slug, {
      uid,
      showType: DEFAULT_POST_TYPE,
      sortMode,
    }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [hashtagPostsCacheKey]: posts,
      },
      slug,
      key: hashtagPostsCacheKey,
    },
  }
}

export default Hashtag
