import { Box, CircularProgress } from '@mui/material'
import { Hashtag } from '../../types'
import MiniHashtagListItem from '../MiniHashtagListItem'
import PostList from '../PostList'

type PropTypes = {
  isLoading?: boolean
  hashtags: Hashtag[]
}
const MiniHashtagsList = ({
  isLoading,
  hashtags,
}: PropTypes) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingY: 12,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!hashtags.length) return null

  return (
    <Box>
      <PostList>
        {hashtags.map((hashtag) => (
          <li key={hashtag.data.id}>
            <MiniHashtagListItem hashtag={hashtag} />
          </li>
        ))}
      </PostList>
    </Box>
  )
}

export default MiniHashtagsList
