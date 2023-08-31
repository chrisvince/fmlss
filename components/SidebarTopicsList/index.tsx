import { Box, CircularProgress } from '@mui/material'
import { Topic } from '../../types'
import SidebarTopicListItem from '../SidebarTopicListItem'
import PostList from '../PostList'

type PropTypes = {
  isLoading?: boolean
  topics: Topic[]
}
const SidebarTopicsList = ({ isLoading, topics }: PropTypes) => {
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

  if (!topics.length) return null

  return (
    <div>
      <PostList>
        {topics.map(topic => (
          <li key={topic.data.id}>
            <SidebarTopicListItem topic={topic} />
          </li>
        ))}
      </PostList>
    </div>
  )
}

export default SidebarTopicsList
