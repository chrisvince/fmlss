import { FiberManualRecordRounded } from '@mui/icons-material'
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
  Link as MuiLink,
} from '@mui/material'
import { Box } from '@mui/system'
import { NotificationData, NotificationType } from '../../types'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const TIME_SET_INTERVAL = 60_000

const resolveActionText = (
  notificationType: NotificationType,
  eventCount: number,
  multiLevelActivity: boolean,
  isOwnPost: boolean
) => {
  const formattedEventCount = eventCount > 99 ? '99+' : eventCount

  if (multiLevelActivity) {
    return `${isOwnPost ? 'Your post' : 'A post your watching'} has activity`
  }

  switch (notificationType) {
    case NotificationType.Like: {
      const commonText = 'liked your post'
      if (eventCount > 1) return `${formattedEventCount} people ${commonText}`
      return `Someone ${commonText}`
    }

    case NotificationType.Reply: {
      const commonText = `replied to ${
        isOwnPost ? 'your post' : 'a post your watching'
      }`
      if (eventCount > 1) return `${formattedEventCount} people ${commonText}`
      return `Someone ${commonText}`
    }
  }
}

const calculateTime = (createdAt: number) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const date = new Date() - new Date(createdAt)
  const timeInSeconds = Math.floor(date / 1000)
  const timeInMinutes = Math.floor(timeInSeconds / 60)
  const timeInHours = Math.floor(timeInMinutes / 60)
  const timeInDays = Math.floor(timeInHours / 24)
  const timeInWeeks = Math.floor(timeInDays / 7)
  const timeInMonths = Math.floor(timeInWeeks / 4)
  const timeInYears = Math.floor(timeInMonths / 12)

  if (timeInSeconds < 60) return `${timeInSeconds}s`
  if (timeInMinutes < 60) return `${timeInMinutes}m`
  if (timeInHours < 24) return `${timeInHours}h`
  if (timeInDays < 7) return `${timeInDays}d`
  if (timeInWeeks < 4) return `${timeInWeeks}w`
  if (timeInMonths < 12) return `${timeInMonths}m`
  return `${timeInYears}y`
}

export enum NotificationListItemSize {
  Small = 'small',
  Large = 'large',
}

interface Props {
  listHasUnreadNotifications?: boolean
  size?: NotificationListItemSize
  notification: NotificationData
}

const NotificationsListItem = ({
  listHasUnreadNotifications = false,
  notification,
  size = NotificationListItemSize.Small,
}: Props) => {
  const [time, setTime] = useState(calculateTime(notification.createdAt))
  const timerRef = useRef<NodeJS.Timer>()

  useEffect(() => {
    const timerRefCurrent = timerRef.current
    const calcAndSetTime = () => setTime(calculateTime(notification.createdAt))

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(calcAndSetTime, TIME_SET_INTERVAL)

    const handleWindowFocus = () => {
      calcAndSetTime()
      clearInterval(timerRef.current)
      timerRef.current = setInterval(calcAndSetTime, TIME_SET_INTERVAL)
    }

    const handleWindowBlur = () => {
      clearInterval(timerRef.current)
    }

    addEventListener('focus', handleWindowFocus)
    addEventListener('blur', handleWindowBlur)

    return () => {
      removeEventListener('focus', handleWindowFocus)
      removeEventListener('blur', handleWindowBlur)
      clearInterval(timerRefCurrent)
    }
  }, [notification.createdAt])

  const textVariant = {
    [NotificationListItemSize.Small]: 'caption',
    [NotificationListItemSize.Large]: 'body2',
  }[size] as 'caption' | 'body2'

  const py = {
    [NotificationListItemSize.Small]: undefined,
    [NotificationListItemSize.Large]: '12px',
  }[size]

  const lineClampNumber = {
    [NotificationListItemSize.Small]: 2,
    [NotificationListItemSize.Large]: 3,
  }[size]

  return (
    <MenuItem
      sx={{
        ...(size === NotificationListItemSize.Large
          ? {
              borderBottom: '1px solid',
              borderBottomColor: 'divider',
            }
          : {}),
        py,
        '& .MuiListItemIcon-root': { minWidth: '20px' },
      }}
    >
      <MuiLink
        component={Link}
        href={`/post/${notification.targetPost.slug}`}
        sx={{ display: 'contents' }}
      >
        {(listHasUnreadNotifications || !notification.readAt) && (
          <ListItemIcon>
            {!notification.readAt && (
              <FiberManualRecordRounded
                sx={{ height: '8px', width: '8px' }}
                color="info"
              />
            )}
          </ListItemIcon>
        )}
        <ListItemText
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          disableTypography
        >
          <Typography
            component="div"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: lineClampNumber,
              whiteSpace: 'normal',
            }}
            variant={textVariant}
          >
            <Box component="b" sx={{ fontWeight: 500 }}>
              {resolveActionText(
                notification.type,
                notification.eventCount,
                notification.type === NotificationType.Reply
                  ? notification.multiLevelActivity
                  : false,
                notification.type === NotificationType.Reply
                  ? notification.isOwnPost
                  : false
              )}
            </Box>
            :{' '}
            <Box component="span" sx={{ fontWeight: 400 }}>
              {notification.targetPostBody}
            </Box>
          </Typography>
          <Typography
            component="div"
            variant={textVariant}
            sx={{ fontWeight: 500 }}
          >
            {time}
          </Typography>
        </ListItemText>
      </MuiLink>
    </MenuItem>
  )
}

export default NotificationsListItem
