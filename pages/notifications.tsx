import { SWRConfig } from 'swr'
import NotificationsPage from '../components/NotificationsPage'
import { createNotificationsSWRGetKey } from '../utils/createCacheKeys'
import constants from '../constants'
import isInternalRequest from '../utils/isInternalRequest'
import getSidebarDataServer from '../utils/data/sidebar/getSidebarDataServer'
import getNotificationsServer from '../utils/data/notifications/getNotificationsServer'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../utils/auth/getUidFromCookies'
import { unstable_serialize } from 'swr/infinite'
import handleSWRError from '../utils/handleSWRError'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const Notifications = ({ fallback }: Props) => (
  <SWRConfig value={{ fallback, onError: handleSWRError }}>
    <NotificationsPage />
  </SWRConfig>
)

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const uid = await getUidFromCookies(req.cookies)

  if (!uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const notificationsCacheKey = createNotificationsSWRGetKey({ uid })
  const sidebarDataPromise = getSidebarDataServer()

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
      },
    }
  }

  const [notifications, sidebarFallbackData] = await Promise.all([
    getNotificationsServer(uid),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [unstable_serialize(notificationsCacheKey)]: [notifications],
      },
    },
  }
}

export default Notifications
