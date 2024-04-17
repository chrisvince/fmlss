import { Box } from '@mui/system'
import { List, useTheme } from '@mui/material'
import {
  AlternateEmailRounded,
  ChatOutlined,
  ChatRounded,
  FavoriteBorderOutlined,
  FavoriteRounded,
  NotificationsOutlined,
  NotificationsRounded,
  ReplyAllRounded,
  SettingsRounded,
  StarOutlineRounded,
  StarRounded,
  TagRounded,
  ViewStreamOutlined,
  ViewStreamRounded,
  WorkspacesRounded,
} from '@mui/icons-material'
import { useUser } from 'next-firebase-auth'

import NewPostButton from '../NewPostButton'
import constants from '../../constants'
import LeftNavigationListItem from '../LeftNavigaionListItem'

const {
  TOPICS_ENABLED,
  LEFT_NAVIGATION_PADDING_BOTTOM,
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
} = constants

const NAVIGATION_ITEMS = [
  {
    exact: true,
    href: '/feed',
    icon: ViewStreamOutlined,
    iconCurrent: ViewStreamRounded,
    label: 'Feed',
  },
  {
    href: '/popular',
    icon: StarOutlineRounded,
    iconCurrent: StarRounded,
    label: 'Popular',
  },
  {
    href: '/people',
    icon: AlternateEmailRounded,
    iconCurrent: AlternateEmailRounded,
    label: 'People',
  },
  ...(TOPICS_ENABLED
    ? [
        {
          currentPaths: ['/topics', '/topic'],
          href: '/topics',
          icon: WorkspacesRounded,
          iconCurrent: WorkspacesRounded,
          label: 'Topics',
        },
      ]
    : []),
  {
    currentPaths: ['/hashtags', '/hashtag'],
    href: '/hashtags',
    icon: TagRounded,
    label: 'Hashtags',
  },
  {
    href: '/likes',
    icon: FavoriteBorderOutlined,
    iconCurrent: FavoriteRounded,
    label: 'Likes',
  },
  {
    href: '/posts',
    icon: ChatOutlined,
    iconCurrent: ChatRounded,
    label: 'Posts',
  },
  {
    href: '/replies',
    icon: ReplyAllRounded,
    label: 'Replies',
  },
  {
    href: '/notifications',
    icon: NotificationsOutlined,
    iconCurrent: NotificationsRounded,
    label: 'Notifications',
  },
]

const LeftNavigationDesktop = () => {
  const { email, id: uid, displayName } = useUser()
  const theme = useTheme()
  const navMarginBottomSm = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)
  const marginBottom = theme.spacing(LEFT_NAVIGATION_PADDING_BOTTOM)

  return (
    <Box
      sx={{
        overflowY: 'auto',
        position: 'sticky',
        top: `calc(${TOP_NAVIGATION_HEIGHT} + ${navMarginBottomSm})`,
        height: `calc(100vh - ${TOP_NAVIGATION_HEIGHT} - ${navMarginBottomSm} - ${marginBottom})`,
      }}
    >
      <Box
        sx={{
          maxWidth: '250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Box>
          <NewPostButton />
          <nav>
            <List>
              {NAVIGATION_ITEMS.map(
                ({
                  currentPaths,
                  exact,
                  href,
                  icon: Icon,
                  iconCurrent,
                  label,
                }) => (
                  <LeftNavigationListItem
                    currentPaths={currentPaths}
                    exact={exact}
                    href={href}
                    icon={Icon}
                    iconCurrent={iconCurrent}
                    key={href}
                    primary={label}
                  />
                )
              )}
            </List>
          </nav>
        </Box>
        <Box>
          <nav>
            <List>
              <LeftNavigationListItem
                exact
                href={uid ? '/settings' : '/'}
                icon={SettingsRounded}
                iconCurrent={SettingsRounded}
                primary={uid ? 'Settings' : 'Sign in'}
                secondary={displayName ?? email}
              />
            </List>
          </nav>
        </Box>
      </Box>
    </Box>
  )
}

export default LeftNavigationDesktop
