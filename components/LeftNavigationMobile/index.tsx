import Link from 'next/link'
import { useAuthUser } from 'next-firebase-auth'
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  SwipeableDrawerProps,
} from '@mui/material'
import {
  ChatOutlined,
  ChatRounded,
  FavoriteBorderOutlined,
  FavoriteRounded,
  PersonRounded,
  ReplyAllRounded,
  TagRounded,
  ViewStreamOutlined,
  ViewStreamRounded,
  WorkspacesOutlined,
  WorkspacesRounded,
} from '@mui/icons-material'
import { useTheme } from '@mui/system'
import useUser from '../../utils/data/user/useUser'

import constants from '../../constants'
import LeftNavigationListItem from '../LeftNavigaionListItem'
import NewPostButton from '../NewPostButton'

const { TOP_NAVIGATION_HEIGHT } = constants

interface PropTypes {
  open: boolean
  onOpen: SwipeableDrawerProps['onOpen']
  onClose: SwipeableDrawerProps['onClose']
}

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

const LeftNavigationMobile = ({ open, onOpen, onClose }: PropTypes) => {
  const { email } = useAuthUser()
  const theme = useTheme()
  const { user } = useUser()
  const avatarLetter = user?.data.username?.charAt(0).toUpperCase()
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
                ({ currentPaths, href, icon: Icon, label, iconCurrent }) => (
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
                avatarText={avatarLetter}
                exact
                href="/profile"
                iconCurrent={PersonRounded}
                primary="Profile"
                secondary={user?.data.username ?? email}
              />
            </List>
          </nav>
        </Box>
      </Box>
    </SwipeableDrawer>
  )
}

export default LeftNavigationMobile
