import Link from 'next/link'
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
  ViewStreamRounded,
  TagRounded,
  Person,
  ChatRounded,
  FavoriteRounded,
  ReplyAllRounded,
} from '@mui/icons-material'

import constants from '../../constants'

const { TOP_NAVIGATION_HEIGHT } = constants

interface PropTypes {
  open: boolean
  onOpen: SwipeableDrawerProps['onOpen']
  onClose: SwipeableDrawerProps['onClose']
}

const LeftNavigationMobile = ({ open, onOpen, onClose }: PropTypes) => (
  <SwipeableDrawer anchor="left" open={open} onClose={onClose} onOpen={onOpen}>
    <Box
      role="presentation"
      sx={{
        paddingTop: TOP_NAVIGATION_HEIGHT,
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Box>
        <nav>
          <List>
            <ListItem disablePadding>
              <Link href="/feed" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <ViewStreamRounded />
                  </ListItemIcon>
                  <ListItemText primary="Feed" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/hashtags" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <TagRounded />
                  </ListItemIcon>
                  <ListItemText primary="Hashtags" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </nav>
        <Divider />
        <nav>
          <List>
            <ListItem disablePadding>
              <Link href="/profile/likes" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <FavoriteRounded />
                  </ListItemIcon>
                  <ListItemText primary="Likes" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/profile/posts" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <ChatRounded />
                  </ListItemIcon>
                  <ListItemText primary="Posts" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/profile/replies" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <ReplyAllRounded />
                  </ListItemIcon>
                  <ListItemText primary="Replies" />
                </ListItemButton>
              </Link>
            </ListItem>
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
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </nav>
      </Box>
    </Box>
  </SwipeableDrawer>
)

export default LeftNavigationMobile
