import { NotificationsOutlined } from '@mui/icons-material'
import {
  Badge,
  IconButton,
  MenuList,
  Paper,
  Popover,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useRef, useState } from 'react'
import NotificationsListItem, {
  NotificationListItemSize,
} from '../NotificationsListItem'
import CaptionLink from '../CaptionLink'
import useNotifications from '../../utils/data/notifications/useNotifications'
import useHasUnreadNotifications from '../../utils/data/notifications/useHasUnreadNotifications'
import { NotificationType } from '../../types'

const NotificationsNavigationItem = () => {
  const notificationsButtonRef = useRef<HTMLButtonElement>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const handleNotificationsClose = () => setNotificationsOpen(false)
  const shouldLoadNotificationsRef = useRef(notificationsOpen)
  const { hasUnreadNotifications } = useHasUnreadNotifications()

  if (notificationsOpen && !shouldLoadNotificationsRef.current) {
    shouldLoadNotificationsRef.current = true
  }

  const handleNotificationsButtonClick = () =>
    setNotificationsOpen(current => !current)

  const { notifications, isLoading } = useNotifications({
    limit: 10,
    skip: !shouldLoadNotificationsRef.current,
  })

  return (
    <>
      <IconButton
        id="notifications-button"
        aria-label="Notifications"
        ref={notificationsButtonRef}
        onClick={handleNotificationsButtonClick}
        sx={{ padding: 0.7 }}
      >
        <Badge
          color="error"
          variant="dot"
          overlap="circular"
          sx={{
            '& .MuiBadge-dot': {
              width: '6px',
              height: '6px',
              minHeight: '6px',
              minWidth: '6px',
              top: '16%',
              right: '16%',
            },
          }}
          invisible={!hasUnreadNotifications}
        >
          <NotificationsOutlined />
        </Badge>
      </IconButton>
      <Popover
        anchorEl={notificationsButtonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handleNotificationsClose}
        open={notificationsOpen}
        sx={{ maxHeight: '300px' }}
      >
        <Paper
          sx={{
            width: '400px',
          }}
        >
          <Box sx={{ pt: 2, px: 2 }}>
            <Typography component="h2" variant="body2">
              Notifications
            </Typography>
          </Box>
          {notifications.length > 0 ? (
            <MenuList>
              {notifications.map(notification => {
                if (notification.data.type === NotificationType.Like) {
                  return (
                    <NotificationsListItem
                      createdAt={notification.data.createdAt}
                      eventCount={notification.data.eventCount}
                      listHasUnreadNotifications={hasUnreadNotifications}
                      notificationType={notification.data.type}
                      postBody={notification.data.targetPostBody}
                      size={NotificationListItemSize.Small}
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
                      size={NotificationListItemSize.Small}
                      slug={notification.data.targetPost.slug}
                      unread={!notification.data.readAt}
                      key={notification.data.id}
                    />
                  )
                }
              })}
            </MenuList>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                pb: 8,
                pt: 6,
              }}
            >
              <Typography variant="caption">
                {isLoading ? 'Loading...' : 'No notifications'}
              </Typography>
            </Box>
          )}
          {notifications.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                pb: 2,
              }}
            >
              <CaptionLink href="/notifications" color="secondary.main">
                View all
              </CaptionLink>
            </Box>
          )}
        </Paper>
      </Popover>
    </>
  )
}

export default NotificationsNavigationItem
