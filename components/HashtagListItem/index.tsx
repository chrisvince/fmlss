import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import { Hashtag } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import formatViewCount from '../../utils/formatting/formatViewCount'
import ListItemFrame from '../ListItemFrame'
import constants from '../../constants'

const { SHOW_VIEW_COUNTS } = constants

type PropTypes = {
  hashtag: Hashtag
}

const HashtagListItem = ({ hashtag }: PropTypes) => {
  const postCount = formatPostCount(hashtag.data.postCount)
  const viewCount = formatViewCount(hashtag.data.viewCount)

  return (
    <ListItemFrame
      href={`/hashtag/${encodeURIComponent(hashtag.data.slug)}`}
      isLink
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography component="div" variant="h5">
          {hashtag.data.display}
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

export default HashtagListItem
