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
import { MenuList } from '@mui/material'

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
    <MenuList sx={{ padding: 0 }}>
      <ContentList
        cellMeasurerCache={cellMeasurerCache.current}
        items={notifications}
        moreToLoad={moreToLoad}
        onLoadMore={onLoadMore}
      >
        {untypedNotification => {
          const notification = untypedNotification as Notification

          return (
            <NotificationsListItem
              key={notification.data.id}
              listHasUnreadNotifications={hasUnreadNotifications}
              notification={notification.data}
              size={NotificationListItemSize.Large}
            />
          )
        }}
      </ContentList>
    </MenuList>
  ) : (
    <CenteredMessage>No notifications.</CenteredMessage>
  )
}

export default NotificationsList
