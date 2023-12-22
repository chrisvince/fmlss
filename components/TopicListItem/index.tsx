import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import { Topic } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import formatViewCount from '../../utils/formatting/formatViewCount'
import ListItemFrame from '../ListItemFrame'
import { ElementType } from 'react'
import formatSubtopicsCount from '../../utils/formatting/formatSubtopicsCount'

type PropTypes = {
  component?: ElementType<any> & (ElementType<any> | undefined)
  topic: Topic
}

const TopicListItem = ({ component, topic }: PropTypes) => {
  const recursivePostCount = formatPostCount(topic.data.recursivePostCount)

  const recursiveSubtopicCount = formatSubtopicsCount(
    topic.data.recursiveSubtopicCount
  )

  const viewCount = formatViewCount(topic.data.viewCount)

  const title = (
    <Typography component="div" variant="body1">
      {topic.data.title}
    </Typography>
  )

  return (
    <ListItemFrame component={component} href={`/topic/${topic.data.path}`}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {topic.data.description ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {title}
            <Typography variant="caption">{topic.data.description}</Typography>
          </Box>
        ) : (
          title
        )}
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="caption" component="div" align="right">
            {recursivePostCount}
          </Typography>
          <Typography variant="caption" component="div" align="right">
            {recursiveSubtopicCount}
          </Typography>
          {viewCount && (
            <Typography variant="caption" component="div" align="right">
              {viewCount}
            </Typography>
          )}
        </Box>
      </Box>
    </ListItemFrame>
  )
}

export default TopicListItem
