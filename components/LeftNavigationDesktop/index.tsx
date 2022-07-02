import { Button, ButtonGroup, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import { ReactNode } from 'react'

import NewPostButton from '../NewPostButton'
import constants from '../../constants'

const {
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
} = constants

interface PropTypes {
  href: string,
  children: ReactNode,
}

const NavigationLink = ({ href, children }: PropTypes) => (
  <Link href={href} passHref>
    <Button>{children}</Button>
  </Link>
)

const LeftNavigationDesktop = () => {
  const theme = useTheme()
  const naviMarginBottomXs = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_XS)
  const naviMarginBottomSm = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: {
          xs: `calc(${TOP_NAVIGATION_HEIGHT} + ${naviMarginBottomXs})`,
          sm: `calc(${TOP_NAVIGATION_HEIGHT} + ${naviMarginBottomSm})`,
        },
      }}
    >
      <NewPostButton />
      <ButtonGroup orientation="vertical" fullWidth>
        <NavigationLink href="/">Feed</NavigationLink>
        <NavigationLink href="/profile">Profile</NavigationLink>
        <NavigationLink href="/profile/likes">Likes</NavigationLink>
        <NavigationLink href="/profile/posts">Posts</NavigationLink>
        <NavigationLink href="/profile/replies">Replies</NavigationLink>
      </ButtonGroup>
    </Box>
  )
}

export default LeftNavigationDesktop
