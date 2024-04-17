import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import {
  createPersonCacheKey,
  createPersonPostsCacheKey,
} from '../../utils/createCacheKeys'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer from '../../utils/data/sidebar/getSidebarDataServer'
import PersonPage from '../../components/PersonPage'
import { PersonPostsSortMode } from '../../types/PersonPostsSortMode'
import PageSpinner from '../../components/PageSpinner'
import getPersonPostsServer from '../../utils/data/posts/getPersonPostsServer'
import getPersonServer from '../../utils/data/person/getPersonServer'

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

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ params, req, user }) => {
  const uid = user?.id

  if (!uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

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
})

export default withUser<Props>({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Person)
