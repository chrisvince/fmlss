import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { SyntheticEvent } from 'react'

import { Hashtag } from '../../types'
import formatCount from '../../utils/formatCount'

type PropTypes = {
  hashtag: Hashtag
}

const HashtagListItem = ({ hashtag }: PropTypes) => {
  const { push: navigate } = useRouter()

  const handleClick = (event: SyntheticEvent) => {
    if (window.getSelection()?.toString().length) return
    navigate(`/hashtag/${hashtag.data.hashtag}`)
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        borderTop: '1px solid #eee',
        padding: '15px 0 30px 0',
      }}
    >
      <Typography variant="h4">
        #{hashtag.data.hashtag}
      </Typography>
      <Box>
        {formatCount(hashtag.data.usageCount)} posts
      </Box>
    </Box>
  )
}

export default HashtagListItem
