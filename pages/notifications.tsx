import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import { NextApiRequest } from 'next'

import NotificationsPage from '../components/NotificationsPage'
import { createNotificationCacheKey } from '../utils/createCacheKeys'
import constants from '../constants'
import isInternalRequest from '../utils/isInternalRequest'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import fetchSidebarFallbackData from '../utils/data/sidebar/fetchSidebarData'
import getNotifications from '../utils/data/notifications/getNotifications'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL, NOTIFICATION_PAGINATION_COUNT } =
  constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const Feed = ({ fallback }: Props) => (
  <SWRConfig value={{ fallback }}>
    <NotificationsPage />
  </SWRConfig>
)

const getServerSidePropsFn = async ({
  AuthUser,
  req,
}: {
  AuthUser: AuthUser
  params: { sortMode: string }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id

  // @ts-expect-error: we know uid is defined
  const notificationsCacheKey = createNotificationCacheKey(uid, {
    limit: NOTIFICATION_PAGINATION_COUNT,
    pageIndex: 0,
  })

  const sidebarDataPromise = fetchSidebarFallbackData({ db: adminDb })

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        key: notificationsCacheKey,
      },
    }
  }

  const [notifications, sidebarFallbackData] = await Promise.all(
    // @ts-expect-error: we know uid is defined
    [getNotifications(uid, { db: adminDb }), sidebarDataPromise]
  )

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [notificationsCacheKey]: notifications,
      },
      key: notificationsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Feed as any)
