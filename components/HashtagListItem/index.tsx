import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

import { Hashtag } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
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
          variant="h5"
          component="div"
        >
          #{hashtag.data.hashtag}
        </Typography>
        <Typography variant="body2">
          {formatPostCount(hashtag.data.usageCount)}
        </Typography>
      </Box>
    </ListItemFrame>
  )
}

export default HashtagListItem
