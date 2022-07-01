import { Button, ButtonGroup } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import { ReactNode } from 'react'
import NewPostButton from '../NewPostButton'

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
  return (
    <Box component="nav">
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
