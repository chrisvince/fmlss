import {
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import getPeople from '../../utils/data/people/getPeople'
import {
  createPeopleCacheKey,
  createSidebarHashtagsCacheKey,
  createSidebarTopicsCacheKey,
} from '../../utils/createCacheKeys'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'
import { SWRConfig } from 'swr'
import PeoplePage from '../../components/PeoplePage'
import { NextApiRequest } from 'next'
import isInternalRequest from '../../utils/isInternalRequest'

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const PeopleIndex = ({ fallback }: Props) => {
  return (
    <SWRConfig value={{ fallback }}>
      <PeoplePage />
    </SWRConfig>
  )
}

const getServerSidePropsFn = async ({ req }: { req: NextApiRequest }) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const peopleCacheKey = createPeopleCacheKey()
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarTopicsCacheKey = createSidebarTopicsCacheKey()
  const sidebarDataPromise = fetchSidebarData({ db: adminDb })

  if (isInternalRequest(req)) {
    const { sidebarHashtags, sidebarTopics } = await sidebarDataPromise

    return {
      props: {
        fallback: {
          [sidebarHashtagsCacheKey]: sidebarHashtags,
          [sidebarTopicsCacheKey]: sidebarTopics,
        },
        key: peopleCacheKey,
      },
    }
  }

  const [people, { sidebarHashtags, sidebarTopics }] = await Promise.all([
    getPeople({ db: adminDb }),
    sidebarDataPromise,
  ])

  return {
    props: {
      fallback: {
        [peopleCacheKey]: people,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [sidebarTopicsCacheKey]: sidebarTopics,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getServerSidePropsFn as any
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser()(PeopleIndex as any)
