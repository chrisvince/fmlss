import { getFirebaseAdmin } from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import NotFoundPage from '../components/NotFoundPage'
import constants from '../constants'
import msToSeconds from '../utils/msToSeconds'
import fetchSidebarFallbackData from '../utils/data/sidebar/fetchSidebarData'

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

  const sidebarFallbackData = await fetchSidebarFallbackData({
    db: adminDb,
  })

  return {
    props: {
      fallback: sidebarFallbackData,
    },
    revalidate: msToSeconds(SIDEBAR_LIST_CACHE_TIME),
  }
}

export default NotFound
