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

const SettingsToggleListItem = ({ checked, children, onClick }: Props) => (
  <ListItem>
    <ListItemText>{children}</ListItemText>
    <ListItemSecondaryAction>
      <Switch onClick={onClick} checked={checked} />
    </ListItemSecondaryAction>
  </ListItem>
)

export default SettingsToggleListItem
