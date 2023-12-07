import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material'
import { useAuthUser } from 'next-firebase-auth'
import Link from 'next/link'
import EmailVerificationLink from '../EmailVerificationLink'
import { KeyboardArrowRightRounded } from '@mui/icons-material'

const ProfileEmailListItem = () => {
  const authUser = useAuthUser()

  return (
    <ListItem disableGutters>
      <ListItemButton
        component={Link}
        href="/profile/email"
        sx={{ borderTop: 0 }}
      >
        <ListItemText secondary={authUser.email}>
          Email
          {!authUser.emailVerified && (
            <>
              &ensp;
              <Typography variant="caption" color="error">
                not verified
              </Typography>
            </>
          )}
        </ListItemText>
        {authUser.emailVerified && (
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <KeyboardArrowRightRounded />
          </ListItemIcon>
        )}
        {!authUser.emailVerified && (
          <ListItemSecondaryAction>
            <EmailVerificationLink />
          </ListItemSecondaryAction>
        )}
      </ListItemButton>
    </ListItem>
  )
}
export default ProfileEmailListItem
