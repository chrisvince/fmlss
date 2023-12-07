import { List, ListSubheader } from '@mui/material'
import MobileContainer from '../MobileContainer'
import { Box } from '@mui/system'

interface ProfileListProps {
  children: React.ReactNode
  heading: string
}

const ProfileList = ({ children, heading }: ProfileListProps) => (
  <Box sx={{ marginTop: 4 }}>
    <MobileContainer>
      <ListSubheader component="div" disableGutters>
        {heading}
      </ListSubheader>
    </MobileContainer>
    <List
      sx={{
        padding: 0,
        '& .MuiListItemButton-root': {
          borderRadius: 0,
        },
        '& > .MuiListItem-root, & > .MuiListItem-container': {
          padding: 0,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
        },
        '& > .MuiListItem-root:first-of-type, & > .MuiListItem-container:first-of-type':
          {
            borderTop: '1px solid',
            borderTopColor: 'divider',
          },
      }}
    >
      {children}
    </List>
  </Box>
)

export default ProfileList
