import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import { Topic } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import formatViewCount from '../../utils/formatting/formatViewCount'
import ListItemFrame from '../ListItemFrame'
import formatSubtopicsCount from '../../utils/formatting/formatSubtopicsCount'
import constants from '../../constants'

const { SHOW_VIEW_COUNTS } = constants

type PropTypes = {
  topic: Topic
}

const TopicListItem = ({ topic }: PropTypes) => {
  const postCountRecursive = formatPostCount(topic.data.postCountRecursive)

  const subtopicCountRecursive = formatSubtopicsCount(
    topic.data.subtopicCountRecursive
  )

  const viewCount = formatViewCount(topic.data.viewCount)

  const title = (
    <Typography component="div" variant="body1">
      {topic.data.title}
    </Typography>
  )

  return (
    <ListItemFrame isLink href={`/topic/${topic.data.path}`}>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
            whiteSpace: 'nowrap',
          }}
        >
          <Typography variant="caption" component="div" align="right">
            {postCountRecursive}
          </Typography>
          {topic.data.subtopicCountRecursive > 0 && (
            <Typography variant="caption" component="div" align="right">
              {subtopicCountRecursive}
            </Typography>
          )}
          {viewCount && SHOW_VIEW_COUNTS && (
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
