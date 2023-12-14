import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { useAuthUser } from 'next-firebase-auth'
import Link from 'next/link'
import EmailVerificationLink from '../EmailVerificationLink'
import { KeyboardArrowRightRounded } from '@mui/icons-material'

const ProfileEmailListItem = () => {
  const authUser = useAuthUser()

  return (
    <>
      <ListItem disableGutters>
        <ListItemButton
          component={Link}
          href="/profile/email"
          sx={{ borderTop: 0 }}
        >
          <ListItemText secondary={authUser.email}>Email</ListItemText>
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <KeyboardArrowRightRounded />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      {!authUser.emailVerified && (
        <ListItem
          disableGutters
          sx={{ borderBottom: '0 !important', textAlign: 'right' }}
        >
          <ListItemText>
            <EmailVerificationLink />
          </ListItemText>
        </ListItem>
      )}
    </>
  )
}
export default ProfileEmailListItem
