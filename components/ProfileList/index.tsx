import { List, ListSubheader } from '@mui/material'
import MobileContainer from '../MobileContainer'

interface ProfileListProps {
  children: React.ReactNode
  heading: string
}

const ProfileList = ({ children, heading }: ProfileListProps) => (
  <List
    sx={{
      '& .MuiListItemButton-root': {
        borderRadius: 0,
      },
      '& > .MuiListItem-root, & > .MuiListItem-container:not(:first-of-type)': {
        padding: 0,
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        '&:first-of-type': {
          borderTop: '1px solid',
          borderTopColor: 'divider',
        },
        '& > .MuiListItem-root': {
          padding: 0,
        },
      },
    }}
    subheader={
      <MobileContainer>
        <ListSubheader component="div" disableGutters>
          {heading}
        </ListSubheader>
      </MobileContainer>
    }
  >
    {children}
  </List>
)

export default ProfileList
