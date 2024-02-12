import { List, ListSubheader, useTheme } from '@mui/material'
import MobileContainer from '../MobileContainer'
import { Box } from '@mui/system'

interface ProfileListProps {
  children: React.ReactNode
  heading?: string
  id?: string
}

const ProfileList = ({ children, heading, id }: ProfileListProps) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        marginTop: 4,
        [theme.breakpoints.up('sm')]: {
          '&::before': {
            content: "''",
            display: 'block',
            height: '95px',
            marginTop: '-95px',
            visibility: 'hidden',
          },
        },
      }}
      id={id}
    >
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
}

export default ProfileList
