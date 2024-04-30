import { SWRConfig } from 'swr'

import {
  createPersonCacheKey,
  createPersonPostsSWRGetKey,
} from '../../utils/createCacheKeys'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer from '../../utils/data/sidebar/getSidebarDataServer'
import PersonPage from '../../components/PersonPage'
import { PersonPostsSortMode } from '../../types/PersonPostsSortMode'
import getPersonPostsServer from '../../utils/data/posts/getPersonPostsServer'
import getPersonServer from '../../utils/data/person/getPersonServer'
import getUidFromCookies from '../../utils/auth/getUidFromCookies'
import { GetServerSideProps } from 'next'
import { unstable_serialize } from 'swr/infinite'

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

  const personPostsCacheKey = createPersonPostsSWRGetKey({
    slug,
    sortMode: PersonPostsSortMode.Popular,
    uid,
  })

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
        [unstable_serialize(personPostsCacheKey)]: posts,
        ...sidebarFallbackData,
      },
      slug,
    },
  }
}

export default Person
