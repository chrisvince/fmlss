import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { useUser } from 'next-firebase-auth'
import Link from 'next/link'
import EmailVerificationLink from '../EmailVerificationLink'
import { KeyboardArrowRightRounded } from '@mui/icons-material'
import MobileContainer from '../MobileContainer'

const SettingsEmailListItem = () => {
  const authUser = useUser()

  return (
    <>
      <ListItem disableGutters>
        <ListItemButton
          component={Link}
          href="/settings/email"
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
            <MobileContainer>
              <EmailVerificationLink />
            </MobileContainer>
          </ListItemText>
        </ListItem>
      )}
    </>
  )
}
export default SettingsEmailListItem
