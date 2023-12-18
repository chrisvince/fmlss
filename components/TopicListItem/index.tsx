import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import { Topic } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import formatViewCount from '../../utils/formatting/formatViewCount'
import ListItemFrame from '../ListItemFrame'
import TopicPathTitleText from '../TopicPathTitleText'

type PropTypes = {
  topic: Topic
  component?: ElementType<any> & (ElementType<any> | undefined)
}

const TopicListItem = ({ topic }: PropTypes) => {
  const postCount = formatPostCount(topic.data.postCount)
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
        <Typography component="div" variant="h5">
          <TopicPathTitleText>{topic.data.pathTitle}</TopicPathTitleText>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
            whiteSpace: 'nowrap',
          }}
        >
          {postCount && (
            <Typography variant="caption" component="div" align="right">
              {postCount}
            </Typography>
          )}
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
