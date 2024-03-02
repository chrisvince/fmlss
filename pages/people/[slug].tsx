import {
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import {
  createSidebarTopicsCacheKey,
  createSidebarHashtagsCacheKey,
  createPersonCacheKey,
  createPersonPostsCacheKey,
} from '../../utils/createCacheKeys'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'
import getPerson from '../../utils/data/person/getPerson'
import PersonPage from '../../components/PersonPage'
import getPersonPosts from '../../utils/data/posts/getPersonPosts'
import { PersonPostsSortMode } from '../../types/PersonPostsSortMode'

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  slug: string
}

const Person = ({ fallback, slug }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <PersonPage slug={slug} />
  </SWRConfig>
)

const getServerSidePropsFn = async ({
  params: { slug },
  req,
}: {
  params: { slug: string }
  req: NextApiRequest
}) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const personCacheKey = createPersonCacheKey(slug)
  const personPostsCacheKey = createPersonPostsCacheKey(slug)
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarTopicsCacheKey = createSidebarTopicsCacheKey()
  const sidebarDataPromise = fetchSidebarData({ db: adminDb })
  const getPersonPromise = getPerson(slug, { db: adminDb })

  if (isInternalRequest(req)) {
    const [person, { sidebarHashtags, sidebarTopics }] = await Promise.all([
      getPersonPromise,
      sidebarDataPromise,
    ])

    return {
      props: {
        fallback: {
          [personCacheKey]: person,
          [sidebarHashtagsCacheKey]: sidebarHashtags,
          [sidebarTopicsCacheKey]: sidebarTopics,
        },
        slug,
        key: personCacheKey,
      },
    }
  }

  const [person, posts, { sidebarHashtags, sidebarTopics }] = await Promise.all(
    [
      getPersonPromise,
      getPersonPosts(slug, {
        db: adminDb,
        sortMode: PersonPostsSortMode.Popular,
      }),
      sidebarDataPromise,
    ]
  )

  return {
    props: {
      fallback: {
        [personCacheKey]: person,
        [personPostsCacheKey]: posts,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [sidebarTopicsCacheKey]: sidebarTopics,
      },
      slug,
      key: personCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getServerSidePropsFn as any
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser()(Person as any)
