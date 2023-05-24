import { Box, CircularProgress } from '@mui/material'
import { Hashtag } from '../../types'
import SidebarHashtagListItem from '../SidebarHashtagListItem'
import PostList from '../PostList'

type PropTypes = {
  isLoading?: boolean
  hashtags: Hashtag[]
}
const SidebarHashtagsList = ({ isLoading, hashtags }: PropTypes) => {
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
        {hashtags.map(hashtag => (
          <li key={hashtag.data.id}>
            <SidebarHashtagListItem hashtag={hashtag} />
          </li>
        ))}
      </PostList>
    </Box>
  )
}

export default SidebarHashtagsList
