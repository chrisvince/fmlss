import { Box, CircularProgress } from '@mui/material'
import PostList from '../PostList'
import { Person } from '../../types'
import SidebarPersonListItem from '../SidebarPersonListItem'

type PropTypes = {
  isLoading?: boolean
  people: Person[]
}
const SidebarPeopleList = ({ isLoading, people }: PropTypes) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingY: 12,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!people.length) return null

  return (
    <Box>
      <PostList>
        {people.map(person => (
          <li key={person.data.id}>
            <SidebarPersonListItem person={person} />
          </li>
        ))}
      </PostList>
    </Box>
  )
}

export default SidebarPeopleList
