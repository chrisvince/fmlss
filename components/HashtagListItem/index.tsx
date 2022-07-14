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
      <Typography variant="h4">
        #{hashtag.data.hashtag}
      </Typography>
      <Box>
        {formatPostCount(hashtag.data.usageCount)}
      </Box>
    </ListItemFrame>
  )
}

export default HashtagListItem
