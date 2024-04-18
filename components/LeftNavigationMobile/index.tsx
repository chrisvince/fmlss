import { Box, List, SwipeableDrawer, SwipeableDrawerProps } from '@mui/material'
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
import { useTheme } from '@mui/system'

import constants from '../../constants'
import LeftNavigationListItem from '../LeftNavigaionListItem'
import NewPostButton from '../NewPostButton'
import useAuth from '../../utils/auth/useAuth'

const { TOPICS_ENABLED, TOP_NAVIGATION_HEIGHT } = constants

interface PropTypes {
  open: boolean
  onOpen: SwipeableDrawerProps['onOpen']
  onClose: SwipeableDrawerProps['onClose']
}

const NAVIGATION_ITEMS = [
  {
    exact: true,
    href: '/',
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

const LeftNavigationMobile = ({ open, onOpen, onClose }: PropTypes) => {
  const user = useAuth()
  const { displayName, email, uid } = user ?? {}
  const theme = useTheme()
  const navMarginBottomXs = theme.spacing(4)

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Box
        role="presentation"
        sx={{
          paddingTop: `calc(${TOP_NAVIGATION_HEIGHT} + ${navMarginBottomXs})`,
          paddingLeft: 2,
          paddingRight: 2,
          width: '280px',
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
    </SwipeableDrawer>
  )
}

export default LeftNavigationMobile
