import { CellMeasurerCache } from 'react-virtualized'
import { useMemo, useRef } from 'react'

import { Notification, NotificationType } from '../../types'
import CenteredMessage from '../CenteredMessage'
import ContentList from '../ContentList'
import constants from '../../constants'
import NotificationsListItem, {
  NotificationListItemSize,
} from '../NotificationsListItem'
import PageSpinner from '../PageSpinner'

const { CELL_CACHE_MEASURER_NOTIFICATION_ITEM_MIN_HEIGHT } = constants

type Props = {
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => Promise<unknown>
  notifications: Notification[]
}

const NotificationsList = ({
  isLoading,
  moreToLoad,
  onLoadMore,
  notifications,
}: Props) => {
  const cellMeasurerCache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: CELL_CACHE_MEASURER_NOTIFICATION_ITEM_MIN_HEIGHT,
    })
  )

  const hasUnreadNotifications = useMemo(
    () => notifications.some(notification => !notification.data.readAt),
    [notifications]
  )

  return notifications.length === 0 && isLoading ? (
    <PageSpinner />
  ) : notifications.length > 0 ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache.current}
      items={notifications}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
    >
      {untypedNotification => {
        const notification = untypedNotification as Notification
        if (notification.data.type === NotificationType.Like) {
          return (
            <NotificationsListItem
              createdAt={notification.data.createdAt}
              eventCount={notification.data.eventCount}
              listHasUnreadNotifications={hasUnreadNotifications}
              notificationType={notification.data.type}
              postBody={notification.data.targetPostBody}
              size={NotificationListItemSize.Large}
              slug={notification.data.targetPost.slug}
              unread={!notification.data.readAt}
              key={notification.data.id}
            />
          )
        }

        if (notification.data.type === NotificationType.Reply) {
          return (
            <NotificationsListItem
              createdAt={notification.data.createdAt}
              eventCount={notification.data.eventCount}
              listHasUnreadNotifications={hasUnreadNotifications}
              multiLevelActivity={notification.data.multiLevelActivity}
              notificationType={notification.data.type}
              postBody={notification.data.targetPostBody}
              size={NotificationListItemSize.Large}
              slug={notification.data.targetPost.slug}
              unread={!notification.data.readAt}
              key={notification.data.id}
            />
          )
        }
      }}
    </ContentList>
  ) : (
    <CenteredMessage>No notifications.</CenteredMessage>
  )
}

export default NotificationsList
