import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  checked?: boolean
  children?: ReactNode
  onClick?: () => void
}

const ProfileToggleListItem = ({ checked, children, onClick }: Props) => {
  return (
    <ListItem>
      <ListItemText>{children}</ListItemText>
      <ListItemSecondaryAction>
        <Switch onClick={onClick} checked={checked} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}
export default ProfileToggleListItem
