import { SWRConfig } from 'swr'
import NotFoundPage from '../components/NotFoundPage'
import constants from '../constants'
import msToSeconds from '../utils/msToSeconds'
import getSidebarDataServer from '../utils/data/sidebar/getSidebarDataServer'
import handleSWRError from '../utils/handleSWRError'

const { SIDEBAR_LIST_CACHE_TIME } = constants

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const NotFound = ({ fallback }: Props) => (
  <SWRConfig value={{ fallback, onError: handleSWRError }}>
    <NotFoundPage />
  </SWRConfig>
)

export const getStaticProps = async () => {
  try {
    const sidebarFallbackData = await getSidebarDataServer()

    return {
      props: {
        fallback: sidebarFallbackData,
      },
      revalidate: msToSeconds(SIDEBAR_LIST_CACHE_TIME),
    }
  } catch (error) {
    console.error('Error fetching sidebar data:', error)
  }
}

export default NotFound
