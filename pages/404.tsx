import { getFirebaseAdmin } from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import NotFoundPage from '../components/NotFoundPage'
import constants from '../constants'
import {
  createSidebarTopicsCacheKey,
  createSidebarHashtagsCacheKey,
} from '../utils/createCacheKeys'
import msToSeconds from '../utils/msToSeconds'
import fetchSidebarData from '../utils/data/sidebar/fetchSidebarData'

const { SIDEBAR_LIST_CACHE_TIME } = constants

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
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarTopicsCacheKey = createSidebarTopicsCacheKey()

  const { sidebarHashtags, sidebarTopics } = await fetchSidebarData({
    db: adminDb,
  })

  return {
    props: {
      fallback: {
        [sidebarTopicsCacheKey]: sidebarTopics,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
      },
    },
    revalidate: msToSeconds(SIDEBAR_LIST_CACHE_TIME),
  }
}

export default NotFound
