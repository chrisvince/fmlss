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

import constants from '../../constants'
import LeftNavigationListItem from '../LeftNavigaionListItem'
import NewPostButton from '../NewPostButton'
import { useTheme } from '@mui/system'

const { TOP_NAVIGATION_HEIGHT, TOP_NAVIGATION_MARGIN_BOTTOM_XS } = constants

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
    href: '/hashtags',
    icon: TagRounded,
    label: 'Hashtags',
  },
  {
    href: '/categories',
    icon: WorkspacesOutlined,
    iconCurrent: WorkspacesRounded,
    label: 'Categories',
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


  const navMarginBottomXs = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_XS)


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
                ({ href, icon: Icon, label, iconCurrent }) => (
                  <LeftNavigationListItem
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
              <ListItem disablePadding>
                <Link href="/profile" passHref>
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonRounded />
                    </ListItemIcon>
                    <ListItemText primary="Profile" secondary={email} />
                  </ListItemButton>
                </Link>
              </ListItem>
            </List>
          </nav>
        </Box>
      </Box>
    </SwipeableDrawer>
  )
}

export default LeftNavigationMobile
