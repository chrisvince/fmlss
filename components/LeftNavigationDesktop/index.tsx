import { Box } from '@mui/system'
import { List, useTheme } from '@mui/material'
import {
  ChatOutlined,
  ChatRounded,
  FavoriteBorderOutlined,
  FavoriteRounded,
  PersonOutlineRounded,
  PersonRounded,
  ReplyAllRounded,
  TagRounded,
  ViewStreamOutlined,
  ViewStreamRounded,
  WorkspacesOutlined,
  WorkspacesRounded,
} from '@mui/icons-material'

import NewPostButton from '../NewPostButton'
import constants from '../../constants'
import { useAuthUser } from 'next-firebase-auth'
import LeftNavigationListItem from '../LeftNavigaionListItem'

const {
  LEFT_NAVIGATION_PADDING_BOTTOM,
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
} = constants

const NAVIGATION_ITEMS = [
  {
    href: '/feed',
    icon: ViewStreamOutlined,
    iconCurrent: ViewStreamRounded,
    label: 'Feed',
  },
  {
    currentPaths: ['/categories', '/category'],
    href: '/categories',
    icon: WorkspacesOutlined,
    iconCurrent: WorkspacesRounded,
    label: 'Categories',
  },
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

const LeftNavigationDesktop = () => {
  const { email } = useAuthUser()
  const theme = useTheme()
  const navMarginBottomSm = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)
  const marginBottom = theme.spacing(LEFT_NAVIGATION_PADDING_BOTTOM)

  return (
    <Box
      sx={{
        position: 'sticky',
        top: `calc(${TOP_NAVIGATION_HEIGHT} + ${navMarginBottomSm})`,
        height: `calc(100vh - ${
          TOP_NAVIGATION_HEIGHT
        } - ${navMarginBottomSm} - ${marginBottom})`,
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
                ({ currentPaths, href, icon:Icon, iconCurrent, label }) => (
                  <LeftNavigationListItem
                    currentPaths={currentPaths}
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
                avatarText="C"
                exact
                href="/profile"
                iconCurrent={PersonRounded}
                primary="Profile"
                secondary={email}
              />
            </List>
          </nav>
        </Box>
      </Box>
    </Box>
  )
}

export default LeftNavigationDesktop
