import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Link from 'next/link'
import EmailVerificationLink from '../EmailVerificationLink'
import { KeyboardArrowRightRounded } from '@mui/icons-material'
import MobileContainer from '../MobileContainer'
import useAuth from '../../utils/auth/useAuth'

const SettingsEmailListItem = () => {
  const user = useAuth()

  return (
    <>
      <ListItem disableGutters>
        <ListItemButton
          component={Link}
          href="/settings/email"
          sx={{ borderTop: 0 }}
        >
          <ListItemText secondary={user?.email}>Email</ListItemText>
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <KeyboardArrowRightRounded />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      {!user?.emailVerified && (
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
