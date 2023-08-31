import { useAuthUser } from 'next-firebase-auth'
import { Box, List, SwipeableDrawer, SwipeableDrawerProps } from '@mui/material'
import {
  ChatOutlined,
  ChatRounded,
  FavoriteBorderOutlined,
  FavoriteRounded,
  PersonRounded,
  ReplyAllRounded,
  StarOutlineRounded,
  StarRounded,
  TagRounded,
  ViewStreamOutlined,
  ViewStreamRounded,
  AlternateEmailRounded,
} from '@mui/icons-material'
import { useTheme } from '@mui/system'

import constants from '../../constants'
import LeftNavigationListItem from '../LeftNavigaionListItem'
import NewPostButton from '../NewPostButton'

const { TOPICS_ENABLED, TOP_NAVIGATION_HEIGHT } = constants

interface PropTypes {
  open: boolean
  onOpen: SwipeableDrawerProps['onOpen']
  onClose: SwipeableDrawerProps['onClose']
}

const NAVIGATION_ITEMS = [
  {
    exact: true,
    href: '/feed',
    icon: ViewStreamOutlined,
    iconCurrent: ViewStreamRounded,
    label: 'Feed',
  },
  {
    href: '/feed/popular',
    icon: StarOutlineRounded,
    iconCurrent: StarRounded,
    label: 'Popular',
  },
  ...(TOPICS_ENABLED
    ? [
        {
          currentPaths: ['/topics', '/topic'],
          href: '/topics',
          icon: AlternateEmailRounded,
          iconCurrent: AlternateEmailRounded,
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
    href: '/profile/likes',
    icon: FavoriteBorderOutlined,
    iconCurrent: FavoriteRounded,
    label: 'Likes',
  },
  {
    href: '/profile/posts',
    icon: ChatOutlined,
    iconCurrent: ChatRounded,
    label: 'Posts',
  },
  {
    href: '/profile/replies',
    icon: ReplyAllRounded,
    label: 'Replies',
  },
]

const LeftNavigationMobile = ({ open, onOpen, onClose }: PropTypes) => {
  const { displayName, email, id: uid } = useAuthUser()
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
                href={uid ? '/profile' : '/'}
                icon={PersonRounded}
                iconCurrent={PersonRounded}
                primary={uid ? 'Profile' : 'Sign in'}
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
