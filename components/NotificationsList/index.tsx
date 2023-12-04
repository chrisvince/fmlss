import { CellMeasurerCache } from 'react-virtualized'
import { useMemo, useRef } from 'react'

import { Notification } from '../../types'
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

  return isLoading ? (
    <PageSpinner />
  ) : notifications.length ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache.current}
      items={notifications}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
    >
      {notification => (
        <NotificationsListItem
          createdAt={(notification as Notification).data.createdAt}
          eventCount={(notification as Notification).data.eventCount}
          listHasUnreadNotifications={hasUnreadNotifications}
          multiLevelActivity={
            (notification as Notification).data.multiLevelActivity
          }
          notificationType={(notification as Notification).data.type}
          postBody={(notification as Notification).data.targetPostBody}
          size={NotificationListItemSize.Large}
          slug={(notification as Notification).data.targetPost.slug}
          unread={!(notification as Notification).data.readAt}
          key={(notification as Notification).data.id}
        />
      )}
    </ContentList>
  ) : (
    <CenteredMessage>No notifications.</CenteredMessage>
  )
}

export default NotificationsList
