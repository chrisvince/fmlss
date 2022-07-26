import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

import { Hashtag } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import formatViewCount from '../../utils/formatting/formatViewCount'
import ListItemFrame from '../ListItemFrame'

type PropTypes = {
  hashtag: Hashtag
}

const HashtagListItem = ({ hashtag }: PropTypes) => {
  const { push: navigate } = useRouter()
  const handleOpen = () => navigate(`/hashtag/${hashtag.data.hashtag}`)

  const postCount = formatPostCount(hashtag.data.usageCount)
  const viewCount = formatViewCount(hashtag.data.viewCount)

  return (
    <ListItemFrame onOpen={handleOpen}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          component="div"
          variant="h5"
        >
          #{hashtag.data.hashtag}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          {postCount && (
            <Typography
              variant="caption"
              component="div"
              align="right"
            >
              {postCount}
            </Typography>
          )}
          {viewCount && (
            <Typography
              variant="caption"
              component="div"
              align="right"
            >
              {viewCount}
            </Typography>
          )}
        </Box>
      </Box>
    </ListItemFrame>
  )
}

export default HashtagListItem
