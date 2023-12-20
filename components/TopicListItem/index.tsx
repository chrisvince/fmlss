import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import { Topic } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import formatViewCount from '../../utils/formatting/formatViewCount'
import ListItemFrame from '../ListItemFrame'
import { ElementType } from 'react'
import formatSubtopicsCount from '../../utils/formatting/formatSubtopicsCount'
import TopicPathTitleText from '../TopicPathTitleText'

type PropTypes = {
  topic: Topic
  component?: ElementType<any> & (ElementType<any> | undefined)
}

const TopicListItem = ({ component, topic }: PropTypes) => {
  const recursivePostCount = formatPostCount(topic.data.recursivePostCount)

  const recursiveSubtopicCount = formatSubtopicsCount(
    topic.data.recursiveSubtopicCount
  )

  const viewCount = formatViewCount(topic.data.viewCount)

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
        <Typography component="div" variant="body1">
          <TopicPathTitleText>{topic.data.pathTitle}</TopicPathTitleText>
        </Typography>
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
