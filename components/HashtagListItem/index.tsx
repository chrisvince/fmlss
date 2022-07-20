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
        <div>
          <Typography variant="body2" component="div" align="right">
            {formatPostCount(hashtag.data.usageCount)}
          </Typography>
          <Typography variant="body2" component="div" align="right">
            {formatViewCount(hashtag.data.viewCount)}
          </Typography>
        </div>
      </Box>
    </ListItemFrame>
  )
}

export default HashtagListItem
