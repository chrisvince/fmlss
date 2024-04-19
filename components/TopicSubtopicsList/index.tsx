import { Box } from '@mui/system'

import { Topic } from '../../types'
import TopicListItem from '../TopicListItem'

type PropTypes = {
  topics: Topic[]
}

const TopicSubtopicsList = ({ topics }: PropTypes) => (
  <Box
    component="ul"
    sx={{ padding: 0, margin: 0, '& li': { listStyle: 'none' } }}
  >
    {topics.map(topic => (
      <TopicListItem topic={topic} key={topic.data.id} />
    ))}
  </Box>
)

export default TopicSubtopicsList
