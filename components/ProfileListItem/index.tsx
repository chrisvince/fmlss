import { KeyboardArrowRightRounded } from '@mui/icons-material'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Link from 'next/link'

interface ProfileListItemProps {
  href: string
  primaryText: string
  secondaryText?: string | null
}

const ProfileListItem = ({
  href,
  primaryText,
  secondaryText,
}: ProfileListItemProps) => (
  <ListItem disableGutters>
    <ListItemButton component={Link} href={href}>
      <ListItemText primary={primaryText} secondary={secondaryText} />
      <ListItemIcon sx={{ minWidth: 'unset' }}>
        <KeyboardArrowRightRounded />
      </ListItemIcon>
    </ListItemButton>
  </ListItem>
)

export default ProfileListItem
