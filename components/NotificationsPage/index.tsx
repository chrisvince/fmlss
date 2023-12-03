import { MenuList } from '@mui/material'
import constants from '../../constants'
import useNotifications from '../../utils/data/notifications/useNotifications'
import Page from '../Page'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'
import NotificationsListItem, {
  NotificationListItemSize,
} from '../NotificationsListItem'
import { useMemo } from 'react'

const { TOPICS_ENABLED } = constants

const NotificationsPage = () => {
  const { notifications } = useNotifications()

  const hasUnreadNotifications = useMemo(
    () => notifications.some(notification => !notification.data.readAt),
    [notifications]
  )

  return (
    <Page
      pageTitle="Notifications"
      rightPanelChildren={
        <>
          <SidebarHashtagsSection />
          {TOPICS_ENABLED && <SidebarTopicsSection />}
        </>
      }
      renderPageTitle
    >
      <MenuList>
        {notifications.map(notification => (
          <NotificationsListItem
            createdAt={notification.data.createdAt}
            eventCount={notification.data.eventCount}
            key={notification.data.id}
            listHasUnreadNotifications={hasUnreadNotifications}
            multiLevelActivity={notification.data.multiLevelActivity}
            notificationType={notification.data.type}
            postBody={notification.data.targetPostBody}
            size={NotificationListItemSize.Large}
            slug={notification.data.targetPost.slug}
            unread={!notification.data.readAt}
          />
        ))}
      </MenuList>
    </Page>
  )
}

export default NotificationsPage
