import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import NotificationsPage from '../components/NotificationsPage'
import { createNotificationCacheKey } from '../utils/createCacheKeys'
import constants from '../constants'
import isInternalRequest from '../utils/isInternalRequest'
import getSidebarDataServer from '../utils/data/sidebar/getSidebarDataServer'
import PageSpinner from '../components/PageSpinner'
import getNotificationsServer from '../utils/data/notifications/getNotificationsServer'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL, NOTIFICATION_PAGINATION_COUNT } =
  constants

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

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ user, req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const uid = user?.id

  if (!uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const notificationsCacheKey = createNotificationCacheKey(uid, {
    limit: NOTIFICATION_PAGINATION_COUNT,
    pageIndex: 0,
  })

  const sidebarDataPromise = getSidebarDataServer()

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

  const [notifications, sidebarFallbackData] = await Promise.all([
    getNotificationsServer(uid),
    sidebarDataPromise,
  ])

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
})

export default withUser<Props>({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Feed)
