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
  ChatRounded,
  FavoriteRounded,
  PersonRounded,
  ReplyAllRounded,
  TagRounded,
  ViewStreamRounded,
} from '@mui/icons-material'

import constants from '../../constants'

const { TOP_NAVIGATION_HEIGHT } = constants

interface PropTypes {
  open: boolean
  onOpen: SwipeableDrawerProps['onOpen']
  onClose: SwipeableDrawerProps['onClose']
}

const LeftNavigationMobile = ({ open, onOpen, onClose }: PropTypes) => {
  const { email } = useAuthUser()

  return (
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
                    <ListItemText>Feed</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/hashtags" passHref>
                  <ListItemButton>
                    <ListItemIcon>
                      <TagRounded />
                    </ListItemIcon>
                    <ListItemText>Hashtags</ListItemText>
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
                    <ListItemText>Likes</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/profile/posts" passHref>
                  <ListItemButton>
                    <ListItemIcon>
                      <ChatRounded />
                    </ListItemIcon>
                    <ListItemText>Posts</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/profile/replies" passHref>
                  <ListItemButton>
                    <ListItemIcon>
                      <ReplyAllRounded />
                    </ListItemIcon>
                    <ListItemText>Replies</ListItemText>
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
                      <PersonRounded />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile"
                      secondary={email}
                    />
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
