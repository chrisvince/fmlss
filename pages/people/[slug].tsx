import { SWRConfig } from 'swr'

import {
  createPersonCacheKey,
  createPersonPostsCacheKey,
} from '../../utils/createCacheKeys'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer from '../../utils/data/sidebar/getSidebarDataServer'
import PersonPage from '../../components/PersonPage'
import { PersonPostsSortMode } from '../../types/PersonPostsSortMode'
import getPersonPostsServer from '../../utils/data/posts/getPersonPostsServer'
import getPersonServer from '../../utils/data/person/getPersonServer'
import getUidFromCookies from '../../utils/auth/getUidFromCookies'
import { GetServerSideProps } from 'next'

interface Props {
  fallback: {
    [key: string]: unknown
  }
  slug: string
}

const Person = ({ fallback, slug }: Props) => (
  <SWRConfig value={{ fallback }}>
    <PersonPage slug={slug} />
  </SWRConfig>
)

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const uid = await getUidFromCookies(req.cookies)
  const slug = params?.slug as string
  const personCacheKey = createPersonCacheKey(slug)
  const personPostsCacheKey = createPersonPostsCacheKey(slug)
  const sidebarDataPromise = getSidebarDataServer()
  const getPersonPromise = getPersonServer(slug)

  if (isInternalRequest(req)) {
    const [person, sidebarFallbackData] = await Promise.all([
      getPersonPromise,
      sidebarDataPromise,
    ])

    return {
      props: {
        fallback: {
          [personCacheKey]: person,
          ...sidebarFallbackData,
        },
        slug,
        key: personCacheKey,
      },
    }
  }

  const [person, posts, sidebarFallbackData] = await Promise.all([
    getPersonPromise,
    getPersonPostsServer(slug, {
      sortMode: PersonPostsSortMode.Popular,
      uid,
    }),
    sidebarDataPromise,
  ])

  return {
    props: {
      fallback: {
        [personCacheKey]: person,
        [personPostsCacheKey]: posts,
        ...sidebarFallbackData,
      },
      slug,
      key: personCacheKey,
    },
  }
}

export default Person
